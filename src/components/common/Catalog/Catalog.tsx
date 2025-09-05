'use client';

import { ProductsContainer } from '@/components/ProductsContainer/';
import Box from '@mui/material/Box';
import { Filters } from '../Filters';
import { Suspense } from 'react';
import { ProductListFallback } from '../ProductListFallback';
import { FiltersFallback } from '../FiltersFallback';
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useSearchParams } from '@/lib/hooks';

export const Catalog = () => {
  const searchParams = useSearchParams();
  const hasFilters = Boolean(searchParams.get('filters'));

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [isFiltersOpen, setIsFiltersOpen] = useState(hasFilters);

  const handleFiltersToggle = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Suspense fallback={!isMobile && isFiltersOpen && <FiltersFallback />}>
        <Filters open={isFiltersOpen} onClose={() => setIsFiltersOpen(false)} />
      </Suspense>
      <Suspense fallback={<ProductListFallback />}>
        <ProductsContainer
          isFiltersOpen={isFiltersOpen}
          onFiltersToggle={handleFiltersToggle}
        />
      </Suspense>
    </Box>
  );
};
