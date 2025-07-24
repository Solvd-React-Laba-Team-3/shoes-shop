'use client';
import { useDebounce, useSearchsParams } from '@/lib/hooks';
import {
  Box,
  Divider,
  FormLabel,
  Slider,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { Accordion, Checkbox } from '@/components/ui';
import { useSuspenseQueries } from '@tanstack/react-query';
import { getGendersOptions } from '@/api/gender/getGendersOptions';
import { getSizesOptions } from '@/api/size/getSizesOptions';
import { getColorsOptions } from '@/api/color/getColorsOptions';
import { getBrandsOptions } from '@/api/brand/getBrandsOptions';
import { useEffect, useState } from 'react';
import { parseQueryString, toQueryString } from '@/lib/utils/';

export const Filters: React.FC = () => {
  const searchParams = useSearchsParams();

  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<number[]>([0, 10000]);
  const debouncedPrices = useDebounce(selectedPrices, 300);
  useEffect(() => {
    const filters = {
      size: selectedSizes.length ? { $in: selectedSizes } : '',
      color: selectedColors.length ? { $in: selectedColors } : '',
      gender: selectedGenders.length ? { $in: selectedGenders } : '',
      brand: selectedBrands.length ? { $in: selectedBrands } : '',
      price: debouncedPrices.length
        ? { $gte: debouncedPrices[0], $lte: debouncedPrices[1] }
        : '',
    };
    searchParams.delete('filters');
    searchParams.set('filters', toQueryString(filters, 'filters'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedSizes,
    selectedColors,
    selectedGenders,
    selectedBrands,
    debouncedPrices,
  ]);

  console.log(
    'Search Params:',
    parseQueryString(
      decodeURIComponent(searchParams.searchParams.get('filters') || '')
    )
  );

  const toggleSelection = (
    setData: React.Dispatch<React.SetStateAction<number[]>>,
    checked: boolean,
    value?: number
  ) => {
    if (value === undefined) return;
    setData((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

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

  const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
    color: theme.palette.grey[400],
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    cursor: 'pointer',
  }));

  return (
    <>
      <Box sx={{ width: '100%', padding: '40px 0' }}>
        <Typography variant="caption">Shoes/{search}</Typography>
        <Typography variant="h4">{search}</Typography>
      </Box>
      <Divider />
      <Box display="flex" flexDirection="column" gap="28px">
        <Accordion label="Gender">
          <Box display="flex" flexDirection="column" gap="20px">
            {genders.map((gender) => (
              <Box
                sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                key={gender.id}
              >
                <Checkbox
                  id={`gender-${gender.id}`}
                  onChange={({ target: { checked } }) =>
                    toggleSelection(setSelectedGenders, checked, gender.id)
                  }
                  value={gender.id}
                />{' '}
                <StyledFormLabel htmlFor={`gender-${gender.id}`}>
                  {gender.name}
                </StyledFormLabel>
              </Box>
            ))}
          </Box>
        </Accordion>
        <Divider />
        <Accordion label="Brand">
          <Box display="flex" flexDirection="column" gap="20px">
            <input
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
                    toggleSelection(setSelectedBrands, checked, brand.id)
                  }
                  value={brand.id}
                />{' '}
                <StyledFormLabel htmlFor={`brand-${brand.id}`}>
                  {brand.name}
                </StyledFormLabel>
              </Box>
            ))}
          </Box>
        </Accordion>
        <Divider />
        <Accordion label="Price">
          <Box
            display="flex"
            flexDirection="column"
            paddingRight="20px"
            alignItems="center"
          >
            <Slider
              value={selectedPrices}
              scale={(value) => value * 100}
              valueLabelDisplay="auto"
              onChange={(_, value) => setSelectedPrices(value)}
              sx={{ width: '90%' }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2,
                gap: '6px',
                width: '100%',
              }}
            >
              <TextField
                sx={{ width: 50 }}
                type="text"
                slotProps={{
                  input: {
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
                value={selectedPrices[0]}
                onChange={(e) =>
                  setSelectedPrices([Number(e.target.value), selectedPrices[1]])
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
                value={selectedPrices[1]}
                size="small"
                slotProps={{
                  input: {
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
                  setSelectedPrices([selectedPrices[0], Number(e.target.value)])
                }
              />
            </Box>
          </Box>
        </Accordion>
        <Divider />
        <Accordion label="Color">
          <Box display="flex" flexDirection="column" gap="20px">
            {colors.map((color) => (
              <Box
                sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                key={color.id}
              >
                <Checkbox
                  id={`color-${color.id}`}
                  onChange={({ target: { checked } }) =>
                    toggleSelection(setSelectedColors, checked, color.id)
                  }
                  value={color.id}
                />{' '}
                <StyledFormLabel htmlFor={`color-${color.id}`}>
                  {color.name}
                </StyledFormLabel>
              </Box>
            ))}
          </Box>
        </Accordion>
        <Divider />
        <Accordion label="Size">
          <Box display="flex" flexDirection="column" gap="20px">
            {sizes.map((size) => (
              <Box
                sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                key={size.id}
              >
                <Checkbox
                  id={`size-${size.id}`}
                  onChange={({ target: { checked } }) =>
                    toggleSelection(setSelectedSizes, checked, size.id)
                  }
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
    </>
  );
};
