import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

interface ContainerProps {
  isFocused: boolean;
}

export const MainSearchBarContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isFocused',
})<ContainerProps>(({ isFocused }) => ({
  position: isFocused ? 'fixed' : 'static',
  top: isFocused ? 0 : 'auto',
  left: 0,
  width: isFocused ? '100vw' : 'auto',
  height: 140,
  borderBottom: isFocused ? '1px solid #ccc' : '',
  backgroundColor: isFocused ? '#fff' : 'transparent',
  zIndex: isFocused ? 1000 : 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: isFocused ? '1rem' : 0,
  transition: 'all 0.3s ease',
}));

export const IconButtonLeft = styled(Box)(() => ({
  position: 'fixed',
  left: 40,
  top: 34,
  zIndex: 1100,
}));

export const IconButtonRight = styled(Box)(() => ({
  position: 'fixed',
  right: 40,
  top: 34,
  zIndex: 1100,
}));

export const Overlay = styled('div')(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(243, 243, 243, 0.7)',
  zIndex: 900,
  transition: 'opacity 5s ease',
}));
