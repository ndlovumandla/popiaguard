'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/empty-state';
import { Plus, FileCheck2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
const statusMap: Record<string,'success'|'danger'|'warning'|'default'> = { active:'success', withdrawn:'danger', expired:'warning', pending:'default' };
export default function ConsentManagerPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const init = { dataSubjectName:'', dataSubjectEmail:'', purpose:'', consentedAt:new Date().toISOString().slice(0,16), expiresAt:'', evidence:'' };
  const [form, setForm] = useState(init);
  const { data, isLoading } = useQuery({ queryKey:['consent-records'], queryFn:()=>fetch('/api/consent').then(r=>r.json()) });
  const records: Record<string,unknown>[] = data?.data?.records ?? [];
  const save = useMutation({
    mutationFn: async (d: typeof form) => {
      const res = await fetch('/api/consent', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ ...d, consentedAt:new Date(d.consentedAt).toISOString(), expiresAt:d.expiresAt?new Date(d.expiresAt).toISOString():undefined }) });
      if (!res.ok) throw new Error((await res.json()).message);
      return res.json();
    },
    onSuccess: () => { toast.success('Consent recorded'); qc.invalidateQueries({queryKey:['consent-records']}); setOpen(false); setForm(init); },
    onError: (e: Error) => toast.error(e.message),
  });
  const withdraw = useMutation({
    mutationFn: (id: string) => fetch('/api/consent/'+id+'/withdraw', { method:'POST' }).then(r=>r.json()),
    onSuccess: () => { toast.success('Consent withdrawn'); qc.invalidateQueries({queryKey:['consent-records']}); },
  });
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setForm(p=>({...p,[k]:e.target.value}));
  const cols = [
    { key:'dataSubjectName', header:'Data Subject' },
    { key:'dataSubjectEmail', header:'Email' },
    { key:'purpose', header:'Purpose', render:(r: Record<string,unknown>)=><span className="max-w-[200px] truncate block">{r.purpose as string}</span> },
    { key:'status', header:'Status', render:(r: Record<string,unknown>)=><Badge variant={statusMap[r.status as string]||'default'}>{r.status as string}</Badge> },
    { key:'consentedAt', header:'Date', render:(r: Record<string,unknown>)=><span>{formatDate(r.consentedAt as string)}</span> },
    { key:'actions', header:'', render:(r: Record<string,unknown>)=>(r.status==='active'?<Button size="sm" variant="ghost" className="text-red-500" onClick={()=>withdraw.mutate(r.id as string)}>Withdraw</Button>:null) },
  ];
  return (
    <>
      <Header title="Consent Manager" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">{records.length} consent records</p>
          <Button onClick={()=>setOpen(true)}><Plus className="w-4 h-4 mr-2" />Record Consent</Button>
        </div>
        {isLoading ? <div className="animate-pulse h-48 bg-gray-100 rounded-xl" /> :
          records.length === 0 ? <EmptyState icon={FileCheck2} title="No consent records" description="Record consent obtained from data subjects." action={{ label:'Add first record', onClick:()=>setOpen(true) }} /> :
          <div className="bg-white rounded-xl border border-border overflow-hidden"><DataTable columns={cols} data={records} /></div>}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Record Consent</DialogTitle></DialogHeader>
          <form onSubmit={e=>{e.preventDefault();save.mutate(form);}} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Full name *</Label><Input value={form.dataSubjectName} onChange={f('dataSubjectName')} required /></div>
              <div className="space-y-2"><Label>Email *</Label><Input type="email" value={form.dataSubjectEmail} onChange={f('dataSubjectEmail')} required /></div>
            </div>
            <div className="space-y-2"><Label>Purpose *</Label><Textarea value={form.purpose} onChange={f('purpose')} required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Consented at *</Label><Input type="datetime-local" value={form.consentedAt} onChange={f('consentedAt')} required /></div>
              <div className="space-y-2"><Label>Expires at</Label><Input type="datetime-local" value={form.expiresAt} onChange={f('expiresAt')} /></div>
            </div>
            <div className="space-y-2"><Label>Evidence / notes</Label><Textarea value={form.evidence} onChange={f('evidence')} /></div>
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
