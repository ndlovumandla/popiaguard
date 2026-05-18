'use client';
import { useQuery } from '@tanstack/react-query';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
export function ComplianceScore() {
  const { data, isLoading } = useQuery({
    queryKey: ['compliance-score'],
    queryFn: () => fetch('/api/compliance-score').then(r=>r.json()),
    staleTime: 60000,
  });
  const score = data?.data?.total ?? 0;
  const components: {label:string;earned:number;max:number;met:boolean}[] = data?.data?.components ?? [];
  const color = score >= 80 ? '#16A34A' : score >= 50 ? '#D97706' : '#DC2626';
  if (isLoading) return <Card className="animate-pulse h-64" />;
  return (
    <Card>
      <CardHeader><CardTitle>Compliance Score</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" data={[{value:score,fill:color},{value:100-score,fill:'#e5e7eb'}]} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={5} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{color}}>{score}</span>
              <span className="text-xs text-gray-500">/ 100</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {components.map(c => (
              <div key={c.label} className="flex items-center gap-2 text-sm">
                {c.met ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                <span className="flex-1 text-gray-700">{c.label}</span>
                <span className="text-gray-500">{c.earned}/{c.max}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
