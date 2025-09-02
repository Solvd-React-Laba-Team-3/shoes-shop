'use client';

import {
  useDebounce,
  useFilters,
  useHideOnScroll,
  useSearchParams,
} from '@/lib/hooks';
import {
  Box,
  Divider,
  DrawerProps,
  useMediaQuery,
  Slider,
  Typography,
  useTheme,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Accordion, Button, Checkbox, SearchBar } from '@/components/ui';
import { useSuspenseQueries } from '@tanstack/react-query';
import { getGendersOptions } from '@/api/gender/getGendersOptions';
import { getSizesOptions } from '@/api/size/getSizesOptions';
import { getColorsOptions } from '@/api/color/getColorsOptions';
import { getBrandsOptions } from '@/api/brand/getBrandsOptions';
import { FC, useEffect, useState } from 'react';
import { normalizeToUniqueArray } from '@/lib/utils';
import {
  StyledDrawer,
  StyledFormLabel,
  StyledPricesContainer,
  StyledCloseWrapper,
  StyledHeaderBox,
  StyledBox,
  StyledTextField,
} from './filters.styles';
import { HEADER_HEIGHT } from '@/constants/headerHeight';

export const Filters: FC<DrawerProps> = ({ ...props }) => {
  const { currentFilters, updateFilters, clearFilters, toggleSelection } =
    useFilters();
  const searchParams = useSearchParams();
  const selectedGenders = normalizeToUniqueArray(
    currentFilters.gender?.id?.$in
  );
  const selectedBrands = normalizeToUniqueArray(currentFilters.brand?.id?.$in);
  const selectedSizes = normalizeToUniqueArray(currentFilters.sizes?.id?.$in);
  const selectedColors = normalizeToUniqueArray(currentFilters.color?.id?.$in);

  const search = searchParams.get('search');
  const [searchBrands, setSearchBrands] = useState('');

  const debouncedBrandsSearch = useDebounce(searchBrands, 500);

  const [priceInput, setPriceInput] = useState<number[]>();

  const debouncedPrice = useDebounce(priceInput, 300);

  useEffect(() => {
    if (debouncedPrice.debouncedValue === undefined) return;
    updateFilters('price', {
      $gte: debouncedPrice.debouncedValue[0] ?? 0,
      $lte: debouncedPrice.debouncedValue[1] ?? 10000,
    });
  }, [debouncedPrice, updateFilters]);

  const [
    { data: genders },
    { data: sizes },
    { data: brands },
    { data: colors },
  ] = useSuspenseQueries({
    queries: [
      getGendersOptions(),
      getSizesOptions(),
      getBrandsOptions(
        debouncedBrandsSearch.debouncedValue
          ? {
              filters: {
                name: { $containsi: debouncedBrandsSearch.debouncedValue },
              },
            }
          : undefined
      ),
      getColorsOptions(),
    ],
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const hidden = useHideOnScroll();

  return (
    <StyledDrawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor={isMobile ? 'right' : 'left'}
      sx={{ top: hidden ? 0 : `${HEADER_HEIGHT}px` }}
      {...props}
    >
      {isMobile ? (
        <>
          <StyledCloseWrapper>
            <IconButton
              onClick={(e) => props.onClose?.(e, 'backdropClick')}
              sx={{
                cursor: 'pointer',
                zIndex: 1000,
                color: 'var(--mui-palette-text-secondary)',
              }}
            >
              <CloseIcon />
            </IconButton>
          </StyledCloseWrapper>
          <StyledHeaderBox>
            <Typography component={'h3'}>Filters</Typography>
            <Button
              variant="text"
              onClick={clearFilters}
              sx={{
                width: '18px',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              Clear
            </Button>
          </StyledHeaderBox>
        </>
      ) : (
        <Box sx={{ width: '100%', padding: '24px 48px' }}>
          {search && (
            <Typography variant="caption" component={'span'}>
              Shoes/{search}
            </Typography>
          )}
          <Typography variant="h4" component={'span'}>
            {search ?? 'Catalog'}
          </Typography>
        </Box>
      )}
      <StyledBox>
        <Divider sx={{ display: { xs: 'none', md: 'block' } }} />
        <Box sx={{ paddingLeft: '40px' }}>
          <Accordion label="Gender" defaultExpanded>
            <Box
              display="flex"
              flexDirection="column"
              sx={{ gap: { xs: '12px', md: '20px' } }}
            >
              {genders.map((gender) => (
                <Box
                  key={gender.id}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Checkbox
                    id={`gender-${gender.id}`}
                    onChange={({ target: { checked } }) =>
                      toggleSelection('gender', checked, gender.id)
                    }
                    checked={selectedGenders.includes(gender.id)}
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
        <Box sx={{ paddingLeft: '40px' }}>
          <Accordion label="Brand" defaultExpanded>
            <Box
              display="flex"
              flexDirection="column"
              sx={{ width: '92%', gap: { xs: '12px', md: '28px' } }}
            >
              <SearchBar
                type="search"
                value={searchBrands}
                onChange={(e) => setSearchBrands(e.target.value)}
                placeholder="Search brand"
              />
              {brands.map((brand) => (
                <Box
                  key={brand.id}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Checkbox
                    id={`brand-${brand.id}`}
                    onChange={({ target: { checked } }) =>
                      toggleSelection('brand', checked, brand.id)
                    }
                    value={brand.id}
                    checked={selectedBrands.includes(brand.id)}
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
        <Box sx={{ paddingLeft: '40px' }}>
          <Accordion label="Price" defaultExpanded>
            <Box
              display="flex"
              flexDirection="column"
              paddingRight="20px"
              alignItems="center"
            >
              <Slider
                value={priceInput ?? [1, 10000]}
                max={10000}
                min={1}
                valueLabelDisplay="auto"
                onChange={(_, value) => {
                  setPriceInput(value as number[]);
                }}
                sx={{ width: '90%' }}
              />
              <StyledPricesContainer>
                <StyledTextField
                  type="text"
                  size="small"
                  value={priceInput ? priceInput[0] : 1}
                  onChange={(e) =>
                    setPriceInput((prev) => [
                      Number(e.target.value),
                      prev ? prev[1] : 10000,
                    ])
                  }
                />
                <Typography
                  variant="body2"
                  component={'span'}
                  sx={{ color: 'text.secondary' }}
                >
                  to
                </Typography>
                <StyledTextField
                  type="text"
                  value={priceInput ? priceInput[1] : 10000}
                  size="small"
                  slotProps={{
                    input: {
                      inputProps: {
                        'data-testid': 'price-range',
                      },
                    },
                  }}
                  onChange={(e) =>
                    setPriceInput((prev) => [
                      prev ? prev[0] : 0,
                      Number(e.target.value),
                    ])
                  }
                />
              </StyledPricesContainer>
            </Box>
          </Accordion>
        </Box>
        <Divider />
        <Box sx={{ paddingLeft: '40px' }}>
          <Accordion label="Color" defaultExpanded>
            <Box
              display="flex"
              flexDirection="column"
              sx={{ gap: { xs: '12px', md: '20px' } }}
            >
              {colors?.map((color) => (
                <Box
                  key={color.id}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Checkbox
                    id={`color-${color.id}`}
                    onChange={({ target: { checked } }) =>
                      toggleSelection('color', checked, color.id)
                    }
                    checked={selectedColors.includes(color.id)}
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
        <Box sx={{ paddingLeft: '40px' }}>
          <Accordion label="Size" defaultExpanded>
            <Box
              display="flex"
              flexDirection="column"
              sx={{ gap: { xs: '12px', md: '20px' } }}
            >
              {sizes?.map((size) => (
                <Box
                  key={size.id}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Checkbox
                    id={`size-${size.id}`}
                    onChange={({ target: { checked } }) =>
                      toggleSelection('sizes', checked, size.id)
                    }
                    checked={selectedSizes.includes(size.id)}
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
      </StyledBox>
    </StyledDrawer>
  );
};
