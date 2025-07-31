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
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <Box key={index}>
          <Skeleton
            key={index}
            variant="rectangular"
            width={380}
            height={460}
          />
          <Box paddingTop="12px">
            <Box display="flex" justifyContent="space-between">
              <Skeleton variant="text" width={200} height={30} />
              <Skeleton variant="text" width={70} height={30} />
            </Box>
            <Skeleton variant="text" width={100} height={30} />
          </Box>
        </Box>
      ))}
    </Grid>
  </Box>
);
