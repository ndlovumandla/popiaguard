import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatDate(date: Date|string|null, opts?: Intl.DateTimeFormatOptions): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-ZA', { year:'numeric', month:'short', day:'numeric', ...opts }).format(new Date(date));
}
export function formatDateTime(date: Date|string|null): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-ZA', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }).format(new Date(date));
}
export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
export function truncate(str: string, len = 100): string {
  return str.length <= len ? str : str.slice(0, len) + '...';
}
export function getDaysUntil(date: Date|string|null): number|null {
  if (!date) return null;
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}
