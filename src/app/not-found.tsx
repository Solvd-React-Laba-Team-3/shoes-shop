'use client';

import { Header } from '@/components/common/Header';
import { Button } from '@/components/ui';
import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const StyledWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  height: '100%',
  padding: '0 16px',

  [theme.breakpoints.up('sm')]: { padding: '0 5%' },
  [theme.breakpoints.up('md')]: { padding: '0 10%' },
  [theme.breakpoints.up('lg')]: {
    position: 'relative',
    padding: 0,
  },
}));

const StyledTextContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: '24px 16px',
  gap: 20,
  justifyContent: 'center',
  backgroundColor: 'rgba(242,242,242, 0.5)',
  backdropFilter: 'blur(10px)',
  borderRadius: 10,

  [theme.breakpoints.up('sm')]: { padding: '32px 24px' },
  [theme.breakpoints.up('md')]: { padding: '36px 28px' },
  [theme.breakpoints.up('lg')]: {
    width: '56%',
    padding: 0,
    backgroundColor: 'transparent',
    backdropFilter: 'none',
  },
}));

export default function NotFound() {
  const router = useRouter();

  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          position: 'relative',
          flex: '1 1 auto',
        }}
      >
        <StyledWrapper>
          <StyledTextContainer direction="column">
            <Typography variant="h2" component="h1">
              Error 404
            </Typography>

            <Typography variant="h6" component="p" color="text.secondary">
              Looks like you&apos;ve wandered off the map. The page you&apos;re
              looking for doesn&apos;t exist, was moved, or might have been
              retired.
            </Typography>

            <Typography variant="h6" component="p" color="text.secondary">
              Don&apos;t worry - use the navigation below
            </Typography>

            <Stack
              sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                gap: '16px',
                justifyContent: { xs: 'space-between', sm: 'unset' },
                marginTop: { xs: '16px', md: '32px' },
              }}
            >
              <Button
                sx={{ width: { xs: '100%', sm: '152px' }, height: '40px' }}
                variant="outlined"
                onClick={() => router.back()}
              >
                Go back
              </Button>

              <Button
                sx={{ width: { xs: '100%', sm: '152px' }, height: '40px' }}
                variant="contained"
                onClick={() => router.push('/')}
              >
                Home
              </Button>
            </Stack>
          </StyledTextContainer>
        </StyledWrapper>

        <Box sx={{ flex: 1 }}>
          <Image
            src="/page-404-image.png"
            width={1000}
            height={1000}
            alt="page 404 - image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      </Box>
    </Box>
  );
}
