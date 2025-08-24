import { createBreakpoints } from '@mui/system';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xxl: true;
  }
}

export const breakpoints = createBreakpoints({
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
    xxl: 1750,
  },
});
