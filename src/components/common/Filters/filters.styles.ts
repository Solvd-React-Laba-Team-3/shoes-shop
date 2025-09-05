import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
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
  zIndex: 800,
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

export const StyledHeaderBox = styled(Box)(() => ({
  display: 'flex',
  padding: '0 20px 0 40px',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'var(--mui-palette-background-paper)',
  zIndex: 10,
  paddingBottom: '12px',
  flexShrink: 0,
}));

export const StyledTextField = styled(TextField)(() => ({
  width: 50,
  '& .MuiOutlinedInput-input': {
    borderRadius: '6px',
    fontSize: 12,
    padding: '4px',
    textAlign: 'center',
  },
}));

export const StyledBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '320px',
  gap: theme.spacing(3.5),
  overflowY: 'visible',
  flex: 'unset',
  paddingBottom: 0,
  minHeight: 'auto',
  overflowX: 'hidden',

  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(1.5, 3.5),
    overflow: 'auto',
    flex: '1 1 auto',
    paddingBottom: '20px',
    minHeight: 0,
  },
}));
