'use client';
import { FC } from 'react';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type BasicSelectProps = {
  value: string;
  label?: string;
  onChange?: (event: SelectChangeEvent) => void;
  id?: string;
  name?: string;
};

export const BasicSelect: FC<BasicSelectProps> = ({
  value,
  label = 'Gender',
  onChange,
  id,
  name,
}) => {
  return (
    <Box sx={{ maxWidth: 152 }}>
      <FormHelperText id={`${id}-label`} sx={{ mb: '5px', color: '#494949' }}>
        {label}
      </FormHelperText>

      <FormControl fullWidth>
        <Select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          IconComponent={ExpandMoreIcon}
          variant="outlined"
          sx={{
            backgroundColor: 'white',
            fontSize: '10px',
            padding: '2px',
            color: '#5C5C5C',
            '& .MuiOutlinedInput-notchedOutline': {
              borderRadius: '8px',
              borderColor: '#494949',
            },
            '& .MuiSelect-select': {
              padding: '8px 8px',
            },
            '& .MuiSelect-icon': {
              color: '#494949',
            },
          }}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
