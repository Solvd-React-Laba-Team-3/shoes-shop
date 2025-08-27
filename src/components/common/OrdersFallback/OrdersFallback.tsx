'use client';

import { Box, Card, Skeleton, Typography } from '@mui/material';

export const OrdersFallback = () => {
  return (
    <Box sx={{ mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Order History
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '24px', md: '16px', lg: '26px' },
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Box key={i} sx={{ mb: 1 }}>
            <Skeleton
              variant="text"
              width="60%"
              sx={{ mb: 1, display: { sm: 'none' } }}
            />
            <Card
              sx={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                minHeight: { xs: '56px', sm: '88px' },
                maxHeight: { xs: '56px', sm: '88px' },
                display: 'flex',
                alignItems: 'center',
                backgroundColor: (theme) => theme.palette.grey[100],
              }}
            >
              <Box
                sx={{
                  p: { xs: 2, sm: 3 },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'wrap',
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    width: { md: '200px' },
                  }}
                >
                  <Skeleton variant="text" width="60px" />
                  <Skeleton
                    variant="text"
                    width="80px"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                  />
                </Box>
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Skeleton variant="text" width="80px" />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    width: { xs: '120px', lg: '340px' },
                    justifyContent: 'flex-end',
                    flexGrow: { xs: 1, sm: 0 },
                  }}
                >
                  <Skeleton
                    variant="text"
                    width="60px"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="100px"
                    height="24px"
                    sx={{ borderRadius: '16px' }}
                  />
                </Box>
              </Box>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
