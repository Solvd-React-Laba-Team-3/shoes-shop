import { Link } from '@/components/ui';
import { Box } from '@mui/material';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import logo from '../../../public/logo.png';

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();

  if (session) {
    redirect('/products');
  }

  return (
    <>
      <Box sx={{ position: 'absolute', top: '50px', left: '40px' }}>
        <Link href="/">
          <Image src={logo} alt="logo" width={40} height={30} />
        </Link>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    </>
  );
}
