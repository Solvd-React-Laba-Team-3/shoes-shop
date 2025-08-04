'use client';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FormLabel from '@mui/material/FormLabel';
import { styled } from '@mui/material/styles';
import { FC } from 'react';

interface FormErrorMessageProps {
  message?: string | null;
}

const StyledFormLabel = styled(FormLabel)<FormErrorMessageProps>(
  ({ message }) => ({
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
    opacity: message ? 1 : 0,
  })
);

export const FormErrorMessage: FC<FormErrorMessageProps> = ({ message }) => {
  return (
    <StyledFormLabel message={message} error data-testid="form-error-message">
      <WarningAmberIcon fontSize="small" />
      {message}
    </StyledFormLabel>
  );
};
