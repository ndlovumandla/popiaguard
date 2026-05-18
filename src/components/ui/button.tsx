import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
const v = cva('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  { variants: { variant: {
      default: 'bg-primary text-white hover:bg-primary/90',
      secondary: 'bg-secondary text-white hover:bg-secondary/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-danger text-white hover:bg-danger/90',
      link: 'text-primary underline-offset-4 hover:underline' },
    size: { default:'h-10 px-4 py-2', sm:'h-8 rounded-md px-3 text-xs', lg:'h-11 rounded-md px-8', icon:'h-9 w-9' } },
    defaultVariants: { variant:'default', size:'default' } });
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof v> { asChild?: boolean; }
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild=false, ...p }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp ref={ref} className={cn(v({ variant, size }), className)} {...p} />;
});
Button.displayName = 'Button';
