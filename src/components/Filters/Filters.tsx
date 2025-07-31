'use client';
import { useDebounce, useSearchParams } from '@/lib/hooks';
import {
  Box,
  Divider,
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseQueryString, toQueryString } from '@/lib/utils/';

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

export const Filters = () => {
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

  const [priceInput, setPriceInput] = useState<[number, number]>([
    currentFilters.price?.$gte || 1,
    currentFilters.price?.$lte || 10000,
  ]);

  const debouncedPrice = useDebounce(priceInput, 300);

  useEffect(() => {
    updateFilters('price', {
      $gte: debouncedPrice[0] as number,
      $lte: debouncedPrice[1] as number,
    });
  }, [debouncedPrice, updateFilters]);

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
        filters: { name: { $containsi: debouncedSearchBrands } },
      }),
      getColorsOptions(),
    ],
  });
  return (
    <Box
      sx={{ overflowX: 'hidden', paddingBottom: '200px', minWidth: '320px' }}
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
                  />{' '}
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
                  />{' '}
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
                onChange={(_, value) =>
                  setPriceInput(value as [number, number])
                }
                sx={{ width: '90%' }}
              />
              <StyledPricesContainer>
                <TextField
                  sx={{ width: 50 }}
                  type="text"
                  slotProps={{
                    input: {
                      inputProps: {
                        'data-testid': 'price-range',
                      },
                      sx: {
                        borderRadius: '6px',
                        fontSize: 12,
                        '& .css-py5hz4-MuiInputBase-input-MuiOutlinedInput-input':
                          {
                            padding: '4px',
                            textAlign: 'center',
                          },
                      },
                    },
                  }}
                  size="small"
                  value={priceInput[0]}
                  onChange={(e) =>
                    setPriceInput((prev) => [Number(e.target.value), prev[1]])
                  }
                />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  to
                </Typography>
                <TextField
                  sx={{
                    width: 50,
                  }}
                  type="text"
                  value={priceInput[1]}
                  size="small"
                  slotProps={{
                    input: {
                      inputProps: {
                        'data-testid': 'price-range',
                      },
                      sx: {
                        borderRadius: '6px',
                        fontSize: 12,
                        '& .css-py5hz4-MuiInputBase-input-MuiOutlinedInput-input':
                          {
                            padding: '4px',
                            textAlign: 'center',
                          },
                      },
                    },
                  }}
                  onChange={(e) =>
                    setPriceInput((prev) => [prev[0], Number(e.target.value)])
                  }
                />
              </StyledPricesContainer>
            </Box>
          </Accordion>
        </Box>
        <Divider />
        <Box paddingLeft="40px">
          <Accordion label="Color" defaultExpanded>
            <Box display="flex" flexDirection="column" gap="20px">
              {colors.map((color) => (
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
                  />{' '}
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
              {sizes.map((size) => (
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
                  />{' '}
                  <StyledFormLabel htmlFor={`size-${size.id}`}>
                    {size.value}
                  </StyledFormLabel>
                </Box>
              ))}
            </Box>
          </Accordion>
        </Box>
      </Box>
    </Box>
  );
};
