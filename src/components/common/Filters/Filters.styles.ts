import { HEADER_HEIGHT } from '@/constants/headerHeight';
import { Box, Drawer, FormLabel } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledCloseWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingBottom: '8px',
  paddingTop: '12px',
  backgroundColor: 'background.paper',
  zIndex: 10,
  flexShrink: 0,
}));

export const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: open ? '320px' : '0px',
  transition: 'width 0.2s ease-in-out',
  zIndex: 800,
  position: 'relative',

  '& .MuiDrawer-paper': {
    border: 'none',
    paddingBottom: '50px',
    top: HEADER_HEIGHT,
    position: 'sticky',

    [theme.breakpoints.down('md')]: {
      top: 0,
      height: '100vh',
      position: 'fixed',
      right: 0,
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
