'use client';

import { CircularProgress, Typography } from '@mui/material';
import { FC } from 'react';
import { LoadingContainer } from './loading.styles';

interface LoadingProps {
  fullScreen?: boolean;
}

export const Loading: FC<LoadingProps> = ({ fullScreen = false }) => {
  return (
    <LoadingContainer fullScreen={fullScreen}>
      <CircularProgress size={60} thickness={5} color="primary" />
      <Typography variant="h6" color="textSecondary" mt={3} fontWeight={500}>
        Loading...
      </Typography>
    </LoadingContainer>
  );
};
