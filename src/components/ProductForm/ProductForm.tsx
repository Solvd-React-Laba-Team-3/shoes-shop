'use client';

import { getBrandsOptions } from '@/api/brand/getBrandsOptions';
import { getColorsOptions } from '@/api/color/getColorsOptions';
import { getGendersOptions } from '@/api/gender/getGendersOptions';
import { getSizesOptions } from '@/api/size/getSizesOptions';
import {
  LabeledTextfield,
  Select,
  ToggleButton,
  MenuItem,
  Button,
  FormErrorMessage,
} from '@/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useSuspenseQueries } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import {
  StyledInputLabel,
  StyledTextArea,
  StyledToggleButton,
  StyledAutocompleteButton,
} from './productForm.styles';
import { productSchema } from './productForm.schema';
import { ProductFormData } from './productForm.schema';
import { FC, useState } from 'react';
import { Size } from '@/types/Size';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ProductFormDropzone } from '../ProductFormDropzone';
import { TempImage } from '@/types/TempImage';
import Image from 'next/image';
import suggestionCollapsedIcon from '../../../public/suggestion-collapsed-icon.png';
import suggestionIcon from '../../../public/suggestion-icon.png';
import { getDescriptionSuggestionOptions } from '@/api/gemini/getDescriptionSuggestionOptions';

interface ProductFormProps {
  editingProduct?: Partial<ProductFormData>;
  isPending: boolean;
  title: string;
  description: string;
  onSubmit: (data: ProductFormData) => void;
  images: TempImage[];
  handleFilesDropped: (files: File[]) => void;
  onRemoveImage: (id: number, index: number) => void;
}

const handleToggleSize = (
  selected: Size,
  currentValues: number[],
  onChange: (value: number[]) => void
) => {
  const isExist = currentValues.some((item) => item === selected.id);

  const newValues = isExist
    ? currentValues.filter((item) => item !== selected.id)
    : [...currentValues, selected.id];

  onChange(newValues);
};

