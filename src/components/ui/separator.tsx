'use client';
import * as Sep from '@radix-ui/react-separator';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
export const Separator = forwardRef<React.ElementRef<typeof Sep.Root>, React.ComponentPropsWithoutRef<typeof Sep.Root>>(({ className, orientation='horizontal', decorative=true, ...p }, ref) => (
  <Sep.Root ref={ref} decorative={decorative} orientation={orientation}
    className={cn('shrink-0 bg-border', orientation==='horizontal'?'h-[1px] w-full':'h-full w-[1px]', className)} {...p} />
));
Separator.displayName = Sep.Root.displayName;
