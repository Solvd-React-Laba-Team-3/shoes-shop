import { Box, Grid, Skeleton, Typography } from '@mui/material';

export const ProductListFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      padding: '40px 60px',
      gap: '28px',
    }}
  >
    <Typography variant="h4">Catalog</Typography>
    <Grid
      container
      columnSpacing={{ xs: 2, md: 8 }}
      rowSpacing={{ xs: 2, md: 5 }}
      sx={{ width: '100%' }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
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
