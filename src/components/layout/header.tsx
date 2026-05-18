'use client';
import { Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
export function Header({ title }: { title: string }) {
  const { data } = useQuery({ queryKey: ['notifications'], queryFn: () => fetch('/api/notifications?unread=true').then(r=>r.json()), staleTime: 60000 });
  const unread = data?.data?.total ?? 0;
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-4">
        <Link href="/notifications" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unread>9?'9+':unread}</span>}
        </Link>
      </div>
    </header>
  );
}
