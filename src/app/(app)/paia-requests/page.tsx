'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/empty-state';
import { Plus, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
const stMap: Record<string,'success'|'danger'|'warning'|'default'> = { received:'default', acknowledged:'default', in_progress:'warning', granted:'success', refused:'danger', appealed:'warning' };
export default function PaiaRequestsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const init = { requestorName:'', requestorEmail:'', requestorPhone:'', requestType:'access', description:'', receivedAt:new Date().toISOString().slice(0,16) };
  const [form, setForm] = useState(init);
  const { data, isLoading } = useQuery({ queryKey:['paia-requests'], queryFn:()=>fetch('/api/paia').then(r=>r.json()) });
  const requests: Record<string,unknown>[] = data?.data?.requests ?? [];
  const save = useMutation({
    mutationFn: async (d: typeof form) => {
      const res = await fetch('/api/paia', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ ...d, receivedAt:new Date(d.receivedAt).toISOString() }) });
      if (!res.ok) throw new Error((await res.json()).message);
      return res.json();
    },
    onSuccess: () => { toast.success('Request logged'); qc.invalidateQueries({queryKey:['paia-requests']}); setOpen(false); setForm(init); },
    onError: (e: Error) => toast.error(e.message),
  });
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setForm(p=>({...p,[k]:e.target.value}));
  const cols = [
    { key:'requestorName', header:'Requestor' },
    { key:'requestType', header:'Type', render:(r: Record<string,unknown>)=><Badge>{r.requestType as string}</Badge> },
    { key:'status', header:'Status', render:(r: Record<string,unknown>)=><Badge variant={stMap[r.status as string]||'default'}>{(r.status as string).replace('_',' ')}</Badge> },
    { key:'receivedAt', header:'Received', render:(r: Record<string,unknown>)=><span>{formatDate(r.receivedAt as string)}</span> },
    { key:'dueDate', header:'Due', render:(r: Record<string,unknown>)=><span className={r.dueDate&&new Date(r.dueDate as string)<new Date()?'text-red-500 font-medium':''}>{r.dueDate?formatDate(r.dueDate as string):'—'}</span> },
  ];
  return (
    <>
      <Header title="PAIA Requests" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">{requests.length} requests</p>
          <Button onClick={()=>setOpen(true)}><Plus className="w-4 h-4 mr-2" />Log Request</Button>
        </div>
        {isLoading ? <div className="animate-pulse h-48 bg-gray-100 rounded-xl" /> :
          requests.length === 0 ? <EmptyState icon={FileText} title="No PAIA requests" description="Log and track requests to access information under PAIA." action={{ label:'Log first request', onClick:()=>setOpen(true) }} /> :
          <div className="bg-white rounded-xl border border-border overflow-hidden"><DataTable columns={cols} data={requests} /></div>}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Log PAIA Request</DialogTitle></DialogHeader>
          <form onSubmit={e=>{e.preventDefault();save.mutate(form);}} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Name *</Label><Input value={form.requestorName} onChange={f('requestorName')} required /></div>
              <div className="space-y-2"><Label>Email *</Label><Input type="email" value={form.requestorEmail} onChange={f('requestorEmail')} required /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Phone</Label><Input value={form.requestorPhone} onChange={f('requestorPhone')} /></div>
              <div className="space-y-2"><Label>Type *</Label><Select value={form.requestType} onValueChange={v=>setForm(p=>({...p,requestType:v}))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="access">Access</SelectItem><SelectItem value="correction">Correction</SelectItem><SelectItem value="deletion">Deletion</SelectItem><SelectItem value="objection">Objection</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label>Description *</Label><Textarea value={form.description} onChange={f('description')} required /></div>
            <div className="space-y-2"><Label>Received at *</Label><Input type="datetime-local" value={form.receivedAt} onChange={f('receivedAt')} required /></div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" type="button" onClick={()=>setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={save.isPending}>{save.isPending?'Saving…':'Save'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
