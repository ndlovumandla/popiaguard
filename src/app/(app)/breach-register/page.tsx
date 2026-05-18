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
import { Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
const sevMap: Record<string,'success'|'danger'|'warning'|'default'> = { low:'success', medium:'default', high:'warning', critical:'danger' };
export default function BreachRegisterPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const init = { title:'', description:'', discoveredAt:new Date().toISOString().slice(0,16), severity:'medium' as 'low'|'medium'|'high'|'critical', affectedDataSubjects:0 };
  const [form, setForm] = useState(init);
  const { data, isLoading } = useQuery({ queryKey:['breaches'], queryFn:()=>fetch('/api/breaches').then(r=>r.json()) });
  const breaches: Record<string,unknown>[] = data?.data?.breaches ?? [];
  const save = useMutation({
    mutationFn: async (d: typeof form) => {
      const res = await fetch('/api/breaches', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ ...d, discoveredAt:new Date(d.discoveredAt).toISOString() }) });
      if (!res.ok) throw new Error((await res.json()).message);
      return res.json();
    },
    onSuccess: () => { toast.success('Breach logged'); qc.invalidateQueries({queryKey:['breaches']}); setOpen(false); setForm(init); },
    onError: (e: Error) => toast.error(e.message),
  });
  const markReported = useMutation({
    mutationFn: (id: string) => fetch('/api/breaches/'+id, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ reportedToRegulator:true, reportedAt:new Date().toISOString(), status:'reported' }) }).then(r=>r.json()),
    onSuccess: () => { toast.success('Marked as reported'); qc.invalidateQueries({queryKey:['breaches']}); },
  });
  const cols = [
    { key:'title', header:'Title', render:(r: Record<string,unknown>)=><span className="font-medium">{r.title as string}</span> },
    { key:'severity', header:'Severity', render:(r: Record<string,unknown>)=><Badge variant={sevMap[r.severity as string]||'default'}>{r.severity as string}</Badge> },
    { key:'status', header:'Status', render:(r: Record<string,unknown>)=><Badge variant={(r.status==='closed'?'success':r.status==='reported'?'default':'warning') as 'success'|'default'|'warning'}>{r.status as string}</Badge> },
    { key:'discoveredAt', header:'Discovered', render:(r: Record<string,unknown>)=><span>{formatDate(r.discoveredAt as string)}</span> },
    { key:'affectedDataSubjects', header:'Affected', render:(r: Record<string,unknown>)=><span>{String(r.affectedDataSubjects)}</span> },
    { key:'reportedToRegulator', header:'Reported', render:(r: Record<string,unknown>)=>(r.reportedToRegulator?<CheckCircle2 className="w-4 h-4 text-green-500" />:<Button size="sm" variant="ghost" onClick={()=>markReported.mutate(r.id as string)}>Report</Button>) },
  ];
  return (
    <>
      <Header title="Breach Register" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">{breaches.length} incidents logged</p>
          <Button onClick={()=>setOpen(true)}><Plus className="w-4 h-4 mr-2" />Log Breach</Button>
        </div>
        {isLoading ? <div className="animate-pulse h-48 bg-gray-100 rounded-xl" /> :
          breaches.length === 0 ? <EmptyState icon={AlertTriangle} title="No breach incidents" description="Log security incidents and data breaches as required by POPIA." action={{ label:'Log first breach', onClick:()=>setOpen(true) }} /> :
          <div className="bg-white rounded-xl border border-border overflow-hidden"><DataTable columns={cols} data={breaches} /></div>}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Log Breach Incident</DialogTitle></DialogHeader>
          <form onSubmit={e=>{e.preventDefault();save.mutate(form);}} className="space-y-4">
            <div className="space-y-2"><Label>Title *</Label><Input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required /></div>
            <div className="space-y-2"><Label>Description *</Label><Textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Discovered at *</Label><Input type="datetime-local" value={form.discoveredAt} onChange={e=>setForm(p=>({...p,discoveredAt:e.target.value}))} required /></div>
              <div className="space-y-2"><Label>Severity</Label><Select value={form.severity} onValueChange={(v)=>setForm(p=>({...p,severity:v as typeof form.severity}))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="critical">Critical</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label>Affected data subjects</Label><Input type="number" value={form.affectedDataSubjects} onChange={e=>setForm(p=>({...p,affectedDataSubjects:parseInt(e.target.value)||0}))} min="0" /></div>
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
