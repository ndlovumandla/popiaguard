'use client';
import * as D from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogPortal = D.Portal;
export const DialogClose = D.Close;
export const DialogOverlay = forwardRef<React.ElementRef<typeof D.Overlay>, React.ComponentPropsWithoutRef<typeof D.Overlay>>(({ className, ...p }, ref) => (
  <D.Overlay ref={ref} className={cn('fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', className)} {...p} />
));
DialogOverlay.displayName = D.Overlay.displayName;
export const DialogContent = forwardRef<React.ElementRef<typeof D.Content>, React.ComponentPropsWithoutRef<typeof D.Content>>(({ className, children, ...p }, ref) => (
  <DialogPortal><DialogOverlay />
    <D.Content ref={ref} className={cn('fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out sm:rounded-lg', className)} {...p}>
      {children}
      <D.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
        <X className="h-4 w-4" /><span className="sr-only">Close</span>
      </D.Close>
    </D.Content>
  </DialogPortal>
));
DialogContent.displayName = D.Content.displayName;
export const DialogHeader = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...p} />;
export const DialogTitle = forwardRef<React.ElementRef<typeof D.Title>, React.ComponentPropsWithoutRef<typeof D.Title>>(({ className, ...p }, ref) => (
  <D.Title ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...p} />
));
DialogTitle.displayName = D.Title.displayName;
export const DialogDescription = forwardRef<React.ElementRef<typeof D.Description>, React.ComponentPropsWithoutRef<typeof D.Description>>(({ className, ...p }, ref) => (
  <D.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...p} />
));
DialogDescription.displayName = D.Description.displayName;
