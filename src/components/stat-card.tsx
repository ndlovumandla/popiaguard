import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
interface Props { title: string; value: string|number; icon: LucideIcon; trend?: string; color?: string; href?: string; }
export function StatCard({ title, value, icon: Icon, trend, color='#1B6CA8', href }: Props) {
  const inner = (
    <Card className={cn('transition-shadow hover:shadow-md', href && 'cursor-pointer')}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-3xl font-bold mt-1" style={{color}}>{value}</p>
            {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background:`${color}18`}}>
            <Icon className="w-6 h-6" style={{color}} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
  if (href) return <a href={href}>{inner}</a>;
  return inner;
}
