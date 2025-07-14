'use client';

import { FC, PropsWithChildren } from 'react';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import { palette } from '@/styles/palette';
import { typography } from '@/styles/typography';

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const theme = createTheme({
    palette,
    typography,
  });

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
