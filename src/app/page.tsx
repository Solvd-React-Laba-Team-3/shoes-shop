'use client';

import { Header } from '@/components/common/Header';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    console.log(session?.user);
  }, [session]);

  return (
    <>
      <Header />
      <Typography>Shoes Shop - Team 3</Typography>
    </>
  );
}
