'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type BasicSelectProps = {
  gender: string;
};

export default function BasicSelect({ gender }: BasicSelectProps) {
  return (
    <Box sx={{ maxWidth: 210 }}>
      <FormControl fullWidth>
        <FormLabel id="demo-simple-select-label">{gender}</FormLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Age"
          IconComponent={ExpandMoreIcon}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderRadius: '8px',
              borderColor: '#494949',
            },

            backgroundColor: 'white',
          }}
        >
          <MenuItem value={'male'}>Male</MenuItem>
          <MenuItem value={'female'}>Female</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
