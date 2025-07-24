import CircularProgress from '@mui/material/CircularProgress';
import { Button } from '../ui';
import { FC } from 'react';

interface LoaderButtonProps {
  isSubmitting: boolean;
  text: string;
  loadingText: string;
}

export const LoaderButton: FC<LoaderButtonProps> = ({
  isSubmitting,
  text,
  loadingText,
}) => {
  return (
    <Button
      type="submit"
      size="large"
      sx={{
        mt: '56px',
        '& .MuiCircularProgress-root': {
          color: (theme) => theme.palette.common.white,
          marginLeft: '10px',
        },
      }}
      disabled={isSubmitting}
    >
      {isSubmitting ? loadingText : text}
      {isSubmitting && <CircularProgress size={12} />}
    </Button>
  );
};
