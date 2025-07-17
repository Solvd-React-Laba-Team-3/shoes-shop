'use client';

import { Button } from '@/components/ui';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    console.log(session?.user);
  }, [session]);

  return (
    <>
      <Typography>Shoes Shop - Team 3</Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button onClick={() => signIn('credentials')}>Sign In</Button>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </Box>
    </>
  );
}
