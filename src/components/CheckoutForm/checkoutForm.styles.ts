import { styled } from '@mui/material/styles';
import { ToggleButton, Button } from '../ui';

export const StyledPaymentMethod = styled(ToggleButton)(({ theme }) => ({
  height: '100px',
  width: '170px',
  fontWeight: 500,
  textTransform: 'none',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '10px',
  paddingLeft: '24px',
  border: `1px solid ${theme.palette.common.black}`,
  borderRadius: '12px',
  transition: 'transform 0.2s',

  '&.MuiToggleButton-root.MuiToggleButton-root': {
    height: '100px',
    width: '170px',
  },

  '&:hover': {
    backgroundColor: 'transparent',
    transform: 'scale(1.05)',
  },
  '&.Mui-selected': {
    backgroundColor: 'transparent',
    borderColor: theme.palette.action.active,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}));

export const StyledChevronButton = styled(Button)(({ theme }) => ({
  height: '100px',
  width: '72px',
  borderColor: theme.palette.secondary.dark,
  transition: 'transform 0.2s',
  fontSize: '24px',
  '&:hover': {
    backgroundColor: 'transparent',
    transform: 'scale(1.05)',
  },
  color: theme.palette.secondary.main,
}));
