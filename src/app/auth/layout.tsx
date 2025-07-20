import { Box } from '@mui/material';
import Image from 'next/image';
import { ReactNode } from 'react';
import { Link } from '@/components/ui';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Box sx={{ position: 'absolute', top: '50px', left: '40px' }}>
        <Link href="/">
          <Image src="/logo.png" alt="register logo" width={40} height={30} />
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
