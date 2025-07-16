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

interface SelectOption {
  label: string;
  value: string;
}

interface BasicSelectProps extends Omit<SelectProps, 'value'> {
  value: string;
  label?: string;
  error?: boolean;
  options: SelectOption[];
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
  '&&.Mui-selected': {
    backgroundColor: 'white',
  },
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
  error,
  options = [],
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
          {options.map((option) => (
            <StyledMenuItem key={option.value} value={option.value}>
              {option.label}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </FormControl>
    </Box>
  );
};
