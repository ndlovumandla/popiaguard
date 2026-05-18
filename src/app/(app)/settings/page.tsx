'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
export default function SettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey:['org-settings'], queryFn:()=>fetch('/api/org').then(r=>r.json()) });
  const org = data?.data ?? {};
  const [form, setForm] = useState({ name:'', registrationNumber:'', industry:'', size:'', website:'' });
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p=>({...p,[k]:e.target.value}));
  const save = useMutation({
    mutationFn: async (d: typeof form) => {
      const res = await fetch('/api/org', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) });
      if (!res.ok) throw new Error((await res.json()).message);
      return res.json();
    },
    onSuccess: () => { toast.success('Settings saved'); qc.invalidateQueries({queryKey:['org-settings']}); },
    onError: (e: Error) => toast.error(e.message),
  });
  const merged = { name:form.name||org.name||'', registrationNumber:form.registrationNumber||org.registrationNumber||'', industry:form.industry||org.industry||'', size:form.size||org.size||'', website:form.website||org.website||'' };
  return (
    <>
      <Header title="Settings" />
      <div className="p-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>Organisation Details</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={e=>{e.preventDefault();save.mutate(merged);}} className="space-y-4">
              <div className="space-y-2"><Label>Organisation Name</Label><Input value={merged.name} onChange={f('name')} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Registration No.</Label><Input value={merged.registrationNumber} onChange={f('registrationNumber')} /></div>
                <div className="space-y-2"><Label>Industry</Label><Input value={merged.industry} onChange={f('industry')} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Size</Label><Input value={merged.size} onChange={f('size')} placeholder="e.g. 1-10 employees" /></div>
                <div className="space-y-2"><Label>Website</Label><Input value={merged.website} onChange={f('website')} /></div>
              </div>
              <Separator />
              <Button type="submit" disabled={save.isPending}>{save.isPending?'Saving…':'Save Changes'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
