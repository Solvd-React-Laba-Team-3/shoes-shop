import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  gap: '100px',
  padding: '100px 15%',
  alignItems: 'flex-start',
  flexDirection: 'row',

  [theme.breakpoints.down('xl')]: {
    gap: '80px',
    padding: '50px 10%',
  },
  [theme.breakpoints.down('lg')]: {
    padding: '50px 5%',
    alignItems: 'center',
    flexDirection: 'column',
  },
  [theme.breakpoints.down('md')]: {
    gap: '48px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '0 0 36px 0',
    gap: '20px',
  },
}));

export const StyledFallbackWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  minWidth: 0,
  width: '100%',
  gap: '16px',
  alignSelf: 'flex-start',
  flexDirection: 'row',
  maxWidth: 630,

  [theme.breakpoints.down('lg')]: {
    maxWidth: '100%',
  },
  [theme.breakpoints.down('md')]: {
    alignSelf: 'stretch',
    flexDirection: 'column',
  },
}));
