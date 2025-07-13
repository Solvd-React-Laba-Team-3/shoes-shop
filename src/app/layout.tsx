import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import { QueryProvider } from '@/providers/QueryProvider';
import '@/styles/globals.css';

const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Shoes Shop',
  description: 'Shoes Shop - Team 3',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.variable}`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
