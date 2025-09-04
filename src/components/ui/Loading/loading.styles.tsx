import { Box, styled } from '@mui/material';
import { LoadingProps } from './Loading';

export const LoadingContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'fullScreen',
})<LoadingProps>(({ fullScreen, theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  ...(fullScreen
    ? {
        position: 'fixed',
        inset: 0,
        height: '100vh',
        width: '100vw',
        zIndex: 1300,
        backgroundColor: theme.palette.background.default,
      }
    : {
        position: 'relative',
        height: '100%',
        width: '100%',
        backgroundColor: 'inherit',
      }),
}));
