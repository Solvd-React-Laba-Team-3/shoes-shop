'use client';

import { FC } from 'react';
import MUICheckbox, { CheckboxProps } from '@mui/material/Checkbox';

export const Checkbox: FC<CheckboxProps> = ({ ...rest }) => {
  return (
    <MUICheckbox
      disableRipple
      sx={{
        '& .MuiSvgIcon-root': {
          fontSize: 16,
        },
        padding: 0,
        borderRadius: 2,
      }}
      {...rest}
    />
  );
};
