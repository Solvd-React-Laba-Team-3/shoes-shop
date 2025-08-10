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
      margin: '10% auto',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '48px',
      [theme.breakpoints.down('sm')]: {
        margin: '25% auto',
        alignItems: 'center',
      },
      '@media (max-width: 400px)': {
        margin: '30% auto',
      },
    })}
  >
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        '@media (max-width: 420px)': {
          textAlign: 'center',
        },
      }}
    >
      <Typography
        variant="h2"
        sx={(theme) => ({
          [theme.breakpoints.down('sm')]: {
            fontSize: '30px',
          },
        })}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant="caption"
          component="p"
          color="textSecondary"
          sx={(theme) => ({
            [theme.breakpoints.down('sm')]: {
              fontSize: '12px',
            },
            '@media (max-width: 420px)': {
              width: '250px',
            },
          })}
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
      }}
    >
      {children}
      {footer}
    </Box>
  </Box>
);
