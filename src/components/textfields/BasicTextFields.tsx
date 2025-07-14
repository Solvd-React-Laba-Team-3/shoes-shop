'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

type ReusableTextFieldsProps = {
  id: string;
  label?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  name?: string;
  error?: boolean;
  helperText?: string;
};

export default function BasicTextFields(props: ReusableTextFieldsProps) {
  const { id, value, placeholder, onChange, label } = props;

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': {
          m: [1, 1, 1, 3],
          width: '436px',
        },
      }}
      noValidate
      autoComplete="off"
    >
      <FormControl>
        <FormLabel
          htmlFor={id}
          sx={{
            color: '#000000',
            '& .MuiFormLabel-asterisk': { color: 'red' },
          }}
          required
        >
          {label}
        </FormLabel>
        <TextField
          id={id}
          variant="outlined"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          fullWidth
          error={props.error}
          helperText={props.helperText}
          sx={{
            marginTop: '8px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: props.error ? '#d32f2f' : '#494949',
                borderRadius: '8px',
              },
              '&:hover fieldset': {
                borderColor: props.error ? '#d32f2f' : '#000000',
              },
              '&.Mui-focused fieldset': {
                borderColor: props.error ? '#d32f2f' : '#000000',
              },
              '& input': {
                color: '#5C5C5C',
              },
            },
          }}
        />
      </FormControl>
    </Box>
  );
}
