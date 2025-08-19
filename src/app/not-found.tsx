'use client';

import { Header } from '@/components/common/Header';
import { Button } from '@/components/ui';
import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: { xs: 'absolute', lg: 'relative' },
            height: '100%',
            padding: { xs: '0 16px', sm: '0 5%', md: '0 10%', lg: 0 },
          }}
        >
          <Stack
            direction={'column'}
            sx={{
              width: { xs: '100%', lg: '56%' },
              padding: {
                xs: '24px 16px',
                sm: '32px 24px',
                md: '36px 28px',
                lg: 0,
              },
              gap: '20px',
              justifyContent: 'center',
              backgroundColor: {
                xs: 'rgba(242,242,242, 0.5)',
                lg: 'transparent',
              },
              backdropFilter: { xs: 'blur(10px)', lg: 0 },
              borderRadius: '10px',
            }}
          >
            <Typography variant="h2" component={'h1'}>
              Error 404
            </Typography>
            <Typography variant="h6" component={'p'} color="text.secondary">
              Looks like you&apos;ve wandered off the map. The page you&apos;re
              looking for doesn&apos;t exist, was moved, or might have been
              retired.
            </Typography>
            <Typography variant="h6" component={'p'} color="text.secondary">
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
          </Stack>
        </Box>
        <Box
          sx={{
            flex: 1,
          }}
        >
          <Image
            src={'/page-404-image.png'}
            width={1000}
            height={1000}
            alt="page 404 - image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
