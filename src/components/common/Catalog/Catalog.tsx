'use client';

import { ProductsContainer } from '@/components/ProductsContainer/';
import Box from '@mui/material/Box';
import { Filters } from '@/components/common/Filters';
import { Suspense } from 'react';
import { ProductListFallback } from '@/components/common/ProductListFallback';
import { FiltersFallback } from '@/components/common/FiltersFallback';
import { useState, useEffect } from 'react';

export const Catalog = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // TODO: Mb remove this in future. Prevents hydration error caused by Filters Drawer component
  useEffect(() => {
    setIsFiltersOpen(true);
  }, []);

  const handleFiltersToggle = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Suspense fallback={<FiltersFallback />}>
        <Filters open={isFiltersOpen} />
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
