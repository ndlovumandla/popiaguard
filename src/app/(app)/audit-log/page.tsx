'use client';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/empty-state';
import { ClipboardList } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
export default function AuditLogPage() {
  const { data, isLoading } = useQuery({ queryKey:['audit-logs'], queryFn:()=>fetch('/api/audit-logs').then(r=>r.json()), staleTime:30000 });
  const logs: Record<string,unknown>[] = data?.data?.logs ?? [];
  const cols = [
    { key:'createdAt', header:'Time', render:(r: Record<string,unknown>)=><span className="text-xs whitespace-nowrap">{formatDateTime(r.createdAt as string)}</span> },
    { key:'action', header:'Action', render:(r: Record<string,unknown>)=><span className="font-mono text-xs">{r.action as string}</span> },
    { key:'resource', header:'Resource', render:(r: Record<string,unknown>)=><span>{r.resource as string}</span> },
    { key:'userId', header:'User', render:(r: Record<string,unknown>)=><span className="text-xs text-muted-foreground">{(r.userId as string)||'System'}</span> },
    { key:'ipAddress', header:'IP', render:(r: Record<string,unknown>)=><span className="text-xs text-muted-foreground">{(r.ipAddress as string)||'—'}</span> },
  ];
  return (
    <>
      <Header title="Audit Log" />
      <div className="p-6">
        {isLoading ? <div className="animate-pulse h-48 bg-gray-100 rounded-xl" /> :
          logs.length === 0 ? <EmptyState icon={ClipboardList} title="No audit events" description="Actions performed in your organisation will appear here." /> :
          <div className="bg-white rounded-xl border border-border overflow-hidden"><DataTable columns={cols} data={logs} /></div>}
      </div>
    </>
  );
}
