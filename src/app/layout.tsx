import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/providers';
const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: { default: 'POPIAGuard', template: '%s | POPIAGuard' },
  description: 'POPIA Compliance Management for South African SMEs',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}><Providers>{children}</Providers></body>
    </html>
  );
}
