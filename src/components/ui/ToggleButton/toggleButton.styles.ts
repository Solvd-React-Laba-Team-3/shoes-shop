import ToggleButton from '@mui/material/ToggleButton';
import { styled } from '@mui/material/styles';
import { ToggleButtonProps } from './ToggleButton';

export const StyledToggleButton = styled(ToggleButton, {
  shouldForwardProp: (prop) => prop !== 'error',
})<ToggleButtonProps>(({ theme, error }) => ({
  ...theme.typography.caption,

  color: theme.palette.text.secondary,
  border: `1px solid ${error ? theme.palette.error.main : theme.palette.secondary.dark}`,
  backgroundColor: 'transparent',
  minWidth: '85px',
  height: '55px',

  '&.Mui-selected': {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[400],
  },

  '&.Mui-disabled': {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.grey[300],
    borderColor: theme.palette.grey[300],
    cursor: 'not-allowed',
    border: `1px solid ${theme.palette.grey[300]}`,
  },

  '&.MuiToggleButtonGroup-grouped.Mui-disabled': {
    border: `1px solid ${theme.palette.grey[300]}`,
  },

  '&.MuiToggleButtonGroup-grouped': {
    border: `1px solid ${theme.palette.secondary.dark}`,
    borderRadius: theme.shape.borderRadius,
    margin: '0',
  },
}));
