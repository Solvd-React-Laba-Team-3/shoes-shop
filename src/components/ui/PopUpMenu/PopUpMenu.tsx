'use client';

import { FC } from 'react';
import { MenuProps } from '@mui/material/Menu';
import { StyledMenu } from './popUpMenu.styles';

export const PopUpMenu: FC<MenuProps> = (props) => {
  return (
    <StyledMenu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  );
};
