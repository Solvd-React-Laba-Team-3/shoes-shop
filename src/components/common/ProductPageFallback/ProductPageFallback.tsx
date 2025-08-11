'use client';

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import {
  StyledContainer,
  StyledFallbackWrapper,
} from './productPageFallback.styles';

export const ProductPageFallback = () => {
  return (
    <StyledContainer>
      <StyledFallbackWrapper>
        <Stack
          direction={{ xs: 'row', md: 'column' }}
          spacing={{ xs: '8px', md: '16px' }}
          sx={{
            width: { xs: '100%', md: '76px' },
            order: { xs: 2, md: 0 },
          }}
        >
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              sx={{
                width: { xs: '100%', md: '76px' },
                height: 'auto',
                aspectRatio: '1/1',
              }}
            />
          ))}
        </Stack>
        <Skeleton
          variant="rounded"
          sx={{
            height: '100%',
            width: '100%',
            aspectRatio: '1/1',
          }}
        />
      </StyledFallbackWrapper>
      <Stack
        flexShrink={{ xs: 1, md: 0 }}
        sx={{
          width: { lg: '412px', xl: '525px' },
          paddingInline: { xs: '16px', sm: '24px', md: '0' },
        }}
      >
        <Stack
          direction="column"
          justifyContent={'space-between'}
          sx={{
            paddingBottom: '48px',
          }}
        >
          <Stack direction="row">
            <Skeleton variant="rounded" sx={{ width: '100%' }} />
            <Skeleton
              variant="rounded"
              sx={{ fontSize: '22px', minWidth: '15%', marginLeft: '20px' }}
            />
          </Stack>
          <Skeleton variant="rounded" sx={{ fontSize: '24px', width: '30%' }} />
        </Stack>

        <Stack direction={'column'} sx={{ marginBottom: '36px' }}>
          <Skeleton
            variant="rounded"
            sx={{ fontSize: '20px', width: '30%', marginBottom: '24px' }}
          />
          <Stack
            direction={'row'}
            flexWrap="wrap"
            gap={{ xs: '14px', sm: '24px' }}
          >
            {[...Array(14)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                sx={{
                  width: { xs: '74px', sm: '85px' },
                  height: { xs: '48px', sm: '55px' },
                }}
              />
            ))}
          </Stack>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={'10px'}
          justifyContent={'space-between'}
          sx={{
            paddingBottom: '64px',
          }}
        >
          <Skeleton
            variant="rounded"
            sx={{ width: { xs: '100%', xl: '250px' }, height: '61px' }}
          />
          <Skeleton
            variant="rounded"
            sx={{ width: { xs: '100%', xl: '250px' }, height: '61px' }}
          />
        </Stack>
        <Stack direction={'column'} spacing={'15px'}>
          <Stack direction={'column'}>
            <Skeleton variant="text" sx={{ width: '15%', fontSize: '20px' }} />
            <Skeleton
              variant="text"
              sx={{ width: '40%', fontSize: '16px', height: '40px' }}
            />
          </Stack>
          <Stack direction={'row'}>
            <Skeleton
              variant="rounded"
              sx={{ marginRight: '10px', fontSize: '16px', width: '15%' }}
            />
            <Skeleton
              variant="rounded"
              sx={{ fontSize: '16px', width: '15%' }}
            />
          </Stack>
        </Stack>
      </Stack>
    </StyledContainer>
  );
};
