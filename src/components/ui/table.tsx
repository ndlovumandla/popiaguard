import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
export const Table = forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...p }, ref) => (
  <div className="relative w-full overflow-auto"><table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...p} /></div>
));
Table.displayName = 'Table';
export const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...p }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...p} />
));
TableHeader.displayName = 'TableHeader';
export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...p }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...p} />
));
TableBody.displayName = 'TableBody';
export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...p }, ref) => (
  <tr ref={ref} className={cn('border-b transition-colors hover:bg-muted/50', className)} {...p} />
));
TableRow.displayName = 'TableRow';
export const TableHead = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...p }, ref) => (
  <th ref={ref} className={cn('h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0', className)} {...p} />
));
TableHead.displayName = 'TableHead';
export const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...p }, ref) => (
  <td ref={ref} className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)} {...p} />
));
TableCell.displayName = 'TableCell';
