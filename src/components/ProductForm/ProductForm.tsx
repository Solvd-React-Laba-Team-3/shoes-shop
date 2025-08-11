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
  IconButton,
  FormErrorMessage,
} from '@/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQueries } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { StyledInputLabel, StyledTextArea } from './productForm.styles';
import { productSchema } from './productForm.schema';
import { ProductFormData } from './productForm.schema';
import { FC } from 'react';
import { Size } from '@/types/Size';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHighOutlined';
import { ProductFormDropzone } from '../ProductFormDropzone';
import { PRODUCT_IMAGES_LIMIT } from '@/constants/productImagesLimit';
import { TempImage } from '@/types/TempImage';

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
    setError,
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

  const onFormSubmit = (data: ProductFormData) => {
    if (images.length > PRODUCT_IMAGES_LIMIT) {
      setError('root', {
        message: `You can only upload up to ${PRODUCT_IMAGES_LIMIT} images`,
        type: 'manual',
      });

      return;
    }
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
        sx={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: { xs: 2, md: 0 },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
            <Typography variant="h2">{title}</Typography>
            <Typography
              variant="caption"
              sx={{ maxWidth: { xs: '100%', md: '890px' } }}
            >
              {description}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
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
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 4, md: '234px' },
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
            <Box>
              <LabeledTextfield
                label="Product name"
                placeholder="Nike Air Max 90"
                {...register('name')}
                error={!!errors.name}
              />
              <FormErrorMessage message={errors.name?.message} />
            </Box>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Box>
                  <LabeledTextfield
                    label="Price"
                    type="number"
                    placeholder="160"
                    startAdornment={'$'}
                    {...field}
                    error={!!errors.price}
                    onChange={(e) => {
                      const numValue = Number(e.target.value);
                      if (isNaN(numValue)) return;
                      field.onChange(numValue);
                    }}
                  />
                  <FormErrorMessage message={errors.price?.message} />
                </Box>
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
                          <Typography variant="body2">Select color</Typography>
                        );
                      const selectedColor = colors?.find(
                        (c) => c.id === Number(value)
                      );
                      return selectedColor?.name;
                    }}
                  >
                    {colors.map((color) => (
                      <MenuItem key={color.id} value={color.id.toString()}>
                        <Typography variant="caption">{color.name}</Typography>
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
                      width: '210px',
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
                            <Typography variant="caption">
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
                          <Typography variant="caption">
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
                      width: '210px',
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
                            <Typography variant="caption">
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
                          <Typography variant="caption">
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
                      placeholder="Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with"
                      sx={{
                        border: (theme) =>
                          errors.description
                            ? `1px solid ${theme.palette.error.main}`
                            : `1px solid ${theme.palette.divider}`,
                      }}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        color: (theme) => theme.palette.grey[600],
                      }}
                      onClick={() => console.log('AI autosuggestion...')}
                    >
                      <AutoFixHighIcon />
                    </IconButton>
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
                        maxWidth: '436px',
                        flexWrap: 'wrap',
                        gap: '12px',
                        mt: '8px',
                      }}
                    >
                      {sizes.map((size, index, arr) => {
                        const isSelected = (field.value || []).some(
                          (selectedSize) => selectedSize === size.id
                        );

                        return (
                          <Box
                            key={size.id}
                            sx={{ mr: index < arr.length - 1 ? 0.39 : 0 }}
                          >
                            <ToggleButton
                              value={size.id}
                              selected={isSelected}
                              error={!!errors.sizes}
                              sx={{
                                height: 48,
                                width: 74,
                                minWidth: 74,
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
          <Box sx={{ width: { xs: '100%', md: '692px' }, maxWidth: '100%' }}>
            <ProductFormDropzone
              images={images}
              onRemoveImage={onRemoveImage}
              handleFilesDropped={handleFilesDropped}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};
