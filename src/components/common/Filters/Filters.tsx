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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Accordion, Button, Checkbox, SearchBar } from '@/components/ui';
import { useSuspenseQueries } from '@tanstack/react-query';
import { getGendersOptions } from '@/api/gender/getGendersOptions';
import { getSizesOptions } from '@/api/size/getSizesOptions';
import { getColorsOptions } from '@/api/color/getColorsOptions';
import { getBrandsOptions } from '@/api/brand/getBrandsOptions';
import { FC, useState } from 'react';
import { normalizeToUniqueArray } from '@/lib/utils';
import {
  StyledDrawer,
  StyledFormLabel,
  StyledPricesContainer,
  StyledCloseWrapper,
  StyledHeaderBox,
  StyledHeaderButton,
  StyledSectionBox,
  StyledRowBox,
  StyledTextField,
  StyledBox,
} from './filters.styles';
import { HEADER_HEIGHT } from '@/constants/headerHeight';

export const Filters: FC<DrawerProps> = ({ ...props }) => {
  const {
    currentFilters,
    updateFilters,
    clearFilters,
    toggleSelection,
    priceInput,
  } = useFilters();
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
            <StyledHeaderButton
              onClick={(e) => props.onClose?.(e, 'backdropClick')}
            >
              <CloseIcon />
            </StyledHeaderButton>
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
        <StyledSectionBox>
          <Accordion label="Gender" defaultExpanded>
            <Box
              display="flex"
              flexDirection="column"
              sx={{ gap: { xs: '12px', md: '20px' } }}
            >
              {genders.map((gender) => (
                <StyledRowBox key={gender.id}>
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
                </StyledRowBox>
              ))}
            </Box>
          </Accordion>
        </StyledSectionBox>
        <Divider />
        <StyledSectionBox>
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
                <StyledRowBox key={brand.id}>
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
                </StyledRowBox>
              ))}
            </Box>
          </Accordion>
        </StyledSectionBox>
        <Divider />
        <StyledSectionBox>
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
                <StyledTextField
                  type="text"
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
                <Typography
                  variant="body2"
                  component={'span'}
                  sx={{ color: 'text.secondary' }}
                >
                  to
                </Typography>
                <StyledTextField
                  type="text"
                  size="small"
                  value={priceInput[1]}
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
        </StyledSectionBox>
        <Divider />
        <StyledSectionBox>
          <Accordion label="Color" defaultExpanded>
            <Box
              display="flex"
              flexDirection="column"
              sx={{ gap: { xs: '12px', md: '20px' } }}
            >
              {colors?.map((color) => (
                <StyledRowBox key={color.id}>
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
                </StyledRowBox>
              ))}
            </Box>
          </Accordion>
        </StyledSectionBox>
        <Divider />
        <StyledSectionBox>
          <Accordion label="Size" defaultExpanded>
            <Box
              display="flex"
              flexDirection="column"
              sx={{ gap: { xs: '12px', md: '20px' } }}
            >
              {sizes?.map((size) => (
                <StyledRowBox key={size.id}>
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
                </StyledRowBox>
              ))}
            </Box>
          </Accordion>
        </StyledSectionBox>
      </StyledBox>
    </StyledDrawer>
  );
};
