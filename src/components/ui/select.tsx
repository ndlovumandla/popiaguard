'use client';
import * as S from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
export const Select = S.Root;
export const SelectGroup = S.Group;
export const SelectValue = S.Value;
export const SelectTrigger = forwardRef<React.ElementRef<typeof S.Trigger>, React.ComponentPropsWithoutRef<typeof S.Trigger>>(({ className, children, ...p }, ref) => (
  <S.Trigger ref={ref} className={cn('flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', className)} {...p}>
    {children}<S.Icon asChild><ChevronDown className="h-4 w-4 opacity-50" /></S.Icon>
  </S.Trigger>
));
SelectTrigger.displayName = S.Trigger.displayName;
export const SelectContent = forwardRef<React.ElementRef<typeof S.Content>, React.ComponentPropsWithoutRef<typeof S.Content>>(({ className, children, position='popper', ...p }, ref) => (
  <S.Portal><S.Content ref={ref} className={cn('relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-foreground shadow-md', className)} position={position} {...p}>
    <S.ScrollUpButton className="flex cursor-default items-center justify-center py-1"><ChevronUp className="h-4 w-4" /></S.ScrollUpButton>
    <S.Viewport className="p-1">{children}</S.Viewport>
    <S.ScrollDownButton className="flex cursor-default items-center justify-center py-1"><ChevronDown className="h-4 w-4" /></S.ScrollDownButton>
  </S.Content></S.Portal>
));
SelectContent.displayName = S.Content.displayName;
export const SelectItem = forwardRef<React.ElementRef<typeof S.Item>, React.ComponentPropsWithoutRef<typeof S.Item>>(({ className, children, ...p }, ref) => (
  <S.Item ref={ref} className={cn('relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className)} {...p}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"><S.ItemIndicator><Check className="h-4 w-4" /></S.ItemIndicator></span>
    <S.ItemText>{children}</S.ItemText>
  </S.Item>
));
SelectItem.displayName = S.Item.displayName;
export const SelectLabel = forwardRef<React.ElementRef<typeof S.Label>, React.ComponentPropsWithoutRef<typeof S.Label>>(({ className, ...p }, ref) => (
  <S.Label ref={ref} className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)} {...p} />
));
SelectLabel.displayName = S.Label.displayName;
