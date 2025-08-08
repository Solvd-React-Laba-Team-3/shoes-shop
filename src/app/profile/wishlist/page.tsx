'use client';

import { ProductList } from '@/components/ProductList';
import { useWishlist } from '@/lib/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import Typography from '@mui/material/Typography';
import { getProductsOptions } from '@/api/products/getProductsOptions';
import { ProductListFallback } from '@/components/common/ProductListFallback';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { styled } from '@mui/material/styles';

const StyledNoProductsWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '30px',
  height: '100%',
}));

const StyledFavoriteIcon = styled(FavoriteIcon)(({ theme }) => ({
  color: theme.palette.grey[600],
  backgroundColor: theme.palette.grey[200],
  padding: '20px',
  borderRadius: '50%',
  width: '72px',
  height: '72px',
}));

export default function Wishlist() {
  const router = useRouter();
  const { items, isLoading } = useWishlist();
  const { data, isPending } = useInfiniteQuery(
    getProductsOptions({
      filters: {
        id: {
          $in: items,
        },
      },
    })
  );

  const products = data?.pages.flatMap((page) => page.products) || [];

  return isPending || isLoading ? (
    <ProductListFallback />
  ) : items?.length ? (
    <ProductList products={products} variant="wishlist" />
  ) : (
    <StyledNoProductsWrapper>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <StyledFavoriteIcon />
        <Typography variant="h6">
          {"You don't have any products in your wishlist yet"}
        </Typography>
        <Typography variant="caption">
          Start adding products to your wishlist
        </Typography>
      </Box>

      <Button size="small" onClick={() => router.push('/')}>
        Go to Catalog
      </Button>
    </StyledNoProductsWrapper>
  );
}
