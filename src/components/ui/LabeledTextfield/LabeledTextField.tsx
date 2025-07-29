'use client';
import { FormHelperText } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Input, { InputProps } from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { styled, Theme } from '@mui/material/styles';
import { FC } from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface LabeledTextfieldProps extends InputProps {
  label: string;
  errorMessage?: string;
  maxWidth?: string;
  reserveErrorSpace?: boolean;
}

const StyledInputLabel = styled(InputLabel)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.text.secondary,
  ...theme.typography.caption,
  fontWeight: 500,
  marginBottom: '8px',
  transform: 'none',
  position: 'static',
  '& .MuiInputLabel-asterisk': {
    color: theme.palette.error.main,
  },
}));

const StyledInput = styled(Input, {
  shouldForwardProp: (propName) => propName !== 'error',
})<{ error?: boolean }>(({ theme, error }) => ({
  padding: '12px 16px',
  border: '1px solid',
  borderRadius: '8px',
  color: theme.palette.text.secondary,
  ...theme.typography.caption,
  borderColor: error ? theme.palette.error.main : theme.palette.text.secondary,
}));

export const LabeledTextfield: FC<LabeledTextfieldProps> = ({
  label,
  error,
  errorMessage,
  id,
  required,
  maxWidth = '436px',
  reserveErrorSpace = false,
  ...props
}) => {
  const showError = error && errorMessage;
  const shouldReserveSpace = reserveErrorSpace || showError;

  return (
    <FormControl
      fullWidth
      error={error}
      color="secondary"
      sx={{
        '& .MuiInputBase-root': {
          maxWidth: maxWidth,
        },
      }}
    >
      <Box>
        <StyledInputLabel htmlFor={id} required={required} shrink>
          {label}
        </StyledInputLabel>
      </Box>

      <StyledInput id={id} error={error} disableUnderline {...props} />

      {shouldReserveSpace && (
        <FormHelperText
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 0.5,
            fontSize: '12px',
            fontWeight: '400',
            minHeight: '20px',
            visibility: showError ? 'visible' : 'hidden',
          }}
        >
          <WarningAmberIcon fontSize="small" />
          {errorMessage ?? ' '}
        </FormHelperText>
      )}
    </FormControl>
  );
};
