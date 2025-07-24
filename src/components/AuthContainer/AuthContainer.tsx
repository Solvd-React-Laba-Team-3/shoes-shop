'use client';

import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

type AuthContainerProp = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export const AuthContainer = ({
  title,
  description,
  children,
  footer,
}: AuthContainerProp) => (
  <Box
    sx={{
      margin: '20% auto',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '48px',
    }}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography variant="h2">{title}</Typography>

      {description && (
        <Typography variant="caption" component="p" color="textSecondary">
          {description}
        </Typography>
      )}
    </Box>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
      {footer}
    </Box>
  </Box>
);
