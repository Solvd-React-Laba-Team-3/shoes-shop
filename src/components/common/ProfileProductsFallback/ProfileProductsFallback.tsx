'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';

const StyledProfileWrapper = styled(Box)(() => ({
  display: 'flex',
  gap: '26px',
  alignItems: 'center',
  position: 'absolute',
  left: '58px',
  bottom: '-90px',
}));

export const ProfileProductsFallback = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '108px' }}>
    <Box sx={{ position: 'relative' }}>
      <Skeleton variant="rectangular" width="100%" height={250} />
      <StyledProfileWrapper data-testid="profile-wrapper">
        <Skeleton
          variant="circular"
          width={120}
          height={120}
          sx={{
            border: (theme) => `4px solid ${theme.palette.common.white}`,
          }}
        />
        <Box>
          <Skeleton variant="text" width={150} height={32} />
          <Skeleton variant="text" width={200} height={24} />
        </Box>
      </StyledProfileWrapper>
    </Box>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rectangular" width={120} height={36} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {[1, 2, 3, 4].map((index) => (
            <Skeleton key={index} variant="rectangular" height={350} />
          ))}
        </Box>
      </Box>
    </Box>
  </Box>
);
