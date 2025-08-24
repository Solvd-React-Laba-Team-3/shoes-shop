'use client';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material';

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: '60px 85px',
  gap: '48px',
  [theme.breakpoints.down('sm')]: {
    padding: '20px 30px',
    gap: '24px',
  },
  [theme.breakpoints.down('xl')]: {
    flexDirection: 'column',
  },
  maxWidth: '1600px',
  margin: '0 auto',
}));

export const CartFallback = () => {
  return (
    <StyledContainer>
      <Stack
        sx={{
          flex: 2,
          minWidth: 0,
          flexShrink: 1,
          width: { xs: '100%', xl: '700px' },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            mb: { xs: 2, sm: 3, md: 4 },
          }}
        >
          Cart
        </Typography>
        <Stack
          direction="column"
          alignItems="stretch"
          sx={{ gap: { xs: 1.5, sm: 3, md: 4 } }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Stack key={index}>
              <Box>
                <Stack
                  direction="row"
                  sx={{
                    marginRight: { xs: 0, md: 4 },
                    alignItems: 'flex-end',
                    gap: { xs: 1.5, sm: 3, md: 4 },
                  }}
                >
                  <Stack
                    sx={{
                      flexShrink: 1,
                      minWidth: 0,
                      gap: { xs: 1.5, sm: 3, md: 4 },
                      alignItems: 'flex-start',
                      flexDirection: { xs: 'column', md: 'row' },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        aspectRatio: '1 / 1',
                        flexShrink: 0,
                        marginRight: { xs: 0, md: '46px' },
                        width: { xs: '200px', sm: '300px' },
                        height: { xs: '200px', sm: '300px' },
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        sx={{ borderRadius: 1 }}
                      />
                    </Box>

                    <Stack spacing={0.5}>
                      <Skeleton variant="text" width={200} height={32} />
                      <Skeleton variant="text" width={150} height={24} />
                      <Skeleton variant="text" width={100} height={24} />
                      <Skeleton variant="text" width={80} height={24} />
                    </Stack>
                  </Stack>

                  <Stack
                    direction="column"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    sx={{
                      flex: 1,
                      alignSelf: 'stretch',
                      minHeight: '100%',
                    }}
                  >
                    <Skeleton variant="text" width={100} height={32} />
                    <Box display="flex" alignItems="center" gap={2}>
                      <Skeleton
                        variant="rectangular"
                        width={80}
                        height={25}
                        sx={{ borderRadius: 1 }}
                      />
                      <Skeleton
                        variant="text"
                        width={60}
                        height={24}
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                      />
                      <Skeleton variant="text" width={80} height={24} />
                    </Box>
                  </Stack>
                </Stack>
              </Box>
              <Divider sx={{ margin: '60px 0' }} />
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Stack
        sx={{
          flex: '0 0 auto',
          width: { xs: '100%', xl: '400px' },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            mb: { xs: 2, sm: 3, md: 4 },
          }}
        >
          Summary
        </Typography>
        <Stack direction="column">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={60}
            sx={{ borderRadius: 1 }}
          />
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
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            sx={{ borderRadius: 1 }}
          />
        </Stack>
      </Stack>
    </StyledContainer>
  );
};
