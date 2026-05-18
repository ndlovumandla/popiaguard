'use client';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ComplianceScore } from '@/components/compliance-score';
const COLORS = ['#1B6CA8','#E8891C','#16A34A','#DC2626','#7C3AED','#0E7490'];
export default function ReportsPage() {
  const { data } = useQuery({ queryKey:['reports-full'], queryFn:()=>fetch('/api/reports').then(r=>r.json()), staleTime:120000 });
  const r = data?.data ?? {};
  const pieData = [
    { name:'Consent Active', value:r.consentActive??0 },
    { name:'Consent Withdrawn', value:r.consentWithdrawn??0 },
  ];
  const breachData = [
    { name:'Draft', value:r.breachDraft??0 },
    { name:'Under Review', value:r.breachReview??0 },
    { name:'Reported', value:r.breachReported??0 },
    { name:'Closed', value:r.breachClosed??0 },
  ];
  return (
    <>
      <Header title="Reports & Analytics" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ComplianceScore />
          <Card>
            <CardHeader><CardTitle>Consent Status Breakdown</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart><Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie><Tooltip /><Legend /></PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader><CardTitle>Breach Incidents by Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={breachData} margin={{ left:0, right:10 }}>
                <XAxis dataKey="name" tick={{ fontSize:12 }} /><YAxis allowDecimals={false} />
                <Tooltip /><Bar dataKey="value" fill="#1B6CA8" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
