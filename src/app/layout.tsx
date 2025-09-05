import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { SessionProvider } from '@/providers/SessionProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/constants/authConfig';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import '@/styles/globals.css';
import { AIHelper } from '@/components/common/AIHelper';
import { StripeProvider } from '@/providers/StripeProvider';

const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL as string),
  title: 'Shoes Shop',
  description: 'Shoes Shop - Team 3',
  creator: 'Team 3',
  category: 'Shoes Shop',
  keywords: ['shoes', 'shoes shop', 'team 3', 'solvd laba'],
  robots: { index: true, follow: true, nocache: true },
  openGraph: {
    title: 'Shoes Shop',
    description: 'Shoes Shop - Team 3',
    type: 'website',
    url: process.env.NEXT_PUBLIC_URL,
    images: [
      {
        url: process.env.NEXT_PUBLIC_URL + '/favicon.ico',
        width: 25,
        height: 25,
        alt: 'Shoes Shop',
      },
    ],
  },
  icons: {
    shortcut: '/favicon.ico',
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
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
          <StripeProvider>
            <ThemeProvider>
              <SessionProvider session={session}>
                {children}
                <AIHelper />
                <ReactQueryDevtools initialIsOpen={false} />
              </SessionProvider>
            </ThemeProvider>
          </StripeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
