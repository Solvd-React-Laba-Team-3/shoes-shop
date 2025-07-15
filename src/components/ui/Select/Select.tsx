'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';
import { FC } from 'react';
import { styled } from '@mui/material/styles';

interface BasicSelectProps extends Omit<SelectProps, 'value'> {
  value: string;
  label?: string;
  error?: boolean;
}

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: 'white',
  fontSize: 10,
  padding: 2,
  color: theme.palette.text.secondary,
  '& .MuiSelect-select': {
    padding: '8px 8px',
  },
  '& .MuiSelect-icon': {
    color: '#494949',
  },

  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#494949',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#494949',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#494949',
  },
}));

export const BasicSelect: FC<BasicSelectProps> = ({
  value,
  label = 'Gender',
  id,
  name,
  error = false,
  ...props
}) => {
  return (
    <Box sx={{ maxWidth: 152 }}>
      <FormHelperText
        id={`${id}-label`}
        sx={{ mb: '5px', color: '#494949' }}
        error={error}
      >
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
          {...props}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </StyledSelect>
      </FormControl>
    </Box>
  );
};
