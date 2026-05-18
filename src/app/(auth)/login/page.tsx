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
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) { toast.error(json.message || 'Login failed'); return; }
      router.push('/dashboard');
    } finally { setLoading(false); }
  };
  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-3"><div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center"><Shield className="w-7 h-7 text-white" /></div></div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to POPIAGuard</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="you@company.co.za" required /></div>
          <div className="space-y-2"><Label>Password</Label><Input type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="••••••••" required /></div>
          <div className="flex justify-end"><Link href="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
        </form>
        <p className="text-center text-sm mt-4 text-muted-foreground">No account? <Link href="/register" className="text-primary hover:underline font-medium">Register free</Link></p>
      </CardContent>
    </Card>
  );
}
