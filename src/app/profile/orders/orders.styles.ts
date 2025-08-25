import { Box, Chip, ChipProps, Grid, styled } from '@mui/material';

export const StyledLabelWrapper = styled(Box)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.grey[600],
  fontWeight: 400,
  display: 'grid',
  gridTemplateColumns: 'auto auto',
  justifyContent: 'center',
  columnGap: '4px',
  alignItems: 'center',
  minWidth: 0,

  [theme.breakpoints.down('lg')]: {
    justifyContent: 'flex-start',
    gridTemplateColumns: 'auto 1fr',
  },
}));

export const StyledTooltipContent = styled(Box)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: 400,
  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

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

export const StyledChip = styled(Chip)<StyledChipProps>(
  ({ theme, statusColor }) => ({
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
  })
);

export const StyledInfoGrid = styled(Grid)(({ theme }) => ({
  borderBottom: '1px solid ' + theme.palette.grey[300],
  justifyContent: 'center',
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
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 16px',
  gap: '24px',
  borderBottom: `1px solid ${theme.palette.grey[300]}`,

  [theme.breakpoints.down('lg')]: {
    display: 'none',
  },
}));

export const StyledToolsWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 16px',
}));
