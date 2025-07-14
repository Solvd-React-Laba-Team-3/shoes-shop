'use client';

import MUIIconButton from '@mui/material/IconButton';
import { FC } from 'react';
import { IconButtonProps as MUIIconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

const StyledIconButton = styled(MUIIconButton)({
  borderRadius: '12px',
  padding: '10px',
});

export const IconButton: FC<MUIIconButtonProps> = (props) => {
  return <StyledIconButton disableRipple {...props} />;
};
