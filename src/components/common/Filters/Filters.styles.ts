import { Box, Drawer, FormLabel } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledCloseWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingBottom: '8px',
  paddingTop: '12px',
  backgroundColor: 'background.paper',
  top: 0,
  zIndex: 10,
  flexShrink: 0,
}));

export const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  position: 'sticky',
  height: '90vh',
  zIndex: 1000,
  width: open ? '320px' : '0px',

  transition:
    'width 0.2s ease-in-out, transform 0.2s ease-in-out, top 0.2s ease-in-out',

  '& .MuiDrawer-paper': {
    border: 'none',
    position: 'sticky',
    height: '100%',
    width: '100%',
    paddingBottom: '50px',

    [theme.breakpoints.down('md')]: {
      right: 0,
      top: 0,
      height: '100%',
      width: '320px',
      position: 'fixed',
    },
  },
}));

export const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  color: theme.palette.grey[400],
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px',
  cursor: 'pointer',
  paddingLeft: '8px',
}));

export const StyledPricesContainer = styled(FormLabel)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mt: 2,
  gap: '6px',
  width: '100%',
}));
