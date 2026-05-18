'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Database, FileCheck2, AlertTriangle, FileText, CheckSquare, BarChart3, ClipboardList, Users, Settings, Shield, LogOut, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
const nav = [
  { href:'/dashboard',     label:'Dashboard',         icon:LayoutDashboard },
  { href:'/data-inventory', label:'Data Inventory',   icon:Database },
  { href:'/consent-manager',label:'Consent Manager',  icon:FileCheck2 },
  { href:'/breach-register',label:'Breach Register',  icon:AlertTriangle },
  { href:'/paia-requests',  label:'PAIA Requests',    icon:FileText },
  { href:'/privacy-policy', label:'Privacy Policy',   icon:BookOpen },
  { href:'/tasks',          label:'Tasks',             icon:CheckSquare },
  { href:'/reports',        label:'Reports',           icon:BarChart3 },
  { href:'/audit-log',      label:'Audit Log',         icon:ClipboardList },
  { href:'/team',           label:'Team',              icon:Users },
  { href:'/settings',       label:'Settings',          icon:Settings },
];
export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = async () => { await fetch('/api/auth/logout', { method:'POST' }); router.push('/login'); };
  return (
    <aside className="flex flex-col w-64 min-h-screen bg-white border-r border-border shadow-sm">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <Shield className="w-7 h-7 text-primary" />
        <span className="font-bold text-xl text-primary">POPIAGuard</span>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {nav.map(({href, label, icon: Icon}) => (
          <Link key={href} href={href}
            className={cn('flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors rounded-lg mx-2 mb-0.5',
              pathname === href ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <button onClick={logout} className="flex items-center gap-3 w-full px-2 py-2 text-sm text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" />Logout
        </button>
      </div>
    </aside>
  );
}
