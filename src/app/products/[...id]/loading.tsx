import { Box, Skeleton, Stack } from '@mui/material';

export default function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: { xs: '20px', sm: '48px', lg: '80px', xl: '100px' },
        flexDirection: { xs: 'column', lg: 'row' },
        padding: {
          xs: '0 0 36px 0',
          md: '50px 5%',
          lg: '50px 10%',
          xl: '100px 15%',
        },
        alignItems: { lg: 'flex-start' },
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minWidth: 0,
          alignSelf: { xs: 'stretch', md: 'flex-start' },
          width: '100%',
          maxWidth: { xs: '100%', lg: 630 },
          flexDirection: { xs: 'column', md: 'row' },
          gap: '16px',
        }}
      >
        <Stack
          direction={{ xs: 'row', md: 'column' }}
          sx={{
            width: { xs: '100%', md: '76px' },
            gap: { xs: '8px', md: '16px' },
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
      </Box>
      <Box
        sx={{
          width: { xs: '100%', lg: '412px', xl: '525px' },
          flexShrink: { xs: 1, md: 0 },
          paddingInline: { xs: '16px', sm: '24px', md: '0' },
        }}
      >
        <Stack
          direction="column"
          sx={{
            justifyContent: 'space-between',
            paddingBottom: '48px',
            width: '100%',
          }}
        >
          <Stack
            direction="row"
            width={'100%'}
            marginBottom={'5px'}
            alignItems={'end'}
          >
            <Skeleton variant="rounded" sx={{ width: '100%' }} />
            <Skeleton
              variant="rounded"
              sx={{ fontSize: '22px', minWidth: '15%', marginLeft: '20px' }}
            />
          </Stack>
          <Skeleton variant="rounded" sx={{ fontSize: '24px', width: '30%' }} />
        </Stack>

        <Stack direction={'column'} marginBottom={'36px'}>
          <Skeleton
            variant="rounded"
            sx={{ fontSize: '20px', width: '30%', marginBottom: '24px' }}
          />
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              width: '100%',
              gap: { xs: '14px', sm: '24px' },
            }}
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
          </Box>
        </Stack>

        <Stack
          sx={{
            justifyContent: 'space-between',
            paddingBottom: '64px',
            gap: '24px',
            flexDirection: { xs: 'column', sm: 'row' },
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
        <Stack>
          <Skeleton
            variant="rounded"
            sx={{ marginBottom: '15px', fontSize: '20px', width: '30%' }}
          />
          <Skeleton
            variant="text"
            sx={{ marginBottom: '5px', fontSize: '16px', width: '100%' }}
          />
          <Skeleton
            variant="text"
            sx={{ marginBottom: '5px', fontSize: '16px', width: '95%' }}
          />
          <Skeleton
            variant="text"
            sx={{ marginBottom: '5px', fontSize: '16px', width: '80%' }}
          />
          <Skeleton
            variant="text"
            sx={{ marginBottom: '35px', fontSize: '16px', width: '90%' }}
          />
        </Stack>
        <Stack direction={'row'}>
          <Skeleton
            variant="rounded"
            sx={{ marginRight: '10px', fontSize: '16px', width: '15%' }}
          />
          <Skeleton variant="rounded" sx={{ fontSize: '16px', width: '15%' }} />
        </Stack>
      </Box>
    </Box>
  );
}
