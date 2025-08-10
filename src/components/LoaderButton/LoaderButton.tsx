import CircularProgress from '@mui/material/CircularProgress';
import { Button } from '../ui';
import { FC } from 'react';

interface LoaderButtonProps {
  isSubmitting: boolean;
  text: string;
  loadingText: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoaderButton: FC<LoaderButtonProps> = ({
  isSubmitting,
  text,
  loadingText,
  size = 'large',
}) => {
  return (
    <Button
      type="submit"
      size={size}
      sx={{
        mt: '56px',
        '& .MuiCircularProgress-root': {
          color: (theme) => theme.palette.common.white,
          marginLeft: '10px',
        },
        '@media (max-width: 420px)': {
          width: '90%',
        },
      }}
      disabled={isSubmitting}
    >
      {isSubmitting ? loadingText : text}
      {isSubmitting && <CircularProgress size={12} />}
    </Button>
  );
};
