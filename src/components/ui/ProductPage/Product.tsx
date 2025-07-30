'use client';
import { LabeledTextfield, Select, ToggleButton } from '@/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, FormControl, ToggleButtonGroup, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  StyledAiButton,
  StyledDescriptionLabel,
  StyledInputLabel,
  StyledTextArea,
  StyledMenuItem,
} from './Product.styles';
import { getBrandsOptions } from '@/api/brand/getBrandsOptions';
import { getColorsOptions } from '@/api/color/getColorsOptions';
import { getGendersOptions } from '@/api/gender/getGendersOptions';
import { getSizesOptions } from '@/api/size/getSizesOptions';
import { useSuspenseQueries } from '@tanstack/react-query';
import { productSchema } from './productForm.schema';
import { FC } from 'react';

export type ProductData = z.infer<typeof productSchema>;

interface ProductProps {
  defaultValues?: Partial<ProductData>;
  onSubmit: (data: ProductData) => void;
}

const handleToggle = (
  selected: { id: number },
  currentValues: { id: number }[],
  onChange: (value: { id: number }[]) => void
) => {
  const exists = currentValues.some((item) => item.id === selected.id);
  const newValues = exists
    ? currentValues.filter((item) => item.id !== selected.id)
    : [...currentValues, selected];

  onChange(newValues);
};

export const Product: FC<ProductProps> = ({
  defaultValues,
  onSubmit,
}: ProductProps) => {
  const { register, control, handleSubmit } = useForm<ProductData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: '',
      price: '',
      color: '',
      gender: '',
      brand: '',
      description: '',
      size: [],
      ...defaultValues,
    },
  });

  const [
    { data: genders },

    { data: sizes },

    { data: brands },

    { data: colors },
  ] = useSuspenseQueries({
    queries: [
      getGendersOptions(),

      getSizesOptions(),

      getBrandsOptions(),

      getColorsOptions(),
    ],
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <LabeledTextfield
          label="Product name"
          placeholder="Nike Air Max 90"
          {...register('productName')}
        />
      </Box>

      <Box sx={{ margin: '8px 0 20px 0' }}>
        <LabeledTextfield
          label="Price"
          placeholder="$160"
          type="number"
          {...register('price')}
        />
      </Box>

      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <FormControl variant="outlined">
            <StyledInputLabel id="color-label" shrink variant="outlined">
              Color
            </StyledInputLabel>
            <Select
              {...field}
              labelId="color-label"
              sx={{ mt: '18px', width: '436px', padding: '8px 0' }}
            >
              {colors.data.map((color) => (
                <StyledMenuItem key={color.id} value={color.attributes.name}>
                  {color.attributes.name}
                </StyledMenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Box display="flex" gap={2} sx={{ margin: '20px 0 14px 0' }}>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <FormControl
              variant="outlined"
              sx={{ maxWidth: '210px', width: '100%' }}
            >
              <StyledInputLabel id="gender-label" shrink>
                Gender
              </StyledInputLabel>
              <Select
                {...field}
                labelId="gender-label"
                label="Gender"
                value={field.value || ''}
                sx={{ mt: '20px' }}
              >
                {genders?.data?.map((gender) => (
                  <StyledMenuItem
                    key={gender.id}
                    value={gender.attributes.name}
                  >
                    {gender.attributes.name}
                  </StyledMenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="brand"
          control={control}
          render={({ field }) => (
            <FormControl
              variant="outlined"
              sx={{ maxWidth: '210px', width: '100%' }}
            >
              <StyledInputLabel id="brand-label" shrink>
                Brand
              </StyledInputLabel>
              <Select
                {...field}
                labelId="brand-label"
                sx={{ mt: '20px' }}
                displayEmpty
              >
                <StyledMenuItem value="">
                  <em>Select brand</em>
                </StyledMenuItem>

                {brands.data.map((brand) => (
                  <StyledMenuItem key={brand.id} value={brand.attributes.name}>
                    {brand.attributes.name}
                  </StyledMenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Box sx={{ width: 436 }}>
            <StyledDescriptionLabel>Description</StyledDescriptionLabel>
            <Box sx={{ position: 'relative' }}>
              <StyledTextArea
                {...field}
                aria-label="Description"
                minRows={3}
                placeholder="Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with"
              />
              <StyledAiButton />
            </Box>
          </Box>
        )}
      />

      <Box sx={{ marginTop: '8px' }}>
        <Controller
          name="size"
          control={control}
          render={({ field }) => {
            return (
              <Box>
                <Typography
                  // component="h6"
                  variant="subtitle2"
                  sx={{
                    mb: 0,
                    fontWeight: 500,
                    marginBottom: '8px',
                  }}
                >
                  Add size
                </Typography>

                <ToggleButtonGroup
                  size="small"
                  sx={{ maxWidth: '436px', flexWrap: 'wrap', gap: '12px' }}
                >
                  {sizes.data.map((size, index, arr) => {
                    const isSelected = (field.value || []).some(
                      (selectedSize) => selectedSize.id === size.id
                    );

                    return (
                      <Box
                        key={size.id}
                        sx={{ mr: index < arr.length - 1 ? 0.39 : 0 }}
                      >
                        <ToggleButton
                          sx={{ height: 48, width: 74, minWidth: 74 }}
                          value={size}
                          selected={isSelected}
                          onClick={() =>
                            handleToggle(
                              size,
                              field.value || [],
                              field.onChange
                            )
                          }
                        >
                          {size.attributes.value}
                        </ToggleButton>
                      </Box>
                    );
                  })}
                </ToggleButtonGroup>
              </Box>
            );
          }}
        />
      </Box>
    </form>
  );
};
