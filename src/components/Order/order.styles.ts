import { Box, ButtonProps, Chip, ChipProps, Grid, styled } from '@mui/material';
import { Button } from '../ui';

export const StyledProductWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'nowrap',
  padding: '16px',
  gap: '18px',
  backgroundColor: 'inherit',
  borderRadius: '8px',

  [theme.breakpoints.down('lg')]: {
    flexWrap: 'wrap',
  },
}));

interface StyledChipProps extends ChipProps {
  statusColor: string;
}

export const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'statusColor',
})<StyledChipProps>(({ theme, statusColor }) => ({
  backgroundColor: 'inherit',
  ...theme.typography.caption,
  color: statusColor,
  textTransform: 'capitalize',
  fontWeight: 500,
  '.MuiChip-label': {
    [theme.breakpoints.down('lg')]: {
      display: 'none',
    },
  },
}));

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

export const StyledOrderInfo = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  padding: '8px 16px',
  gap: '24px',
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  display: 'none',

  [theme.breakpoints.down('lg')]: {
    display: 'flex',
  },

  [theme.breakpoints.down('sm')]: {
    display: 'none',
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

export const StyledDownloadButton = styled(Button)<StyledDownloadButtonProps>(
  ({ isDownloading }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1,
    fontWeight: 500,
    opacity: isDownloading ? 0.6 : 1,
    cursor: isDownloading ? 'not-allowed' : 'pointer',

    '&:hover': {
      textDecoration: 'underline',
    },
  })
);
