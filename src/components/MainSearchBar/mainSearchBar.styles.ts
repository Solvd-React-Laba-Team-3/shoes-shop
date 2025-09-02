import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { ListItem } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';

interface ContainerProps {
  isFocused: boolean;
}

export const MainSearchBarContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isFocused',
})<ContainerProps>(({ isFocused, theme }) => ({
  position: isFocused ? 'fixed' : 'relative',
  top: isFocused ? 0 : 'auto',
  left: 0,
  minHeight: isFocused ? '160px' : 'auto',
  width: isFocused ? '100vw' : 'auto',
  backgroundColor: isFocused ? '#fff' : 'transparent',
  zIndex: isFocused ? 1000 : 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: 45,
  paddingTop: isFocused ? theme.spacing(5) : 0,
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: '26px',
  },
}));

export const IconButtonLeft = styled(Box)(({ theme }) => ({
  position: 'fixed',
  left: 40,
  top: 34,
  zIndex: 1100,
  [theme.breakpoints.down('lg')]: {
    display: 'none',
  },
}));

export const IconButtonRight = styled(Box)(({ theme }) => ({
  position: 'fixed',
  right: 20,
  top: 34,
  zIndex: 1100,
  [theme.breakpoints.down('md')]: {
    top: 40,
  },
  [theme.breakpoints.down('lg')]: {
    top: 53,
  },
}));

export const PopularTermsContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingLeft: '22%',
  paddingBottom: theme.spacing(5),
  color: theme.palette.grey[600],
  zIndex: 1001,
  backgroundColor: '#fff',
  [theme.breakpoints.down('md')]: {
    paddingLeft: '20px',
    paddingRight: '80px',
  },
}));

export const PopularTermItem = styled(ListItem)(({ theme }) => ({
  color: theme.palette.text.primary,
  cursor: 'pointer',
  paddingTop: theme.spacing(1),
  paddingLeft: 0,
  paddingRight: 0,
  textTransform: 'capitalize',
}));

export const Overlay = styled('div')(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(243, 243, 243, 0.7)',
  zIndex: 900,
  transition: 'opacity 0.5s ease',
}));

export const StyledLinearProgress = styled(LinearProgress)({
  position: 'absolute',
  top: -20,
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100%',
  maxWidth: 1040,
  zIndex: 1,
});
