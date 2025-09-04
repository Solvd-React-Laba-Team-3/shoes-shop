'use client';

import { ProductList } from '@/components/ProductList';
import { useRecentlyViewed } from '@/lib/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import Typography from '@mui/material/Typography';
import { getProductsOptions } from '@/api/products/getProductsOptions';
import { ProductListFallback } from '@/components/common/ProductListFallback';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { styled } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Product } from '@/types/Product';
import { EmptyContent } from '@/components/EmptyContent';

const StyledVisibilityIcon = styled(VisibilityIcon)(({ theme }) => ({
  color: theme.palette.grey[600],
  backgroundColor: theme.palette.grey[200],
  padding: '20px',
  borderRadius: '50%',
  width: '72px',
  height: '72px',
}));

export default function RecentlyViewed() {
  const router = useRouter();
  const { items, isLoading } = useRecentlyViewed();
  const { data, isPending } = useInfiniteQuery(
    getProductsOptions({
      filters: {
        id: {
          $in: items,
        },
      },
    })
  );

  const products = data?.pages.flatMap((page) => page.products) ?? [];
  const productsMap = new Map(products.map((p) => [p.id, p]));
  const sortedProducts = items
    .map((id) => productsMap.get(id))
    .filter(Boolean) as Product[];

  return isPending || isLoading ? (
    <ProductListFallback />
  ) : items?.length ? (
    <Box>
      <Typography variant="h2" component={'h1'} paddingBottom={'64px'}>
        Recently Viewed
      </Typography>
      <ProductList products={sortedProducts} variant="catalog" />
    </Box>
  ) : (
    <EmptyContent
      icon={<StyledVisibilityIcon />}
      message="You haven't look at any products yet"
      caption="Start searching for shoes in our catalog"
    >
      <Button size="small" onClick={() => router.push('/')}>
        Go to Catalog
      </Button>
    </EmptyContent>
  );
}
