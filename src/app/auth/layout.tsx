import { Link } from '@/components/ui';
import Box from '@mui/material/Box';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import logo from '../../../public/logo.png';
import '@/styles/auth-globals.css';

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();

  if (session) {
    redirect('/profile/products');
  }

  return (
    <>
      <Box sx={{ position: 'absolute', top: '22px', left: '24px' }}>
        <Link href="/">
          <Image src={logo} alt="logo" width={40} height={30} />
        </Link>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    </>
  );
}
