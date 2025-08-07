import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { FC } from 'react';

interface MessageFallbackProps {
  align: 'left' | 'right';
}

export const MessageFallback: FC<MessageFallbackProps> = ({ align }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: align === 'left' ? 'flex-start' : 'flex-end',
      padding: '0px 10px',
    }}
  >
    <Skeleton
      variant="rounded"
      width={150}
      height={40}
      sx={{
        borderRadius: '16px',
        borderBottomRightRadius: align === 'right' ? '4px' : '16px',
        borderBottomLeftRadius: align === 'right' ? '16px' : '4px',
      }}
    />
  </Box>
);
