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
import { EmptyContent } from '@/components/EmptyContent';

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
    <Box>
      <Typography variant="h2" component={'h1'} paddingBottom={'64px'}>
        My Wishlist
      </Typography>
      <ProductList products={products} variant="wishlist" />
    </Box>
  ) : (
    <EmptyContent
      icon={<StyledFavoriteIcon />}
      message="You don't have any products in your wishlist yet"
      caption="Start adding products to your wishlist"
    >
      <Button size="small" onClick={() => router.push('/')}>
        Go to Catalog
      </Button>
    </EmptyContent>
  );
}
