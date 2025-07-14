import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

type ReusableTextFieldsProps = {
  label?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  name?: string;
};

export default function BasicTextFields(props: ReusableTextFieldsProps) {
  const { value, placeholder, onChange, label } = props;

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': {
          m: 1,
          width: '436px',
        },
      }}
      noValidate
      autoComplete="off"
    >
      <FormControl>
        <FormLabel
          htmlFor="outlined-basic"
          sx={{
            color: '#000000',
            '& .MuiFormLabel-asterisk': { color: 'red' },
          }}
          required
        >
          {label}
        </FormLabel>
        <TextField
          id="outlined-basic"
          variant="outlined"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          fullWidth
          sx={{
            marginTop: '8px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#494949',
                borderRadius: '8px',
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
