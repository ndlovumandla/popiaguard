'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ email }) });
      if (res.ok) setSent(true); else toast.error('Failed to send reset email.');
    } finally { setLoading(false); }
  };
  if (sent) return (
    <Card className="shadow-xl text-center p-8">
      <h2 className="text-xl font-bold mb-2">Check your email</h2>
      <p className="text-muted-foreground mb-4">If an account exists for {email}, a reset link has been sent.</p>
      <Link href="/login" className="text-primary hover:underline">Back to sign in</Link>
    </Card>
  );
  return (
    <Card className="shadow-xl">
      <CardHeader className="pb-2"><h1 className="text-2xl font-bold">Reset password</h1><p className="text-sm text-muted-foreground">Enter your email and we'll send a reset link.</p></CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</Button>
        </form>
        <p className="text-center text-sm mt-4"><Link href="/login" className="text-primary hover:underline">Back to sign in</Link></p>
      </CardContent>
    </Card>
  );
}
