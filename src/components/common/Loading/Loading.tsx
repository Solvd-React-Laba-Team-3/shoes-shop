'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import { FC } from 'react';

interface LoadingProps {
  fullScreen?: boolean;
}

export const Loading: FC<LoadingProps> = ({ fullScreen = false }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={fullScreen ? '100vh' : '100%'}
      width="100%"
      bgcolor="inherit"
    >
      <CircularProgress size={60} thickness={5} color="primary" />
      <Typography variant="h6" color="textSecondary" mt={3} fontWeight={500}>
        Loading...
      </Typography>
    </Box>
  );
};
