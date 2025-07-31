'use client';

import { useDebounce, useSearchParams } from '@/lib/hooks';
import {
  Box,
  Divider,
  Drawer,
  DrawerProps,
  FormLabel,
  Slider,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { Accordion, Checkbox, SearchBar } from '@/components/ui';
import { useSuspenseQueries } from '@tanstack/react-query';
import { getGendersOptions } from '@/api/gender/getGendersOptions';
import { getSizesOptions } from '@/api/size/getSizesOptions';
import { getColorsOptions } from '@/api/color/getColorsOptions';
import { getBrandsOptions } from '@/api/brand/getBrandsOptions';
import { FC, useCallback, useMemo, useState } from 'react';
import { parseQueryString, toQueryString } from '@/lib/utils';

type FilterType = number | number[] | string | Record<string, number | object>;

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  color: theme.palette.grey[400],
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px',
  cursor: 'pointer',
}));

const StyledPricesContainer = styled(FormLabel)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mt: 2,
  gap: '6px',
  width: '100%',
}));

const normalizeToArray = (value: unknown): number[] => {
  if (Array.isArray(value)) return Array.from(new Set(value.map(Number)));
  if (value != null && value != undefined) return [Number(value)];

  return [];
};

export const Filters: FC<DrawerProps> = ({ ...props }) => {
  const searchParams = useSearchParams();

  const currentFilters = useMemo(() => {
    const raw = searchParams.get('filters');
    const parsed = raw ? parseQueryString(raw) : {};
    return parsed.filters ?? {};
  }, [searchParams]);

  const updateFilters = useCallback(
    (key: string, value?: FilterType) => {
      const raw = searchParams.get('filters');
      const parsed = raw ? parseQueryString(raw) : {};
      const current = parsed.filters ?? {};

      const updated = {
        ...current,
        [key]: value,
      };

      if (value === undefined) {
        delete updated[key];
      }

      searchParams.set('filters', toQueryString(updated, 'filters'));
    },
    [searchParams]
  );

  const priceInput = useMemo<[number, number]>(
    () => [
      currentFilters?.price?.$gte || 1,
      currentFilters?.price?.$lte || 10000,
    ],
    [currentFilters?.price]
  );

  const toggleSelection = (key: string, checked: boolean, value?: number) => {
    {
      const existing = normalizeToArray(currentFilters[key]?.id?.$in);
      const updated = checked
        ? [...existing, value]
        : existing.filter((id: number) => id !== value);

      if (updated.length > 0) {
        updateFilters(key, { id: { $in: updated } });
        return;
      }
      updateFilters(key, undefined);
    }
  };

  const selectedGenders = normalizeToArray(currentFilters.gender?.id?.$in);
  const selectedBrands = normalizeToArray(currentFilters.brand?.id?.$in);
  const selectedSizes = normalizeToArray(currentFilters.sizes?.id?.$in);
  const selectedColors = normalizeToArray(currentFilters.color?.id?.$in);

  const search = searchParams.get('search');
  const [searchBrands, setSearchBrands] = useState('');

  const debouncedSearchBrands = useDebounce(searchBrands, 500);

  const [
    { data: genders },
    { data: sizes },
    { data: brands },
    { data: colors },
  ] = useSuspenseQueries({
    queries: [
      getGendersOptions(),
      getSizesOptions(),
      getBrandsOptions({
        filters: { name: { $containsi: debouncedSearchBrands.debouncedValue } },
      }),
      getColorsOptions(),
    ],
  });
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      sx={{
        width: props.open ? '320px' : '0px',
        transition: 'width 0.2s ease-in-out',

        '& .MuiDrawer-paper': {
          position: 'relative',
          border: 'none',
          paddingBottom: '200px',
        },
      }}
      {...props}
    >
      <Box sx={{ width: '100%', padding: '40px' }}>
        {search && <Typography variant="caption">Shoes/{search}</Typography>}
        <Typography variant="h4">{search ?? 'Catalog'}</Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap="28px">
        <Divider />
        <Box paddingLeft="40px">
          <Accordion label="Gender" defaultExpanded>
            <Box display="flex" flexDirection="column" gap="20px">
              {genders.map((gender) => (
                <Box
                  sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  key={gender.id}
                >
                  <Checkbox
                    id={`gender-${gender.id}`}
                    onChange={({ target: { checked } }) =>
                      toggleSelection('gender', checked, gender.id)
                    }
                    checked={selectedGenders.includes(gender.id || -1)}
                    value={gender.id}
                  />
                  <StyledFormLabel htmlFor={`gender-${gender.id}`}>
                    {gender.name}
                  </StyledFormLabel>
                </Box>
              ))}
            </Box>
          </Accordion>
        </Box>
        <Divider />
        <Box paddingLeft="40px">
          <Accordion label="Brand" defaultExpanded>
            <Box display="flex" flexDirection="column" gap="20px">
              <SearchBar
                type="search"
                value={searchBrands}
                onChange={(e) => setSearchBrands(e.target.value)}
                placeholder="Search brand"
              />
              {brands.map((brand) => (
                <Box
                  sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  key={brand.id}
                >
                  <Checkbox
                    id={`brand-${brand.id}`}
                    onChange={({ target: { checked } }) =>
                      toggleSelection('brand', checked, brand.id)
                    }
                    value={brand.id}
                    checked={selectedBrands.includes(brand.id || -1)}
                  />
                  <StyledFormLabel htmlFor={`brand-${brand.id}`}>
                    {brand.name}
                  </StyledFormLabel>
                </Box>
              ))}
            </Box>
          </Accordion>
        </Box>
        <Divider />
        <Box paddingLeft="40px">
          <Accordion label="Price" defaultExpanded>
            <Box
              display="flex"
              flexDirection="column"
              paddingRight="20px"
              alignItems="center"
            >
              <Slider
                value={priceInput}
                max={10000}
                min={1}
                valueLabelDisplay="auto"
                onChange={(_, value) => {
                  updateFilters('price', {
                    $gte: (value as [number, number])[0],
                    $lte: (value as [number, number])[1],
                  });
                }}
                sx={{ width: '90%' }}
              />
              <StyledPricesContainer>
                <TextField
                  type="text"
                  sx={{
                    width: 50,

                    '& .MuiOutlinedInput-input': {
                      borderRadius: '6px',
                      fontSize: 12,
                      padding: '4px',
                      textAlign: 'center',
                    },
                  }}
                  slotProps={{
                    input: {
                      inputProps: {
                        'data-testid': 'price-range',
                      },
                    },
                  }}
                  size="small"
                  value={priceInput[0]}
                  onChange={(e) => {
                    const numValue = Number(e.target.value);
                    if (isNaN(numValue)) return;

                    updateFilters('price', {
                      $gte: numValue,
                      $lte: priceInput[1],
                    });
                  }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  to
                </Typography>
                <TextField
                  type="text"
                  value={priceInput[1]}
                  size="small"
                  sx={{
                    width: 50,

                    '& .MuiOutlinedInput-input': {
                      padding: '4px',
                      textAlign: 'center',
                      borderRadius: '6px',
                      fontSize: 12,
                    },
                  }}
                  slotProps={{
                    input: {
                      inputProps: {
                        'data-testid': 'price-range',
                      },
                    },
                  }}
                  onChange={(e) => {
                    const numValue = Number(e.target.value);
                    if (isNaN(numValue)) return;

                    updateFilters('price', {
                      $gte: priceInput[0],
                      $lte: numValue,
                    });
                  }}
                />
              </StyledPricesContainer>
            </Box>
          </Accordion>
        </Box>
        <Divider />
        <Box paddingLeft="40px">
          <Accordion label="Color" defaultExpanded>
            <Box display="flex" flexDirection="column" gap="20px">
              {colors?.map((color) => (
                <Box
                  sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  key={color.id}
                >
                  <Checkbox
                    id={`color-${color.id}`}
                    onChange={({ target: { checked } }) =>
                      toggleSelection('color', checked, color.id)
                    }
                    checked={selectedColors.includes(color.id || -1)}
                    value={color.id}
                  />
                  <StyledFormLabel htmlFor={`color-${color.id}`}>
                    {color.name}
                  </StyledFormLabel>
                </Box>
              ))}
            </Box>
          </Accordion>
        </Box>
        <Divider />
        <Box paddingLeft="40px">
          <Accordion label="Size" defaultExpanded>
            <Box display="flex" flexDirection="column" gap="20px">
              {sizes?.map((size) => (
                <Box
                  sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  key={size.id}
                >
                  <Checkbox
                    id={`size-${size.id}`}
                    onChange={({ target: { checked } }) =>
                      toggleSelection('sizes', checked, size.id)
                    }
                    checked={selectedSizes.includes(size.id || -1)}
                    value={size.id}
                  />
                  <StyledFormLabel htmlFor={`size-${size.id}`}>
                    {size.value}
                  </StyledFormLabel>
                </Box>
              ))}
            </Box>
          </Accordion>
        </Box>
      </Box>
    </Drawer>
  );
};
