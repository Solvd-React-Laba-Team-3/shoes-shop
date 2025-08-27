'use client';

import { ProductsContainer } from '@/components/ProductsContainer/';
import Box from '@mui/material/Box';
import { Filters } from '@/components/common/Filters';
import { Suspense } from 'react';
import { ProductListFallback } from '@/components/common/ProductListFallback';
import { FiltersFallback } from '@/components/common/FiltersFallback';
import { useState } from 'react';
import { useSearchParams } from '@/lib/hooks';

export const Catalog = () => {
  const searhParams = useSearchParams();
  const hasFilters = Boolean(searhParams.get('filters'));
  const [isFiltersOpen, setIsFiltersOpen] = useState(hasFilters);

  const handleFiltersToggle = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {isFiltersOpen && (
        <Suspense fallback={<FiltersFallback />}>
          <Filters
            open={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
          />
        </Suspense>
      )}
      <Suspense fallback={<ProductListFallback />}>
        <ProductsContainer
          isFiltersOpen={isFiltersOpen}
          onFiltersToggle={handleFiltersToggle}
        />
      </Suspense>
    </Box>
  );
};
