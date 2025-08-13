import { Box, Divider, Grid, Skeleton } from '@mui/material';

export const ProductListFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '28px',
      width: '100%',
      padding: { xs: '12px 20px', md: '40px 60px' },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'end',
      }}
    >
      {' '}
      <Box display="flex" flexDirection="column" gap={1}>
        <Skeleton variant="text" width={180} height={50} />
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Divider sx={{ margin: '8px 0' }} />
          <Skeleton variant="text" width={200} height={30} />
          <Skeleton variant="text" width={250} height={40} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton
          variant="text"
          width={120}
          height={36}
          sx={{ display: { xs: 'none', md: 'block' } }}
        />
        <Skeleton variant="text" width={120} height={36} />
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
            sx={{ position: 'relative', width: '100%', aspectRatio: 320 / 380 }}
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
);
