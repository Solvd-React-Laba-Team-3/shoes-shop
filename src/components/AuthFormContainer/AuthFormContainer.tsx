'use client';
import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

type AuthFormContainerProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export const AuthFormContainer = ({
  title,
  description,
  children,
  footer,
}: AuthFormContainerProps) => (
  <Box
    sx={{
      margin: '20% auto',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
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
