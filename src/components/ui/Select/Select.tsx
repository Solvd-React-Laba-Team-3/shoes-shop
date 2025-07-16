'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectProps } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { FC } from 'react';

interface BasicSelectProps extends Omit<SelectProps, 'value'> {
  value: string;
  label?: string;
  error?: boolean;
}

const StyledSelect = styled(Select)(({ theme }) => ({
  fontSize: 15,
  color: theme.palette.text.secondary,
  '& .MuiSelect-select': {
    padding: '8px 8px',
  },
  '& .MuiSelect-icon': {
    color: theme.palette.text.secondary,
    width: '13px',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '15px',
  color: theme.palette.text.secondary,
}));

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  '&.MuiOutlinedInput-root': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.grey[400],
    },
  },
}));

export const BasicSelect: FC<BasicSelectProps> = ({
  value,
  label,
  id,
  name,
  error = false,
  ...props
}) => {
  return (
    <Box sx={{ maxWidth: 152 }}>
      <FormHelperText id={`${id}-label`} sx={{ mb: '5px' }} error={error}>
        {label}
      </FormHelperText>

      <FormControl fullWidth>
        <StyledSelect
          id={id}
          name={name}
          value={value}
          IconComponent={ExpandMoreIcon}
          error={error}
          variant="outlined"
          input={<StyledOutlinedInput />}
          {...props}
        >
          <StyledMenuItem value="male">Male</StyledMenuItem>
          <StyledMenuItem value="female">Female</StyledMenuItem>
        </StyledSelect>
      </FormControl>
    </Box>
  );
};
