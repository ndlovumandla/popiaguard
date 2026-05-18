'use client';
import * as T from '@radix-ui/react-tabs';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
export const Tabs = T.Root;
export const TabsList = forwardRef<React.ElementRef<typeof T.List>, React.ComponentPropsWithoutRef<typeof T.List>>(({ className, ...p }, ref) => (
  <T.List ref={ref} className={cn('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', className)} {...p} />
));
TabsList.displayName = T.List.displayName;
export const TabsTrigger = forwardRef<React.ElementRef<typeof T.Trigger>, React.ComponentPropsWithoutRef<typeof T.Trigger>>(({ className, ...p }, ref) => (
  <T.Trigger ref={ref} className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm', className)} {...p} />
));
TabsTrigger.displayName = T.Trigger.displayName;
export const TabsContent = forwardRef<React.ElementRef<typeof T.Content>, React.ComponentPropsWithoutRef<typeof T.Content>>(({ className, ...p }, ref) => (
  <T.Content ref={ref} className={cn('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className)} {...p} />
));
TabsContent.displayName = T.Content.displayName;
