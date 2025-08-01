'use client';

import { getProductOptions } from '@/api/products/getProductOptions';
import { Box, NoSsr, Stack, styled, Typography } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { Button } from '../ui';
import { SizeSelector } from '../SizeSelector';
import { ProductSlider } from '../ProductSlider';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

const ProductWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(6),
  padding: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(6),
    alignItems: 'stretch',
  },
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    gap: '100px',
    padding: '100px 15%',
    alignItems: 'flex-start',
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
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
  const { data } = useSuspenseQuery(getProductOptions(productId));
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const { value: wishlist = [], setValue } = useLocalStorage<number[]>(
    'wishlist',
    []
  );
  const inWishlist = wishlist.includes(productId);
  const toggleWishlistItem = () => {
    const updatedValue = inWishlist
      ? wishlist.filter((id) => id !== productId)
      : Array.from(new Set([...wishlist, productId]));
    setValue(updatedValue);
  };

  return (
    data && (
      <ProductWrap>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            alignSelf: { xs: 'stretch', md: 'flex-start' },
            maxWidth: 630,
          }}
        >
          <ProductSlider images={data.images} productName={data.name} />
        </Box>
        <Box
          sx={{
            width: { xs: '100%', md: '525px' },
            flexShrink: { xs: 1, md: 0 },
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              paddingBottom: '48px',
            }}
          >
            <Stack direction="column">
              <Typography variant="h2">{data.name}</Typography>
              <Typography variant="h4" color="secondary.dark">
                {data.color.name}
              </Typography>
            </Stack>
            <Typography
              variant="h5"
              sx={{
                marginTop: '20px',
              }}
            >
              ${data.price}
            </Typography>
          </Stack>
          <Stack direction="column" paddingBottom="36px">
            <Typography
              variant="h6"
              paddingBottom="24px"
              color="text.secondary"
            >
              Select Size
            </Typography>

            <SizeSelector
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              availableSizes={data.sizes.map((s) => s.value)}
            />
          </Stack>
          <Stack
            sx={{
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              paddingBottom: '64px',
              gap: '24px',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <NoSsr
              fallback={
                <Button
                  variant="outlined"
                  sx={{ width: { xs: '100%', md: '250px' } }}
                >
                  Add to Wishlist
                </Button>
              }
            >
              <Button
                onClick={toggleWishlistItem}
                variant={inWishlist ? 'contained' : 'outlined'}
                sx={{ width: { xs: '100%', md: '250px' } }}
              >
                {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </NoSsr>
            <Button
              sx={{ width: { xs: '100%', md: '250px' } }}
              disabled={!selectedSize}
            >
              Add to Bag
            </Button>
          </Stack>
          <Stack>
            <Typography
              variant="h6"
              paddingBottom="15px"
              color="text.secondary"
            >
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.description}
            </Typography>
          </Stack>
        </Box>
      </ProductWrap>
    )
  );
};
