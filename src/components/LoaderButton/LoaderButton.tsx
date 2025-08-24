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
      sx={(theme) => ({
        mt: '56px',
        '& .MuiCircularProgress-root': {
          color: (theme) => theme.palette.common.white,
          marginLeft: '10px',
        },
        [theme.breakpoints.down(420)]: {
          width: '100%',
          mt: '20px',
        },
        // '@media (max-width: 420px)': {
        //   width: '100%',
        //   mt: '20px',
        // },
      })}
      disabled={isSubmitting}
    >
      {isSubmitting ? loadingText : text}
      {isSubmitting && <CircularProgress size={12} />}
    </Button>
  );
};
