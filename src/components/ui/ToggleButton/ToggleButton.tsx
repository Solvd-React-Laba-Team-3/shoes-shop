'use client';

import { FC } from 'react';
import { ToggleButtonProps } from '@mui/material/ToggleButton';
import { StyledToggleButton } from './toggleButton.styles';

export const ToggleButton: FC<ToggleButtonProps> = (props) => {
  return <StyledToggleButton disableRipple {...props} />;
};
