import { Box, ButtonProps, Grid, styled } from '@mui/material';
import { Button } from '../ui';

export const StyledInfoGrid = styled(Grid)(({ theme }) => ({
  borderBottom: '1px solid ' + theme.palette.grey[300],
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  gap: '40px',
  padding: '16px',

  [theme.breakpoints.down('lg')]: {
    gap: '8px',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  [theme.breakpoints.down('xl')]: {
    gap: '20px',
  },
}));

export const StyledToolsWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 16px',
}));

interface StyledDownloadButtonProps extends ButtonProps {
  isDownloading: boolean;
}

export const StyledDownloadButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isDownloading',
})<StyledDownloadButtonProps>(({ isDownloading }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1,
  fontWeight: 500,
  opacity: isDownloading ? 0.6 : 1,
  cursor: isDownloading ? 'not-allowed' : 'pointer',

  '&:hover': {
    textDecoration: 'underline',
  },
}));
