import { Box } from '@mui/material';
import Image from 'next/image';

export const AuthImagePanel = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        position: 'relative',
      }}
    >
      <Image
        src="/login.jpg"
        alt="login"
        fill
        style={{
          objectFit: 'cover', 
        }}
      ></Image>
    </Box>
  );
};
