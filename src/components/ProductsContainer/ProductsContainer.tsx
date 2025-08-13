'use client';

import { getProductsOptions } from '@/api/products/getProductsOptions';
import { useDeviceSize, useSearchParams } from '@/lib/hooks';
import { parseQueryString } from '@/lib/utils';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import React, { FC, useMemo } from 'react';
import { ProductList } from '../ProductList';
import { Box, Divider, Typography } from '@mui/material';
import FilterAltOffIcon from '@mui/icons-material/FilterAlt';
import FilterAltIcon from '@mui/icons-material/FilterAltOff';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { styled, useTheme } from '@mui/material/styles';
import LocalMallIcon from '@mui/icons-material/LocalMall';

interface ProductsContainerProps {
  isFiltersOpen: boolean;
  onFiltersToggle: () => void;
}

const StyledLocalMallIcon = styled(LocalMallIcon)(({ theme }) => ({
  color: theme.palette.grey[600],
  backgroundColor: theme.palette.grey[200],
  padding: '20px',
  borderRadius: '50%',
  width: '72px',
  height: '72px',
}));

const StyledNoProductsWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '30px',
  height: 'calc(100vh - 300px)',
}));

export const ProductsContainer: FC<ProductsContainerProps> = ({
  isFiltersOpen,
  onFiltersToggle,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseQueryString(searchParams.get('filters') ?? '');
  const search = searchParams.get('search');

  const queryParams = useMemo(
    () => ({
      filters: {
        ...filters.filters,
        name: {
          $contains: search,
        },
      },
    }),
    [filters, search]
  );

  const { data, isFetching } = useSuspenseInfiniteQuery(
    getProductsOptions(queryParams)
  );

  const products = data.pages.flatMap((page) => page.products);

  const handleClearFilters = () => {
    router.replace('/');
  };

  const { isMobile } = useDeviceSize();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: { xs: '12px  20px', md: '40px 60px' },
        gap: { xs: ' 12px', md: '28px' },
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
        }}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="h4">
            {search ? 'Search Results' : 'Catalog'}
          </Typography>
          {isMobile && search && (
            <Box>
              <Divider sx={{ margin: '8px 0' }} />
              <Typography variant="caption">Shoes/{search}</Typography>
              <Typography variant="h4">{search}</Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="secondary"
            size="small"
            variant="text"
            endIcon={<DeleteOutlineIcon />}
            onClick={handleClearFilters}
            sx={{
              [useTheme().breakpoints.down('md')]: {
                display: 'none',
              },
              color: 'text.secondary',
            }}
          >
            Clear Filters
          </Button>

          <Button
            endIcon={isFiltersOpen ? <FilterAltIcon /> : <FilterAltOffIcon />}
            onClick={onFiltersToggle}
            size="small"
            color="secondary"
            variant="text"
          >
            {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Box>
      </Box>

      {products.length || isFetching ? (
        <ProductList products={data.pages.flatMap((page) => page.products)} />
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
            <StyledLocalMallIcon />
            <Typography variant="h6">
              There are no products match search
            </Typography>
            <Typography variant="caption">
              Try to change search query
            </Typography>
          </Box>
        </StyledNoProductsWrapper>
      )}
    </Box>
  );
};
