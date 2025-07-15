'use client'
import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { TextFieldProps } from '@mui/material/TextField';

export const LabeledTextfield: FC<TextFieldProps> = ({
  id,
  value,
  placeholder,
  onChange,
  label,
  error = false,
  name,
}) => {
  return (
    <Box
      sx={{
        '& > :not(style)': {
          m: [1, 1, 1, 3],
          width: '436px',
        },
      }}
    >
      <FormControl fullWidth error={error}>
        <Box>
          <InputLabel
            htmlFor={id}
            required
            shrink
            sx={{
              color: '#494949',
              fontSize: '15px',
              fontWeight: 500,
              marginBottom: '8px',
              transform: 'none',
              position: 'static',
              '& .MuiInputLabel-asterisk': {
                color: '#FE645E',
              },
              '&.Mui-focused': {
                color: '#494949',
              },
              '&.Mui-error': {
                color: '#494949',
              },
            }}
          >
            {label}
          </InputLabel>
        </Box>

        <Input
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          name={name}
          disableUnderline
          sx={{
            padding: '12px 16px',
            border: '1px solid',
            borderColor: error ? '#d32f2f' : '#494949',
            borderRadius: '8px',
            color: '#5C5C5C',
            fontSize: '15px',
          }}
        />
      </FormControl>
    </Box>
  );
};
