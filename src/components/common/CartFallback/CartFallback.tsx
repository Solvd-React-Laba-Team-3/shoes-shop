'use client';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

export const CartFallback = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '80px 196px',
      }}
    >
      <Stack>
        <Typography variant="h2" sx={{ marginBottom: '32px' }}>
          Cart
        </Typography>
        <Box>
          <Stack direction="column" spacing={4} alignItems="stretch">
            {Array.from({ length: 3 }).map((_, index) => (
              <Stack key={index}>
                <Box>
                  <Stack direction="row" spacing={4}>
                    <Skeleton variant="rectangular" width={223} height={214} />
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{
                        height: 214,
                        flexGrow: 1,
                      }}
                    >
                      <Stack spacing={0.5}>
                        <Skeleton variant="text" width={200} height={32} />
                        <Skeleton variant="text" width={150} height={24} />
                        <Skeleton variant="text" width={100} height={24} />
                        <Skeleton variant="text" width={80} height={24} />
                      </Stack>

                      <Stack
                        direction="column"
                        justifyContent="space-between"
                        alignItems="flex-end"
                        sx={{ marginRight: '166px' }}
                      >
                        <Skeleton variant="text" width={100} height={32} />
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Skeleton
                            variant="rectangular"
                            width={80}
                            height={25}
                          />
                          <Skeleton variant="text" width={100} height={24} />
                          <Skeleton variant="text" width={80} height={24} />
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
                <Divider sx={{ margin: '60px 0' }} />
              </Stack>
            ))}
          </Stack>
        </Box>
      </Stack>

      <Stack>
        <Typography variant="h2" sx={{ marginBottom: '32px' }}>
          Summary
        </Typography>
        <Box>
          <Stack direction="column">
            <Skeleton variant="rectangular" width={400} height={60} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '38px 0 20px',
              }}
            >
              <Skeleton variant="text" width={100} height={32} />
              <Skeleton variant="text" width={100} height={32} />
            </Box>
            <Divider sx={{ marginTop: '56px' }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '20px 0',
              }}
            >
              <Skeleton variant="text" width={100} height={32} />
              <Skeleton variant="text" width={100} height={32} />
            </Box>
            <Divider sx={{ marginBottom: '113px' }} />
            <Skeleton variant="rectangular" width="100%" height={40} />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
