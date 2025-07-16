'use client';

import { FC, PropsWithChildren } from 'react';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import { palette } from '@/styles/palette';
import { typography } from '@/styles/typography';

export const theme = createTheme({
  palette,
  typography,
  shape: {
    borderRadius: '8px',
  },
});

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
