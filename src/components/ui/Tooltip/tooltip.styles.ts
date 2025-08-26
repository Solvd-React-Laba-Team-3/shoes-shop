import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const StyledTooltipContent = styled(Box)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: 400,
  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const StyledLabelWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'block',
})<{ block?: boolean }>(({ theme, block }) => ({
  ...theme.typography.caption,
  color: theme.palette.grey[600],
  fontWeight: 400,
  display: block ? 'block' : 'grid',
  ...(block
    ? {}
    : {
        gridTemplateColumns: 'auto auto',
        justifyContent: 'center',
        columnGap: '4px',
        alignItems: 'center',
        minWidth: 0,

        [theme.breakpoints.down('lg')]: {
          justifyContent: 'flex-start',
          gridTemplateColumns: 'auto 1fr',
        },
      }),
}));
