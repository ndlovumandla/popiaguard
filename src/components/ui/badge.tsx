import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
const v = cva('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  { variants: { variant: {
    default: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    outline: 'text-foreground border-border' }},
    defaultVariants: { variant:'default' } });
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof v> {}
export function Badge({ className, variant, ...p }: BadgeProps) { return <span className={cn(v({ variant }), className)} {...p} />; }
