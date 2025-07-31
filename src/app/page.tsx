'use client';

import { getProductsOptions } from '@/api/products/getProductsOptions';
import { Header } from '@/components/common/Header';
import { ProductList } from '@/components/ProductList';
import { getQueryClient } from '@/lib/utils';
import Typography from '@mui/material/Typography';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

const queryClient = getQueryClient();
const queryParams = {
  populate: '*' as const,
  filters: {
    teamName: 'team-3',
  },
};
queryClient.prefetchInfiniteQuery(getProductsOptions({}));

export default function Home() {
  const { data } = useSuspenseInfiniteQuery(getProductsOptions(queryParams));

  return (
    <>
      <Header />
      <Typography>Shoes Shop - Team 3</Typography>
      <ProductList products={data.pages.flatMap((page) => page.products)} />
    </>
  );
}
