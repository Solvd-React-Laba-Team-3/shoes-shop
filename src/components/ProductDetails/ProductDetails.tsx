'use client';

import { getProductOptions } from '@/api/products/getProductOptions';
import Box from '@mui/material/Box';
import NoSsr from '@mui/material/NoSsr';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';
import { Button } from '../ui';
import { SizeSelector } from '../SizeSelector';
import { ProductSlider } from '../ProductSlider';
import { notFound } from 'next/navigation';
import { useWishlist, useCart, useRecentlyViewed } from '@/lib/hooks';

const ProductWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '100px',
  flexDirection: 'row',
  padding: '100px 15%',
  alignItems: 'flex-start',
  [theme.breakpoints.down('xl')]: {
    padding: '50px 10%',
    gap: '80px',
  },
  [theme.breakpoints.down('lg')]: {
    padding: '50px 5%',
    flexDirection: 'column',
    gap: theme.spacing(6),
    alignItems: 'stretch',
  },
  [theme.breakpoints.down('md')]: {
    padding: '0 0 36px 0',
  },
}));

interface ProductDetailsProps {
  productId: number;
}

export const ProductDetails: FC<ProductDetailsProps> = ({ productId }) => {
  const { data: product, isError } = useQuery(getProductOptions(productId));
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const {
    items: wishlist,
    addItem: addWishlistItem,
    removeItem: removeWishlistItem,
    isLoading: isWishlistLoading,
  } = useWishlist();

  const {
    addItem: addCartItem,
    items: cart,
    removeItem: removeCartItem,
    isLoading: isCartLoading,
  } = useCart();

  const { addItem: addRecentlyViewed } = useRecentlyViewed();

  const isInCart = cart.some(
    (item) => item.id === productId && item.size === selectedSize
  );

  const isInWishlist = (id: number) => wishlist.includes(id);

  useEffect(() => {
    if (product) addRecentlyViewed(product.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  if (isError || !product) return notFound();

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
        <ProductSlider images={product.images} productName={product.name} />
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
            <Typography variant="h2" component={'h1'} width={'100%'}>
              {product.name}
            </Typography>
            <Typography variant="h5" component={'p'} margin={'0 0 5px 15px'}>
              ${product.price}
            </Typography>
          </Stack>
          <Typography variant="h5" component={'p'} color="secondary.dark">
            {product.color?.name}
          </Typography>
        </Stack>
        <SizeSelector
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
          availableSizes={product.sizes.map((s) => s.value)}
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
              onClick={() =>
                isInWishlist(productId)
                  ? removeWishlistItem(productId)
                  : addWishlistItem(productId)
              }
              variant={isInWishlist(productId) ? 'contained' : 'outlined'}
              loading={isWishlistLoading}
              sx={{ width: { xs: '100%', xl: '251px' } }}
            >
              {isInWishlist(productId) ? 'Remove Wishlist' : 'Add to Wishlist'}
            </Button>
          </NoSsr>
          <Button
            sx={{ width: { xs: '100%', xl: '250px' } }}
            disabled={!selectedSize}
            loading={isCartLoading}
            onClick={() =>
              isInCart
                ? removeCartItem(productId, selectedSize!)
                : addCartItem(product, selectedSize!)
            }
          >
            {isInCart && selectedSize ? 'Remove from Bag' : 'Add to Bag'}
          </Button>
        </Stack>
        <Stack direction={'column'} spacing={'10px'} marginBottom={'15px'}>
          <Typography variant="h6" component={'h3'} color="text.secondary">
            Description
          </Typography>
          <Typography variant="body2" component={'p'} color="text.secondary">
            {product.description}
          </Typography>
        </Stack>
        <Stack direction={'row'} spacing={'8px'} alignItems={'center'}>
          <Typography
            variant="subtitle1"
            component={'p'}
            color="text.secondary"
          >
            Owner:
          </Typography>
          <Typography
            variant="body2"
            component={'p'}
            color="text.secondary"
            textTransform={'capitalize'}
          >
            {product.teamName}
          </Typography>
        </Stack>
      </Box>
    </ProductWrap>
  );
};
