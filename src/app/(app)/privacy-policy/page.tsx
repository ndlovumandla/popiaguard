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
import { Plus, BookOpen, Sparkles, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
const stMap: Record<string,'success'|'danger'|'warning'|'default'> = { published:'success', draft:'default', archived:'warning' };
export default function PrivacyPolicyPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const init = { title:'Privacy Policy', content:'', version:'1.0' };
  const [form, setForm] = useState(init);
  const { data, isLoading } = useQuery({ queryKey:['policies'], queryFn:()=>fetch('/api/policies').then(r=>r.json()) });
  const policies: Record<string,unknown>[] = data?.data?.policies ?? [];
  const save = useMutation({
    mutationFn: async (d: typeof form) => {
      const res = await fetch('/api/policies', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) });
      if (!res.ok) throw new Error((await res.json()).message);
      return res.json();
    },
    onSuccess: () => { toast.success('Policy saved'); qc.invalidateQueries({queryKey:['policies']}); setOpen(false); setForm(init); },
    onError: (e: Error) => toast.error(e.message),
  });
  const publish = useMutation({
    mutationFn: (id: string) => fetch('/api/policies/'+id+'/publish', { method:'POST' }).then(r=>r.json()),
    onSuccess: () => { toast.success('Policy published!'); qc.invalidateQueries({queryKey:['policies']}); },
  });
  const generate = async () => {
    setGenLoading(true);
    try {
      const res = await fetch('/api/policies/generate', { method:'POST' });
      if (!res.ok) throw new Error((await res.json()).message);
      const json = await res.json();
      setForm(p=>({...p, content:json.data?.content||'', title:json.data?.title||p.title}));
      setOpen(true);
    } catch(e: unknown) { toast.error(e instanceof Error ? e.message : 'Generation failed'); }
    finally { setGenLoading(false); }
  };
  const cols = [
    { key:'title', header:'Title', render:(r: Record<string,unknown>)=><span className="font-medium">{r.title as string}</span> },
    { key:'version', header:'Version' },
    { key:'status', header:'Status', render:(r: Record<string,unknown>)=><Badge variant={stMap[r.status as string]||'default'}>{r.status as string}</Badge> },
    { key:'publishedAt', header:'Published', render:(r: Record<string,unknown>)=><span>{r.publishedAt?formatDate(r.publishedAt as string):'—'}</span> },
    { key:'actions', header:'', render:(r: Record<string,unknown>)=>(
      <div className="flex gap-2">
        {r.status==='draft'&&<Button size="sm" variant="outline" onClick={()=>publish.mutate(r.id as string)}>Publish</Button>}
        {r.status==='published'&&r.slug&&<a href={'/policy/'+r.slug as string} target="_blank" rel="noreferrer"><Button size="sm" variant="ghost"><Globe className="w-3 h-3 mr-1"/>View</Button></a>}
      </div>
    )},
  ];
  return (
    <>
      <Header title="Privacy Policy" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">{policies.length} policies</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={generate} disabled={genLoading}><Sparkles className="w-4 h-4 mr-2" />{genLoading?'Generating…':'AI Generate'}</Button>
            <Button onClick={()=>setOpen(true)}><Plus className="w-4 h-4 mr-2" />New Policy</Button>
          </div>
        </div>
        {isLoading ? <div className="animate-pulse h-48 bg-gray-100 rounded-xl" /> :
          policies.length === 0 ? <EmptyState icon={BookOpen} title="No privacy policies" description="Create or generate a POPIA-compliant privacy policy." action={{ label:'Create policy', onClick:()=>setOpen(true) }} /> :
          <div className="bg-white rounded-xl border border-border overflow-hidden"><DataTable columns={cols} data={policies} /></div>}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Privacy Policy</DialogTitle></DialogHeader>
          <form onSubmit={e=>{e.preventDefault();save.mutate(form);}} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2"><Label>Title *</Label><Input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required /></div>
              <div className="space-y-2"><Label>Version</Label><Input value={form.version} onChange={e=>setForm(p=>({...p,version:e.target.value}))} /></div>
            </div>
            <div className="space-y-2"><Label>Content *</Label><Textarea value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} required className="min-h-[300px] font-mono text-xs" /></div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" type="button" onClick={()=>setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={save.isPending}>{save.isPending?'Saving…':'Save Draft'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
