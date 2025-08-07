'use client';

import { getProductOptions } from '@/api/products/getProductOptions';
import { Box, NoSsr, Stack, styled, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { Button } from '../ui';
import { SizeSelector } from '../SizeSelector';
import { ProductSlider } from '../ProductSlider';
import { notFound } from 'next/navigation';
import { useWishlist } from '@/lib/hooks/useWishlist';

const ProductWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(6),
  [theme.breakpoints.up('xs')]: {
    flexDirection: 'column',
    padding: '0 0 36px 0',
  },
  [theme.breakpoints.up('md')]: {
    padding: '50px 5%',
  },
  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
    gap: '80px',
    padding: '50px 10%',
    alignItems: 'flex-start',
  },
  [theme.breakpoints.up('xl')]: {
    padding: '100px 15%',
    gap: '100px',
  },
}));

interface ProductDetailsProps {
  productId: number;
}

export const ProductDetails: FC<ProductDetailsProps> = ({
  productId,
}: {
  productId: number;
}) => {
  const { data, isError } = useQuery(getProductOptions(productId));
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const { inWishlist, toggle } = useWishlist();

  if (isError || !data) return notFound();

  return (
    <ProductWrap>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          alignSelf: { xs: 'stretch', md: 'flex-start' },
          maxWidth: { xs: '100%', lg: 630, xl: 800 },
        }}
      >
        <ProductSlider images={data.images} productName={data.name} />
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
          }}
        >
          <Stack direction="row" alignItems={'end'}>
            <Typography variant="h2" width={'100%'}>
              {data.name}
            </Typography>
            <Typography variant="h5" margin={'0 0 5px 15px'}>
              ${data.price}
            </Typography>
          </Stack>
          <Typography variant="h4" color="secondary.dark">
            {data.color?.name}
          </Typography>
        </Stack>
        <SizeSelector
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
          availableSizes={data.sizes.map((s) => s.value)}
        />
        <Stack
          sx={{
            justifyContent: 'space-between',
            paddingBottom: '64px',
            gap: '24px',
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <NoSsr
            fallback={
              <Button
                variant="outlined"
                sx={{ width: { xs: '100%', xl: '250px' } }}
              >
                Add to Wishlist
              </Button>
            }
          >
            <Button
              onClick={() => toggle(productId)}
              variant={inWishlist(productId) ? 'contained' : 'outlined'}
              sx={{ width: { xs: '100%', xl: '251px' } }}
            >
              {inWishlist(productId) ? 'Remove Wishlist' : 'Add to Wishlist'}
            </Button>
          </NoSsr>
          <Button
            sx={{ width: { xs: '100%', xl: '250px' } }}
            disabled={!selectedSize}
          >
            Add to Bag
          </Button>
        </Stack>
        <Stack direction={'column'} spacing={'15px'}>
          <Stack direction={'column'} spacing={'10px'}>
            <Typography variant="h6" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.description}
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={'8px'} alignItems={'center'}>
            <Typography variant="subtitle1" color="text.secondary">
              Owner:
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textTransform={'capitalize'}
            >
              {data.teamName}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </ProductWrap>
  );
};
