'use client';

import MUIButton from '@mui/material/Button';
import { ButtonProps as MUIButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { FC } from 'react';

export const StyledButton = styled(MUIButton)<MUIButtonProps>(
  ({ size = 'medium', variant, fullWidth }) => ({
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    textTransform: 'none',
    boxShadow: 'none',

    ...(size === 'small' && {
      width: '150px',
      height: '40px',
    }),
    ...(size === 'medium' && {
      width: '250px',
      height: '60px',
    }),
    ...(size === 'large' && {
      width: '400px',
    }),
    ...(variant === 'text' && {
      width: 'unset',
    }),
    ...(fullWidth && {
      width: '100%',
      height: '60px',
    }),

    '&:hover': {
      boxShadow: 'none',
    },
  })
);

export const Button: FC<MUIButtonProps> = ({
  variant = 'contained',
  ...props
}) => {
  return <StyledButton disableRipple variant={variant} {...props} />;
};
