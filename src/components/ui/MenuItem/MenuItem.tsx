'use client';

import MUIMenuItem from '@mui/material/MenuItem';
import { MenuItemProps } from '@mui/material/MenuItem';
import { FC } from 'react';

export const MenuItem: FC<MenuItemProps> = ({
  disabled,
  onClick,
  ...props
}) => {
  return (
    <MUIMenuItem
      disableRipple
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...props}
    />
  );
};
