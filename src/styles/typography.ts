import { createTheme } from '@mui/material/styles';

const tempTheme = createTheme();

export const typography = {
  fontFamily: 'Work Sans',
  h1: {
    fontSize: 140,
    fontWeight: 900,
    [tempTheme.breakpoints.down('md')]: { fontSize: 72 },
    [tempTheme.breakpoints.down('sm')]: { fontSize: 48 },
  },
  h2: {
    fontSize: 45,
    fontWeight: 500,
    [tempTheme.breakpoints.down('md')]: { fontSize: 28 },
    [tempTheme.breakpoints.down('sm')]: { fontSize: 24 },
  },
  h3: {
    fontSize: 30,
    fontWeight: 500,
    [tempTheme.breakpoints.down('sm')]: { fontSize: 22 },
  },
  h4: {
    fontSize: 25,
    fontWeight: 500,
    [tempTheme.breakpoints.down('sm')]: { fontSize: 20 },
  },
  h5: {
    fontSize: 22,
    fontWeight: 500,
    [tempTheme.breakpoints.down('sm')]: { fontSize: 18 },
  },
  h6: {
    fontSize: 20,
    fontWeight: 500,
    [tempTheme.breakpoints.down('sm')]: { fontSize: 16 },
  },
  subtitle1: {
    fontSize: 18,
    fontWeight: 500,
    [tempTheme.breakpoints.down('sm')]: { fontSize: 16 },
  },
  subtitle2: {
    fontSize: 16,
    fontWeight: 500,
    [tempTheme.breakpoints.down('sm')]: { fontSize: 14 },
  },
  body1: {
    fontSize: 24,
    fontWeight: 300,
    [tempTheme.breakpoints.down('sm')]: { fontSize: 16 },
  },
  body2: {
    fontSize: 16,
    fontWeight: 300,
    [tempTheme.breakpoints.down('sm')]: { fontSize: 14 },
  },
  caption: {
    fontSize: 15,
    fontWeight: 300,
    [tempTheme.breakpoints.down('sm')]: { fontSize: 12 },
  },
};
