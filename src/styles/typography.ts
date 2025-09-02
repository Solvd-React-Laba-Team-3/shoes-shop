import { createBreakpoints } from '@mui/system';

const breakpoints = createBreakpoints({});

export const typography = {
  fontFamily: 'Work Sans',
  h1: {
    fontSize: 140,
    fontWeight: 900,
    [breakpoints.down('md')]: { fontSize: 72 },
    [breakpoints.down('sm')]: { fontSize: 48 },
  },
  h2: {
    fontSize: 45,
    fontWeight: 500,
    [breakpoints.down('md')]: { fontSize: 28 },
    [breakpoints.down('sm')]: { fontSize: 26 },
  },
  h3: {
    fontSize: 30,
    fontWeight: 500,
    [breakpoints.down('sm')]: { fontSize: 22 },
  },
  h4: {
    fontSize: 25,
    fontWeight: 500,
    [breakpoints.down('sm')]: { fontSize: 20 },
  },
  h5: {
    fontSize: 22,
    fontWeight: 500,
    [breakpoints.down('sm')]: { fontSize: 18 },
  },
  h6: {
    fontSize: 20,
    fontWeight: 500,
    [breakpoints.down('sm')]: { fontSize: 16 },
  },
  subtitle1: {
    fontSize: 18,
    fontWeight: 500,
    [breakpoints.down('sm')]: { fontSize: 16 },
  },
  subtitle2: {
    fontSize: 16,
    fontWeight: 500,
    [breakpoints.down('sm')]: { fontSize: 14 },
  },
  body1: {
    fontSize: 24,
    fontWeight: 300,
    [breakpoints.down('sm')]: { fontSize: 16 },
  },
  body2: {
    fontSize: 16,
    fontWeight: 300,
    [breakpoints.down('sm')]: { fontSize: 14 },
  },
  caption: {
    fontSize: 15,
    fontWeight: 300,
    [breakpoints.down('sm')]: { fontSize: 12 },
  },
};
