'use client';

import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export const FiltersFallback = () => (
  <Box
    sx={{
      width: '320px',
      paddingBottom: '200px',
      display: { xs: 'none', md: 'block' },
    }}
  >
    <Box sx={{ padding: '40px' }}>
      <Skeleton variant="text" width={200} height={30} />
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <Divider />
      {Array.from({ length: 5 }).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            paddingLeft: '40px',
          }}
        >
          <Skeleton variant="text" width={100} height={30} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {Array.from({ length: 4 }).map((_, innerIndex) => (
              <Box
                key={innerIndex}
                sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <Skeleton variant="rectangular" width={20} height={20} />
                <Skeleton variant="text" width={100} height={24} />
              </Box>
            ))}
          </Box>
          <Divider />
        </Box>
      ))}
    </Box>
  </Box>
);
