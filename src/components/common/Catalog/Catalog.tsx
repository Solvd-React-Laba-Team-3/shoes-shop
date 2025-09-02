'use client';

import { ProductsContainer } from '@/components/ProductsContainer/';
import Box from '@mui/material/Box';
import { Filters } from '@/components/common/Filters';
import { Suspense } from 'react';
import { ProductListFallback } from '@/components/common/ProductListFallback';
import { FiltersFallback } from '@/components/common/FiltersFallback';
import { useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
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
