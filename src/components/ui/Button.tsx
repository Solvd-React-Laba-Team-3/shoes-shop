'use client';

import MUIButton from '@mui/material/Button';
import { ButtonProps as MUIButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { FC } from 'react';

export const StyledButton = styled(MUIButton)<MUIButtonProps>(
  ({ size = 'medium' }) => ({
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    textTransform: 'none',
    boxShadow: 'none',

    ...(size === 'small' && {
      width: '150px',
    }),
    ...(size === 'medium' && {
      width: '250px',
    }),
    ...(size === 'large' && {
      width: '400px',
    }),

    '&:hover': {
      boxShadow: 'none',
    },
  })
);

export const Button: FC<MUIButtonProps> = (props) => {
  return <StyledButton disableRipple {...props} />;
};
