'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import MUISelect, { SelectProps } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { FC } from 'react';

const StyledSelect = styled(MUISelect)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.text.secondary,
  '& .MuiSelect-select': {
    padding: '8px 8px',
  },
  '& .MuiSelect-icon': {
    color: theme.palette.text.secondary,
    fontSize: '12px',
    width: '12px',
    height: '12px',
  },
}));

export const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  '&.MuiOutlinedInput-root': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.grey[400],
    },
  },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.text.secondary,
  '&&.Mui-selected': {
    backgroundColor: 'white',
  },
}));

export const Select: FC<SelectProps> = ({ children, ...props }) => {
  return (
    <StyledSelect
      variant="outlined"
      IconComponent={ExpandMoreIcon}
      input={<StyledOutlinedInput />}
      sx={{width: '210px'}}
      {...props}
    >
      {children}
    </StyledSelect>
  );
};
