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
import { Plus, Database, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
const BASES = ['consent','contract','legal_obligation','vital_interests','public_task','legitimate_interests'];
const sensMap: Record<string,string> = { general:'default', special:'warning', children:'danger' };
export default function DataInventoryPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string,unknown>|null>(null);
  const [form, setForm] = useState({ name:'', description:'', sensitivity:'general', lawfulBasis:'', retentionPeriodDays:'', purposeOfProcessing:'', thirdPartySharing:false });
  const { data, isLoading } = useQuery({ queryKey:['data-categories'], queryFn:()=>fetch('/api/data-categories').then(r=>r.json()) });
  const categories: Record<string,unknown>[] = data?.data?.categories ?? [];
  const save = useMutation({
    mutationFn: async (d: unknown) => {
      const url = editing ? `/api/data-categories/${(editing as Record<string,unknown>).id}` : '/api/data-categories';
      const res = await fetch(url, { method: editing?'PUT':'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) });
      if (!res.ok) throw new Error((await res.json()).message);
      return res.json();
    },
    onSuccess: () => { toast.success(editing?'Updated!':'Created!'); qc.invalidateQueries({queryKey:['data-categories']}); setOpen(false); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => fetch('/api/data-categories/'+id, { method:'DELETE' }).then(r=>r.json()),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({queryKey:['data-categories']}); },
  });
  const openCreate = () => { setEditing(null); setForm({ name:'',description:'',sensitivity:'general',lawfulBasis:'',retentionPeriodDays:'',purposeOfProcessing:'',thirdPartySharing:false }); setOpen(true); };
  const openEdit = (row: Record<string,unknown>) => { setEditing(row); setForm({ name:row.name as string,description:(row.description as string)||'',sensitivity:(row.sensitivity as string)||'general',lawfulBasis:(row.lawfulBasis as string)||'',retentionPeriodDays:String(row.retentionPeriodDays||''),purposeOfProcessing:(row.purposeOfProcessing as string)||'',thirdPartySharing:(row.thirdPartySharing as boolean)||false }); setOpen(true); };
  const cols = [
    { key:'name', header:'Name' },
    { key:'sensitivity', header:'Sensitivity', render:(r: Record<string,unknown>)=><Badge variant={(sensMap[r.sensitivity as string]||'default') as 'default'|'warning'|'danger'}>{r.sensitivity as string}</Badge> },
    { key:'lawfulBasis', header:'Lawful Basis', render:(r: Record<string,unknown>)=><span>{(r.lawfulBasis as string)||'—'}</span> },
    { key:'retentionPeriodDays', header:'Retention (days)', render:(r: Record<string,unknown>)=><span>{r.retentionPeriodDays?String(r.retentionPeriodDays)+' days':'—'}</span> },
    { key:'actions', header:'', render:(r: Record<string,unknown>)=>(
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={()=>openEdit(r)}><Pencil className="w-3 h-3" /></Button>
        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={()=>del.mutate(r.id as string)}><Trash2 className="w-3 h-3" /></Button>
      </div>
    )},
  ];
  return (
    <>
      <Header title="Data Inventory" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">{categories.length} categories documented</p>
          <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Category</Button>
        </div>
        {isLoading ? <div className="animate-pulse h-48 bg-gray-100 rounded-xl" /> :
          categories.length === 0 ? <EmptyState icon={Database} title="No data categories yet" description="Document the personal information your organisation processes." action={{ label:'Add first category', onClick:openCreate }} /> :
          <div className="bg-white rounded-xl border border-border overflow-hidden"><DataTable columns={cols} data={categories} /></div>}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing?'Edit':'Add'} Data Category</DialogTitle></DialogHeader>
          <form onSubmit={e=>{e.preventDefault();save.mutate({...form,retentionPeriodDays:form.retentionPeriodDays?parseInt(form.retentionPeriodDays):undefined,lawfulBasis:form.lawfulBasis||undefined});}} className="space-y-4">
            <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Sensitivity</Label><Select value={form.sensitivity} onValueChange={v=>setForm(p=>({...p,sensitivity:v}))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="general">General</SelectItem><SelectItem value="special">Special</SelectItem><SelectItem value="children">Children</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Lawful Basis</Label><Select value={form.lawfulBasis} onValueChange={v=>setForm(p=>({...p,lawfulBasis:v}))}><SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger><SelectContent>{BASES.map(b=><SelectItem key={b} value={b}>{b.replace(/_/g,' ')}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label>Retention Period (days)</Label><Input type="number" value={form.retentionPeriodDays} onChange={e=>setForm(p=>({...p,retentionPeriodDays:e.target.value}))} min="1" /></div>
            <div className="space-y-2"><Label>Purpose of Processing</Label><Textarea value={form.purposeOfProcessing} onChange={e=>setForm(p=>({...p,purposeOfProcessing:e.target.value}))} /></div>
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
