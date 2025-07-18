import { Box } from '@mui/material';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
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
  );
}
