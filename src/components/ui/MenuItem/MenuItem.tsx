'use client';

import MUIMenuItem from '@mui/material/MenuItem';
import { MenuItemProps } from '@mui/material/MenuItem';
import { FC } from 'react';

export const MenuItem: FC<MenuItemProps> = (props) => {
  return <MUIMenuItem disableRipple {...props} />;
};
