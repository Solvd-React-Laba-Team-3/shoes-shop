'use client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '26px',
  alignItems: 'center',
  position: 'absolute',
  left: '58px',
  bottom: '-90px',

  [theme.breakpoints.down('md')]: {
    gap: '12px',
    left: 0,
  },
}));

const Loading = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '108px' }}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        width: '100%',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Skeleton
          variant="rectangular"
          height={250}
          style={{ width: '100%' }}
        />
        <StyledBox>
          <Skeleton
            variant="circular"
            sx={{
              border: (theme) => `4px solid ${theme.palette.common.white}`,
              width: '120px',
              height: '120px',
            }}
          />
          <Box>
            <Skeleton variant="text" width={150} height={32} />
            <Skeleton variant="text" width={130} height={18} />
          </Box>
        </StyledBox>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '36px',
          marginTop: '70px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Skeleton variant="text" width={300} height={70} />
          <Skeleton variant="rounded" width={120} height={36} />
        </Box>
      </Box>

      <Grid
        container
        columnSpacing={{ xs: 2, md: 8 }}
        rowSpacing={{ xs: 2, md: 5 }}
        sx={{ width: '100%' }}
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <Grid key={index} size={{ xs: 6, md: 4, lg: 3 }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: 320 / 380,
              }}
            >
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height="100%"
              />
            </Box>
            <Box paddingTop="12px">
              <Box display="flex" justifyContent="space-between" width="100%">
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="text" width="30%" height={30} />
              </Box>
              <Skeleton variant="text" width={100} height={30} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
);

export default Loading;
