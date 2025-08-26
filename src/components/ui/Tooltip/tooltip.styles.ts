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

export const StyledLabelWrapper = styled(Box)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.grey[600],
  fontWeight: 400,
  minWidth: 0,
}));
