'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
const steps = ['Welcome', 'Organisation', 'Information Officer', 'Done'];
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [org, setOrg] = useState({ registrationNumber:'', industry:'', size:'' });
  const [io, setIo] = useState({ name:'', email:'', phone:'', department:'' });
  const [loading, setLoading] = useState(false);
  const finish = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/onboarding', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ org, informationOfficer:io }) });
      if (!res.ok) throw new Error((await res.json()).message);
      router.push('/dashboard');
    } catch(e: unknown) { toast.error(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4"><Shield className="w-12 h-12 text-primary" /></div>
          <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((s,i)=>(
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i<=step?'bg-primary text-white':'bg-gray-200 text-gray-500'}`}>{i<step?<CheckCircle2 className="w-4 h-4" />:i+1}</div>
                {i<steps.length-1&&<div className={`w-8 h-0.5 ${i<step?'bg-primary':'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{steps[step]}</h2>
        </CardHeader>
        <CardContent>
          {step===0&&(
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Welcome to POPIAGuard. Let's set up your compliance profile in 2 quick steps.</p>
              <Button className="w-full" onClick={()=>setStep(1)}>Get Started <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>
          )}
          {step===1&&(
            <div className="space-y-4">
              <div className="space-y-2"><Label>Registration Number</Label><Input value={org.registrationNumber} onChange={e=>setOrg(p=>({...p,registrationNumber:e.target.value}))} /></div>
              <div className="space-y-2"><Label>Industry</Label><Input value={org.industry} onChange={e=>setOrg(p=>({...p,industry:e.target.value}))} /></div>
              <div className="space-y-2"><Label>Organisation Size</Label><Input value={org.size} onChange={e=>setOrg(p=>({...p,size:e.target.value}))} placeholder="e.g. 10-50 employees" /></div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={()=>setStep(0)}>Back</Button>
                <Button className="flex-1" onClick={()=>setStep(2)}>Next <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </div>
            </div>
          )}
          {step===2&&(
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Every organisation processing personal information must designate an Information Officer.</p>
              <div className="space-y-2"><Label>Full Name *</Label><Input value={io.name} onChange={e=>setIo(p=>({...p,name:e.target.value}))} required /></div>
              <div className="space-y-2"><Label>Email *</Label><Input type="email" value={io.email} onChange={e=>setIo(p=>({...p,email:e.target.value}))} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Phone</Label><Input value={io.phone} onChange={e=>setIo(p=>({...p,phone:e.target.value}))} /></div>
                <div className="space-y-2"><Label>Department</Label><Input value={io.department} onChange={e=>setIo(p=>({...p,department:e.target.value}))} /></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={()=>setStep(1)}>Back</Button>
                <Button className="flex-1" onClick={finish} disabled={loading||!io.name||!io.email}>{loading?'Setting up…':'Finish Setup'}</Button>
              </div>
            </div>
          )}
          {step===3&&(
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <p className="text-muted-foreground">Your compliance workspace is ready.</p>
              <Button className="w-full" onClick={()=>router.push('/dashboard')}>Go to Dashboard</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