export const ProductForm: FC<ProductFormProps> = ({
  editingProduct,
  onSubmit,
  title,
  description,
  images,
  isPending,
  handleFilesDropped,
  onRemoveImage,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      color: '',
      gender: '',
      brand: '',
      description: '',
      sizes: [],
      ...editingProduct,
    },
    shouldFocusError: true,
  });

  const [isCollapsed, setIsCollapsed] = useState(true);

  const { refetch: fetchDescriptionSuggestion, isFetching } = useQuery(
    getDescriptionSuggestionOptions(
      watch('name'),
      watch('description'),
      watch('gender'),
      watch('brand')
    )
  );

  const handleDescriptionSuggestion = async () => {
    try {
      const { data: descriptionSuggestion } =
        await fetchDescriptionSuggestion();
      if (descriptionSuggestion) setValue('description', descriptionSuggestion);
    } finally {
      setIsCollapsed(true);
    }
  };

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
  };

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
    <>
      {(isPending || isSubmitting) && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '5px',
          }}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '12px', md: '40px' },
          width: 'unset',
        }}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: { xs: 2, md: 0 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: '12px', md: '35px' },
            }}
          >
            <Typography variant="h2" component={'h3'}>
              {title}
            </Typography>
            <Typography
              variant="caption"
              component={'p'}
              sx={{ maxWidth: { xs: '100%', md: '890px' } }}
            >
              {description}
            </Typography>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              gap: '8px',
              alignItems: { xs: 'flex-start', md: 'flex-end' },
            }}
          >
            <Button
              type="submit"
              size="small"
              loading={isSubmitting || isPending}
            >
              Save
            </Button>
            <FormErrorMessage message={errors.root?.message} />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: { xs: '16px', xl: '100px', xxl: '200px' },
            flexDirection: { xs: 'column', xl: 'row' },
            maxWidth: '1200px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
            }}
          >
            <LabeledTextfield
              label="Product name"
              placeholder="Nike Air Max 90"
              {...register('name')}
              errorMessage={errors.name?.message}
            />
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <LabeledTextfield
                  label="Price"
                  type="number"
                  placeholder="160"
                  startAdornment={'$'}
                  errorMessage={errors.price?.message}
                  {...field}
                  onChange={(e) => {
                    const numValue = Number(e.target.value);
                    if (isNaN(numValue)) return;
                    field.onChange(numValue);
                  }}
                />
              )}
            />
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: '1',
                    gap: '2px',
                  }}
                >
                  <StyledInputLabel shrink error={!!errors.color}>
                    Color
                  </StyledInputLabel>
                  <Select
                    {...field}
                    sx={{ padding: '8px' }}
                    displayEmpty
                    error={!!errors.color}
                    renderValue={(value) => {
                      if (!value)
                        return (
                          <Typography variant="body2" component={'p'}>
                            Select color
                          </Typography>
                        );
                      const selectedColor = colors?.find(
                        (c) => c.id === Number(value)
                      );
                      return selectedColor?.name;
                    }}
                  >
                    {colors.map((color) => (
                      <MenuItem key={color.id} value={color.id.toString()}>
                        <Typography variant="caption" component={'span'}>
                          {color.name}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                  <FormErrorMessage message={errors.color?.message} />
                </Box>
              )}
            />
            <Box sx={{ display: 'flex', gap: '20px' }}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Box
                    sx={{
                      width: { md: '210px' },
                      flexGrow: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <StyledInputLabel shrink error={!!errors.gender}>
                      Gender
                    </StyledInputLabel>
                    <Select
                      {...field}
                      sx={{ padding: '8px' }}
                      error={!!errors.gender}
                      displayEmpty
                      renderValue={(value) => {
                        if (!value)
                          return (
                            <Typography variant="caption" component={'p'}>
                              Select gender
                            </Typography>
                          );
                        const selectedGender = genders?.find(
                          (g) => g.id === Number(value)
                        );
                        return selectedGender?.name;
                      }}
                    >
                      {genders?.map((gender) => (
                        <MenuItem key={gender.id} value={gender.id.toString()}>
                          <Typography variant="caption" component={'span'}>
                            {gender.name}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                    <FormErrorMessage message={errors.gender?.message} />
                  </Box>
                )}
              />
              <Controller
                name="brand"
                control={control}
                render={({ field }) => (
                  <Box
                    sx={{
                      width: { md: '210px' },
                      flexGrow: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <StyledInputLabel shrink error={!!errors.brand}>
                      Brand
                    </StyledInputLabel>
                    <Select
                      {...field}
                      sx={{ padding: '8px' }}
                      displayEmpty
                      error={!!errors.brand}
                      renderValue={(value) => {
                        if (!value)
                          return (
                            <Typography variant="caption" component={'span'}>
                              Select brand
                            </Typography>
                          );

                        const selectedBrand = brands?.find(
                          (b) => b.id === Number(value)
                        );

                        return selectedBrand?.name;
                      }}
                    >
                      {brands.map((brand) => (
                        <MenuItem key={brand.id} value={brand.id.toString()}>
                          <Typography variant="caption" component={'span'}>
                            {brand.name}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                    <FormErrorMessage message={errors.brand?.message} />
                  </Box>
                )}
              />
            </Box>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Box>
                  <StyledInputLabel error={!!errors.description} shrink>
                    Description
                  </StyledInputLabel>
                  <Box sx={{ position: 'relative' }}>
                    <StyledTextArea
                      {...field}
                      aria-label="Description"
                      minRows={3}
                      placeholder="Enter description..."
                      sx={{
                        border: (theme) =>
                          errors.description
                            ? `1px solid ${theme.palette.error.main}`
                            : `1px solid ${theme.palette.divider}`,
                      }}
                    />
                    {isCollapsed && (
                      <StyledToggleButton
                        value={isCollapsed}
                        onClick={() => setIsCollapsed(false)}
                        data-testid="AI-suggestion-button"
                      >
                        <Image
                          src={suggestionCollapsedIcon}
                          alt="Suggestion collapsed"
                          width={26}
                          height={20}
                        />
                      </StyledToggleButton>
                    )}

                    <StyledAutocompleteButton
                      size="small"
                      isCollapsed={isCollapsed}
                      onClick={handleDescriptionSuggestion}
                      loading={isFetching}
                    >
                      Use AI suggestion
                      <Image
                        src={suggestionIcon}
                        alt="Suggestion icon"
                        width={20}
                        height={14}
                      />
                    </StyledAutocompleteButton>
                  </Box>
                  <FormErrorMessage message={errors.description?.message} />
                </Box>
              )}
            />
            <Controller
              name="sizes"
              control={control}
              render={({ field }) => {
                return (
                  <Box>
                    <StyledInputLabel error={!!errors.sizes} shrink>
                      Add size
                    </StyledInputLabel>

                    <ToggleButtonGroup
                      size="small"
                      sx={{
                        maxWidth: { xs: '100%', xl: '436px' },
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(85px, 1fr))',
                        gap: '12px',
                        mt: '8px',
                      }}
                    >
                      {sizes.map((size) => {
                        const isSelected = (field.value || []).some(
                          (selectedSize) => selectedSize === size.id
                        );

                        return (
                          <Box key={size.id}>
                            <ToggleButton
                              value={size.id}
                              selected={isSelected}
                              error={!!errors.sizes}
                              sx={{
                                height: 48,
                                width: 74,
                                minWidth: 74,
                                border: '1px solid secondary.dark',
                              }}
                              onClick={() =>
                                handleToggleSize(
                                  size,
                                  field.value || [],
                                  field.onChange
                                )
                              }
                            >
                              {size.value}
                            </ToggleButton>
                          </Box>
                        );
                      })}
                    </ToggleButtonGroup>
                    <FormErrorMessage message={errors.sizes?.message} />
                  </Box>
                );
              }}
            />
          </Box>
          <Box
            sx={{
              width: { xs: 'min(100%, 300px)', md: '692px' },
              alignSelf: { xs: 'center', sm: 'unset' },
            }}
          >
            <ProductFormDropzone
              images={images}
              onRemoveImage={onRemoveImage}
              handleFilesDropped={handleFilesDropped}
            />
          </Box>
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'flex-end',
              marginTop: '16px',
            }}
          >
            <Button type="submit" fullWidth loading={isSubmitting || isPending}>
              Save
            </Button>
            <FormErrorMessage message={errors.root?.message} />
          </Box>
        </Box>
      </Box>
    </>
  );
};
