'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
    fontSize: '24px',
  },
}));

export const Select: FC<SelectProps> = (props) => {
  return (
    <StyledSelect
      variant="outlined"
      IconComponent={ExpandMoreIcon}
      input={
        <OutlinedInput
          sx={{
            '&.MuiOutlinedInput-root': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: (theme) => theme.palette.grey[400],
              },
            },
          }}
        />
      }
      sx={{ minWidth: '72px' }}
      {...props}
    />
  );
};
