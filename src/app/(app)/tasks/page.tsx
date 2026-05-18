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
import { CheckSquare, Plus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
const prMap: Record<string,'danger'|'warning'|'default'|'success'> = { critical:'danger', high:'warning', medium:'default', low:'success' };
export default function TasksPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const init = { title:'', description:'', category:'general', priority:'medium' as 'low'|'medium'|'high'|'critical', dueDate:'', isCritical:false };
  const [form, setForm] = useState(init);
  const { data, isLoading } = useQuery({ queryKey:['tasks'], queryFn:()=>fetch('/api/tasks').then(r=>r.json()) });
  const tasks: Record<string,unknown>[] = data?.data?.tasks ?? [];
  const save = useMutation({
    mutationFn: async (d: typeof form) => {
      const res = await fetch('/api/tasks', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) });
      if (!res.ok) throw new Error((await res.json()).message);
      return res.json();
    },
    onSuccess: () => { toast.success('Task created'); qc.invalidateQueries({queryKey:['tasks']}); setOpen(false); setForm(init); },
    onError: (e: Error) => toast.error(e.message),
  });
  const complete = useMutation({
    mutationFn: (id: string) => fetch('/api/tasks/'+id, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ status:'completed', completedAt:new Date().toISOString() }) }).then(r=>r.json()),
    onSuccess: () => { toast.success('Task completed!'); qc.invalidateQueries({queryKey:['tasks']}); },
  });
  const cols = [
    { key:'title', header:'Task', render:(r: Record<string,unknown>)=><div><p className="font-medium">{r.title as string}</p><p className="text-xs text-muted-foreground">{r.category as string}</p></div> },
    { key:'priority', header:'Priority', render:(r: Record<string,unknown>)=><Badge variant={prMap[r.priority as string]||'default'}>{r.priority as string}</Badge> },
    { key:'status', header:'Status', render:(r: Record<string,unknown>)=><Badge variant={(r.status==='completed'?'success':r.status==='overdue'?'danger':'default') as 'success'|'danger'|'default'}>{r.status as string}</Badge> },
    { key:'dueDate', header:'Due', render:(r: Record<string,unknown>)=><span>{r.dueDate?formatDate(r.dueDate as string):'—'}</span> },
    { key:'actions', header:'', render:(r: Record<string,unknown>)=>(r.status!=='completed'?<Button size="sm" variant="ghost" className="text-green-600" onClick={()=>complete.mutate(r.id as string)}><CheckCircle2 className="w-4 h-4 mr-1"/>Done</Button>:null) },
  ];
  return (
    <>
      <Header title="Compliance Tasks" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">{tasks.filter(t=>t.status==='pending'||t.status==='in_progress').length} open tasks</p>
          <Button onClick={()=>setOpen(true)}><Plus className="w-4 h-4 mr-2" />Add Task</Button>
        </div>
        {isLoading ? <div className="animate-pulse h-48 bg-gray-100 rounded-xl" /> :
          tasks.length === 0 ? <EmptyState icon={CheckSquare} title="No tasks" description="Create compliance tasks to track your POPIA obligations." action={{ label:'Add first task', onClick:()=>setOpen(true) }} /> :
          <div className="bg-white rounded-xl border border-border overflow-hidden"><DataTable columns={cols} data={tasks} /></div>}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Compliance Task</DialogTitle></DialogHeader>
          <form onSubmit={e=>{e.preventDefault();save.mutate(form);}} className="space-y-4">
            <div className="space-y-2"><Label>Title *</Label><Input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} /></div>
              <div className="space-y-2"><Label>Priority</Label><Select value={form.priority} onValueChange={(v)=>setForm(p=>({...p,priority:v as typeof form.priority}))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="critical">Critical</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label>Due date</Label><Input type="date" value={form.dueDate} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))} /></div>
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
