'use client';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { StatCard } from '@/components/stat-card';
import { ComplianceScore } from '@/components/compliance-score';
import { Database, FileCheck2, AlertTriangle, FileText, CheckSquare, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
export default function DashboardPage() {
  const { data: stats } = useQuery({ queryKey:['dashboard-stats'], queryFn:()=>fetch('/api/reports?type=summary').then(r=>r.json()), staleTime:60000 });
  const s = stats?.data ?? {};
  return (
    <>
      <Header title="Dashboard" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <StatCard title="Data Categories" value={s.dataCategories??'—'} icon={Database} href="/data-inventory" />
          <StatCard title="Consent Records" value={s.consentRecords??'—'} icon={FileCheck2} href="/consent-manager" color="#16A34A" />
          <StatCard title="Open Breaches" value={s.openBreaches??'—'} icon={AlertTriangle} href="/breach-register" color={s.openBreaches>0?'#DC2626':'#16A34A'} />
          <StatCard title="PAIA Requests" value={s.paiaRequests??'—'} icon={FileText} href="/paia-requests" color="#E8891C" />
          <StatCard title="Pending Tasks" value={s.pendingTasks??'—'} icon={CheckSquare} href="/tasks" color="#7C3AED" />
          <StatCard title="Team Members" value={s.teamMembers??'—'} icon={Users} href="/team" color="#0E7490" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ComplianceScore />
          <Card>
            <CardHeader><CardTitle>Recent Tasks Due</CardTitle></CardHeader>
            <CardContent>
              <UpcomingTasks />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
function UpcomingTasks() {
  const { data } = useQuery({ queryKey:['tasks-upcoming'], queryFn:()=>fetch('/api/tasks?status=pending&limit=5').then(r=>r.json()), staleTime:60000 });
  const tasks = data?.data?.tasks ?? [];
  if (!tasks.length) return <p className="text-sm text-muted-foreground">No upcoming tasks.</p>;
  return (
    <ul className="space-y-3">
      {tasks.map((t: Record<string,unknown>) => (
        <li key={t.id as string} className="flex items-center justify-between text-sm">
          <span className="text-gray-700 truncate max-w-[60%]">{t.title as string}</span>
          <div className="flex items-center gap-2">
            <Badge variant={t.priority==='critical'?'danger':t.priority==='high'?'warning':'default'}>{t.priority as string}</Badge>
            {t.dueDate && <span className="text-muted-foreground text-xs">{formatDate(t.dueDate as string)}</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}
