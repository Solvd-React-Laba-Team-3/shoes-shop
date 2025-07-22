'use client';

import { BONUS_POINTS } from '@/constants/bonusPoints';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function MyProducts() {
  const { data: session } = useSession();

  return (
    <Box sx={{ padding: '38px 53px' }}>
      <Box sx={{ position: 'relative' }}>
        <Image
          src="/profile-banner.png"
          alt="My Products"
          width={1500}
          height={250}
          style={{ height: '250px', width: '100%' }}
        />
        <Box
          sx={{
            display: 'flex',
            gap: '26px',
            alignItems: 'center',
            position: 'absolute',
            left: '58px',
            bottom: '-90px',
          }}
        >
          <Avatar
            src="/avatar-placeholder.png"
            alt="Avatar"
            sx={{
              border: (theme) => `4px solid ${theme.palette.common.white}`,
              width: '120px',
              height: '120px',
            }}
          />
          <Box>
            <Typography variant="h6">{session?.user?.username}</Typography>
            <Typography variant="caption">
              {BONUS_POINTS} bonus points
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
