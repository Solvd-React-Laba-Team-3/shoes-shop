'use client';
import { getProductsOptions } from '@/api/products/getProductsOptions';
import { useSearchsParams } from '@/lib/hooks';
import { parseQueryString } from '@/lib/utils';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import { ProductList } from '../ProductList';
import { Box, Typography } from '@mui/material';

export const ProductsContainer: React.FC = () => {
  const { searchParams } = useSearchsParams();

  const filters = parseQueryString(searchParams.get('filters') ?? '');
  const search = searchParams.get('search');

  const queryParams = {
    populate: '*' as const,

    filters: {
      ...filters.filters,
      name: {
        $contains: search,
      },
    },
  };

  const { data } = useSuspenseInfiniteQuery(getProductsOptions(queryParams));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '40px 60px',
        gap: '28px',
      }}
    >
      <Typography variant="h4">
        {search ? 'Search Results' : 'Catalog'}
      </Typography>
      <ProductList products={data.pages.flatMap((page) => page.products)} />
    </Box>
  );
};
