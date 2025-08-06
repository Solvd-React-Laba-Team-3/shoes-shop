'use client';

import { ProductsContainer } from '@/components/ProductsContainer/';
import Box from '@mui/material/Box';
import { Filters } from '@/components/common/Filters';
import { Suspense } from 'react';
import { ProductListFallback } from '@/components/common/ProductListFallback';
import { FiltersFallback } from '@/components/common/FiltersFallback';
import { useState } from 'react';

export const Catalog = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const handleFiltersToggle = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {isFiltersOpen && (
        <Suspense fallback={<FiltersFallback />}>
          <Filters open={isFiltersOpen} />
        </Suspense>
      )}

      <Box sx={{ padding: '40px 60px' }}>
        <Suspense fallback={<ProductListFallback />}>
          <ProductsContainer
            isFiltersOpen={isFiltersOpen}
            onFiltersToggle={handleFiltersToggle}
          />
        </Suspense>
      </Box>
    </Box>
  );
};
