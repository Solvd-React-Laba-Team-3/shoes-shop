'use client';

import MUIToggleButton, { ToggleButtonProps } from '@mui/material/ToggleButton';
import { styled } from '@mui/material/styles';
import { FC } from 'react';

export const StyledToggleButton = styled(MUIToggleButton)<ToggleButtonProps>(
  () => ({
    fontSize: '15px',
    fontWeight: 300,
    cursor: 'pointer',
    color: '#5C5C5C;',
    border: '1px solid #494949',
    backgroundColor: 'transparent',
    width: '85px',
    height: '55px',

    '&.Mui-selected': {
      backgroundColor: '#F0F0F0',
      color: '#C4C4C4',
    },
    '&.Mui-selected:hover': {
      backgroundColor: '#E8E8E8',
    },
    '&.Mui-disabled': {
      backgroundColor: '#F9F9F9',
      color: '#B0B0B0',
      borderColor: '#D0D0D0',
      cursor: 'not-allowed',
      border: '1px solid #D0D0D0',
    },
    '&.MuiToggleButtonGroup-grouped.Mui-disabled': {
      border: '1px solid #D0D0D0',
    },
    '&.MuiToggleButtonGroup-grouped': {
      border: '1px solid #494949',
      borderRadius: '8px',
      margin: '0',
      padding: '0',
    },
  })
);

export const ToggleButton: FC<ToggleButtonProps> = ({ ...props }) => {
  return <StyledToggleButton {...props} />;
};
