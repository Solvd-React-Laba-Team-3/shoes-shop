'use client';

import { getProductsOptions } from '@/api/products/getProductsOptions';
import { useSearchParams, useIntersectionObserver } from '@/lib/hooks';
import { parseQueryString } from '@/lib/utils';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import React, { FC, useMemo } from 'react';
import { ProductList } from '../ProductList';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import FilterAltOffIcon from '@mui/icons-material/FilterAlt';
import FilterAltIcon from '@mui/icons-material/FilterAltOff';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button } from '../ui';
import { useRouter } from 'next/navigation';
import { styled, useTheme } from '@mui/material/styles';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { EmptyContent } from '../EmptyContent';

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

export const ProductsContainer: FC<ProductsContainerProps> = ({
  isFiltersOpen,
  onFiltersToggle,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseQueryString(searchParams.get('filters') ?? '');
  const search = searchParams.get('search');

  const queryParams = useMemo(() => {
    if (!filters.filters && !search) return;

    return {
      filters: {
        ...filters.filters,
        name: {
          $contains: search,
        },
      },
    };
  }, [filters, search]);

  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(getProductsOptions(queryParams));

  const { ref } = useIntersectionObserver({
    threshold: 0,
    rootMargin: '600px',
    onChange: (isIntersecting) => {
      if (isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const products = data.pages.flatMap((page) => page.products);

  const handleClearFilters = () => {
    router.replace('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: {
          xs: '12px  16px 80px',
          sm: '12px 24px 80px',
          md: '40px 60px',
        },
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
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          height={'100%'}
          justifyContent={'center'}
        >
          <Typography variant="h4" component={'h1'} lineHeight={'40px'}>
            {search ? 'Search Results' : 'Catalog'}
          </Typography>
          {isMobile && search && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="caption" component={'span'}>
                Shoes/{search}
              </Typography>
              <Typography variant="h4" component={'p'} lineHeight={'40px'}>
                {search}
              </Typography>
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
              minWidth: '140px',
              display: { xs: 'none', md: 'flex' },
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
            sx={{
              minWidth: '140px',
            }}
          >
            {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Box>
      </Box>

      {products.length || isFetching ? (
        <>
          <ProductList products={data.pages.flatMap((page) => page.products)} />
          <Box ref={ref} />
        </>
      ) : (
        <EmptyContent
          icon={<StyledLocalMallIcon />}
          message="There are no products match search"
          caption="Try to change search query"
        />
      )}
    </Box>
  );
};
