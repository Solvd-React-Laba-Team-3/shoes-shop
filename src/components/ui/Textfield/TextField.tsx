'use client';
import { FC } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input, { InputProps } from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

interface LabeledTextfieldProps extends InputProps {
  label: string;
}

const StyledInputLabel = styled(InputLabel)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '15px',
  fontWeight: 500,
  marginBottom: '8px',
  transform: 'none',
  position: 'static',
  '& .MuiInputLabel-asterisk': {
    color: theme.palette.error.main,
  },
  '&.Mui-focused': {
    color: theme.palette.text.secondary,
  },
  '&.Mui-error': {
    color: theme.palette.text.secondary,
  },
}));

const StyledInput = styled(Input)<{ error?: boolean }>(
  ({ theme }: { theme: Theme }) => ({
    padding: '12px 16px',
    border: '1px solid',
    borderRadius: '8px',
    color: theme.palette.text.secondary,
    fontSize: '15px',
  })
);

export const LabeledTextfield: FC<LabeledTextfieldProps> = ({
  label,
  error = false,
  id,
  required,
  ...props
}) => {
  return (
    <FormControl
      fullWidth
      error={error}
      sx={{
        '& > :not(style)': {
          width: '436px',
        },
      }}
    >
      <Box>
        <StyledInputLabel htmlFor={id} required={required} shrink>
          {label}
        </StyledInputLabel>
      </Box>

      <StyledInput id={id} error={error} disableUnderline {...props} />
    </FormControl>
  );
};
