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
import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/empty-state';
import { Users, Plus } from 'lucide-react';
import { toast } from 'sonner';
export default function TeamPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email:'', role:'member' });
  const { data, isLoading } = useQuery({ queryKey:['team'], queryFn:()=>fetch('/api/team').then(r=>r.json()) });
  const members: Record<string,unknown>[] = data?.data?.members ?? [];
  const invite = useMutation({
    mutationFn: async (d: typeof form) => {
      const res = await fetch('/api/team/invite', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) });
      if (!res.ok) throw new Error((await res.json()).message);
      return res.json();
    },
    onSuccess: () => { toast.success('Invitation sent!'); qc.invalidateQueries({queryKey:['team']}); setOpen(false); setForm({ email:'', role:'member' }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const roleMap: Record<string,'default'|'secondary'|'outline'|'success'> = { owner:'secondary', admin:'default', member:'outline', viewer:'outline' };
  const cols = [
    { key:'name', header:'Name', render:(r: Record<string,unknown>)=><span className="font-medium">{r.firstName as string} {r.lastName as string}</span> },
    { key:'email', header:'Email' },
    { key:'role', header:'Role', render:(r: Record<string,unknown>)=><Badge variant={roleMap[r.role as string]||'outline'}>{r.role as string}</Badge> },
    { key:'emailVerified', header:'Verified', render:(r: Record<string,unknown>)=><span>{r.emailVerified?'✓':'—'}</span> },
  ];
  return (
    <>
      <Header title="Team" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">{members.length} members</p>
          <Button onClick={()=>setOpen(true)}><Plus className="w-4 h-4 mr-2" />Invite Member</Button>
        </div>
        {isLoading ? <div className="animate-pulse h-48 bg-gray-100 rounded-xl" /> :
          members.length === 0 ? <EmptyState icon={Users} title="No team members" description="Invite colleagues to help manage POPIA compliance." action={{ label:'Invite first member', onClick:()=>setOpen(true) }} /> :
          <div className="bg-white rounded-xl border border-border overflow-hidden"><DataTable columns={cols} data={members} /></div>}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Invite Team Member</DialogTitle></DialogHeader>
          <form onSubmit={e=>{e.preventDefault();invite.mutate(form);}} className="space-y-4">
            <div className="space-y-2"><Label>Email *</Label><Input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required /></div>
            <div className="space-y-2"><Label>Role</Label><Select value={form.role} onValueChange={v=>setForm(p=>({...p,role:v}))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="member">Member</SelectItem><SelectItem value="viewer">Viewer</SelectItem></SelectContent></Select></div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" type="button" onClick={()=>setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={invite.isPending}>{invite.isPending?'Sending…':'Send Invite'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
