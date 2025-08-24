'use client';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { InputProps } from '@mui/material/Input';
import { FC } from 'react';
import { StyledInput, StyledInputLabel } from './labeledTextfield.styles';
import { useTheme } from '@mui/material/styles';
import { FormErrorMessage } from '../FormErrorMessage/FormErrorMessage';

interface LabeledTextfieldProps extends InputProps {
  label?: string;
  errorMessage?: string | null;
}

export const LabeledTextfield: FC<LabeledTextfieldProps> = ({
  label,
  error,
  errorMessage,
  id,
  required,
  ...props
}) => {
  const theme = useTheme();
  const isError = error || !!errorMessage;

  return (
    <FormControl
      fullWidth
      error={isError}
      sx={{
        '& label': {
          fontSize: theme.typography.body1.fontSize,
          [theme.breakpoints.down('sm')]: {
            fontSize: theme.typography.pxToRem(12),
          },
        },
        '& input': {
          fontSize: theme.typography.body1.fontSize,
          [theme.breakpoints.down('sm')]: {
            fontSize: theme.typography.pxToRem(12),
          },
        },
      }}
    >
      {label && (
        <Box>
          <StyledInputLabel htmlFor={id} required={required} shrink>
            {label}
          </StyledInputLabel>
        </Box>
      )}
      <StyledInput id={id} error={isError} disableUnderline {...props} />
      <FormErrorMessage message={errorMessage} />
    </FormControl>
  );
};
