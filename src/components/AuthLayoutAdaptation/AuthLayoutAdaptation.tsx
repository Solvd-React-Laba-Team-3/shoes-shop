'use client';

import { Box } from '@mui/material';
import { ReactNode } from 'react';

type Props = { children: ReactNode };

export function AuthLayoutAdaptation({ children }: Props) {
  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        height: '100vh',
        overflow: 'hidden',
        [theme.breakpoints.down('lg')]: {
          gridTemplateColumns: '1fr',
        },
      })}
    >
      {children}
    </Box>
  );
}
