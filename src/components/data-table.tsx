import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
interface Column<T> { key: keyof T | string; header: string; render?: (row: T) => React.ReactNode; }
interface Props<T extends Record<string,unknown>> { columns: Column<T>[]; data: T[]; emptyMessage?: string; }
export function DataTable<T extends Record<string,unknown>>({ columns, data, emptyMessage = 'No records found.' }: Props<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>{columns.map(c => <TableHead key={String(c.key)}>{c.header}</TableHead>)}</TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0
          ? <TableRow><TableCell colSpan={columns.length} className="text-center text-muted-foreground py-12">{emptyMessage}</TableCell></TableRow>
          : data.map((row, i) => (
            <TableRow key={i}>
              {columns.map(c => (
                <TableCell key={String(c.key)}>{c.render ? c.render(row) : String(row[c.key as keyof T] ?? '—')}</TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
