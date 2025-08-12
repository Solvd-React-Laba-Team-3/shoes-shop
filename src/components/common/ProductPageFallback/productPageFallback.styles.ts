import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  [theme.breakpoints.up('xs')]: {
    padding: '0 0 36px 0',
    flexDirection: 'column',
    gap: '20px',
  },
  [theme.breakpoints.up('sm')]: {
    gap: '48px',
  },
  [theme.breakpoints.up('md')]: {
    padding: '50px 5%',
  },
  [theme.breakpoints.up('lg')]: {
    gap: '80px',
    padding: '50px 10%',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  [theme.breakpoints.up('xl')]: {
    gap: '100px',
    padding: '100px 15%',
  },
}));

export const StyledFallbackWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  minWidth: 0,
  width: '100%',
  gap: '16px',
  [theme.breakpoints.up('xs')]: {
    alignSelf: 'stretch',
    maxWidth: '100%',
    flexDirection: 'column',
  },
  [theme.breakpoints.up('md')]: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 630,
  },
}));
