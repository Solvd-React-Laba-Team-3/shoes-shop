import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import { HEADER_HEIGHT } from '@/constants/headerHeight';
import Box from '@mui/material/Box';

export const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile: boolean }>(({ theme, isMobile }) => ({
  maxWidth: '320px',
  zIndex: isMobile ? 1000 : 800,
  width: '320px',
  position: 'relative',

  [theme.breakpoints.down('lg')]: {
    width: '260px',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    position: 'fixed',
  },

  '& .MuiDrawer-paper': {
    border: 'none',
    paddingBottom: '200px',
    top: isMobile ? 0 : HEADER_HEIGHT,
  },
  '& .MuiPaper-root': {
    position: isMobile ? 'fixed' : 'sticky',
  },
}));

export const UserInfoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '32px 40px',
  width: '100%',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));
