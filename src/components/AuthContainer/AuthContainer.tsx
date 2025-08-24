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
    sx={(theme) => ({
      margin: '20% auto',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '48px',
      width: '100%',
      justifyContent: 'center',
      [theme.breakpoints.down('lg')]: {
        padding: '20px',
        alignItems: 'center',
      },
    })}
  >
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Typography variant="h2">{title}</Typography>

      {description && (
        <Typography
          variant="caption"
          component="p"
          color="textSecondary"
          sx={{
            width: '100%',
          }}
        >
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
        width: '100%',
      }}
    >
      {children}
      {footer}
    </Box>
  </Box>
);
