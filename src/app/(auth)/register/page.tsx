'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', orgName:'', password:'' });
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p=>({...p,[k]:e.target.value}));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) { toast.error(json.message||'Registration failed'); return; }
      router.push('/onboarding');
    } finally { setLoading(false); }
  };
  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-3"><div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center"><Shield className="w-7 h-7 text-white" /></div></div>
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="text-sm text-muted-foreground">Start your POPIA compliance journey</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>First name</Label><Input value={form.firstName} onChange={f('firstName')} placeholder="Jane" required /></div>
            <div className="space-y-2"><Label>Last name</Label><Input value={form.lastName} onChange={f('lastName')} placeholder="Smith" required /></div>
          </div>
          <div className="space-y-2"><Label>Organisation name</Label><Input value={form.orgName} onChange={f('orgName')} placeholder="Acme (Pty) Ltd" required /></div>
          <div className="space-y-2"><Label>Work email</Label><Input type="email" value={form.email} onChange={f('email')} placeholder="jane@acme.co.za" required /></div>
          <div className="space-y-2"><Label>Password</Label><Input type="password" value={form.password} onChange={f('password')} placeholder="Min. 8 chars, 1 upper, 1 number" required minLength={8} /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account…' : 'Create free account'}</Button>
        </form>
        <p className="text-center text-sm mt-4 text-muted-foreground">Already registered? <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link></p>
      </CardContent>
    </Card>
  );
}
