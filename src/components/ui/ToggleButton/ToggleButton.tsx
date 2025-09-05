'use client';

import { FC } from 'react';
import { ToggleButtonProps as MUIToggleButtonProps } from '@mui/material/ToggleButton';
import { StyledToggleButton } from './toggleButton.styles';

export interface ToggleButtonProps extends MUIToggleButtonProps {
  error?: boolean;
}

export const ToggleButton: FC<ToggleButtonProps> = ({ error, ...props }) => {
  return <StyledToggleButton disableRipple {...props} error={error} />;
};
