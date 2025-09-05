'use client';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.grey[100],
  boxShadow: 'none',
  height: '88px',

  [theme.breakpoints.down('sm')]: {
    height: '56px',
  },
}));

const StyledCardContent = styled(Box)(({ theme }) => ({
  padding: '24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
  width: '100%',

  [theme.breakpoints.down('sm')]: {
    padding: '16px',
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  width: '340px',
  justifyContent: 'flex-end',
  flexGrow: 0,

  [theme.breakpoints.down('lg')]: {
    width: '340px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '120px',
    flexGrow: 1,
  },
}));

export const OrdersFallback = () => {
  return (
    <Box sx={{ mx: 'auto' }}>
      <Typography variant="h5" component={'h1'} sx={{ mb: 4 }}>
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
            <StyledCard>
              <StyledCardContent>
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
                <StyledBox>
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
                </StyledBox>
              </StyledCardContent>
            </StyledCard>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
