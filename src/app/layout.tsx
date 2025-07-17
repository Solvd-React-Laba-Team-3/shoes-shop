import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { SessionProvider } from '@/providers/SessionProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/constants/authConfig';
import '@/styles/globals.css';

const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Shoes Shop',
  description: 'Shoes Shop - Team 3',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${workSans.variable}`}>
        <QueryProvider>
          <ThemeProvider>
            <SessionProvider session={session}>{children}</SessionProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
