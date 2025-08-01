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
} from '@/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  FormControl,
  FormLabel,
  ToggleButtonGroup,
  Typography,
  Fab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSuspenseQueries } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { StyledInputLabel, StyledTextArea } from './productForm.styles';
import { productSchema } from './productForm.schema';
import { ProductFormData } from './productForm.schema';
import { FC, useState } from 'react';
import { Size } from '@/types/Size';
import LinearProgress from '@mui/material/LinearProgress';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHighOutlined';
import { FileDropZone } from '@/components/FileDropZone';
import Image from 'next/image';
import { DeleteImageModal } from '../common/DeleteImageModal';

export type ImageType = {
  id: number;
  url: string;
};

interface ProductFormProps {
  editingProduct?: Partial<ProductFormData>;
  isPending: boolean;
  title: string;
  description: string;
  onSubmit: (data: ProductFormData) => void;
  images: ImageType[];
  handleFilesDropped: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
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
  const [isDeleteImageModalOpen, setIsDeleteImageModalOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      color: 0,
      gender: 0,
      brand: 0,
      description: '',
      sizes: [],
      ...editingProduct,
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
              <Typography variant="h2">{title}</Typography>
              <Typography variant="caption" sx={{ maxWidth: '890px' }}>
                {description}
              </Typography>
            </Box>

            <Button
              type="submit"
              size="small"
              loading={isSubmitting || isPending}
            >
              Save
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: '234px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Box>
                <LabeledTextfield
                  label="Product name"
                  placeholder="Nike Air Max 90"
                  {...register('name')}
                  error={!!errors.name}
                />
                {errors.name && (
                  <FormLabel
                    sx={{
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 1,
                    }}
                    error
                  >
                    <WarningAmberIcon fontSize="small" />
                    {errors.name.message}
                  </FormLabel>
                )}
              </Box>

              <Box sx={{ margin: '8px 0 20px 0' }}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <>
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
                      {errors.price && (
                        <FormLabel
                          sx={{
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: 1,
                          }}
                          error
                        >
                          <WarningAmberIcon fontSize="small" />
                          {errors.price.message}
                        </FormLabel>
                      )}
                    </>
                  )}
                />
              </Box>

              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <FormControl variant="outlined">
                    <StyledInputLabel
                      id="color-label"
                      shrink
                      variant="outlined"
                      sx={{
                        marginLeft: '-13px',
                      }}
                      color="secondary"
                      error={!!errors.color}
                    >
                      Color
                    </StyledInputLabel>
                    <Select
                      {...field}
                      sx={{ mt: '18px', width: '436px', padding: '8px 0' }}
                      displayEmpty
                      error={!!errors.color}
                      renderValue={(value) => {
                        if (!value)
                          return (
                            <Typography variant="body2">
                              Select color
                            </Typography>
                          );

                        const selectedColor = colors?.find(
                          (c) => c.id === value
                        );

                        return selectedColor?.name;
                      }}
                    >
                      {colors.map((color) => (
                        <MenuItem key={color.id} value={color.id}>
                          <Typography variant="caption">
                            {color.name}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.color && (
                      <FormLabel
                        sx={{
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: 1,
                        }}
                        error
                      >
                        <WarningAmberIcon fontSize="small" />
                        {errors.color.message}
                      </FormLabel>
                    )}
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
                      <StyledInputLabel
                        id="gender-label"
                        shrink
                        sx={{
                          marginLeft: '-13px',
                        }}
                        color="secondary"
                        error={!!errors.gender}
                      >
                        Gender
                      </StyledInputLabel>
                      <Select
                        {...field}
                        label="Gender"
                        sx={{ mt: '20px' }}
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
                            (g) => g.id === value
                          );

                          return selectedGender?.name;
                        }}
                      >
                        {genders?.map((gender) => (
                          <MenuItem key={gender.id} value={gender.id}>
                            <Typography variant="caption">
                              {gender.name}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.gender && (
                        <FormLabel
                          sx={{
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: 1,
                          }}
                          error
                        >
                          <WarningAmberIcon fontSize="small" />
                          {errors.gender.message}
                        </FormLabel>
                      )}
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
                      <StyledInputLabel
                        id="brand-label"
                        shrink
                        sx={{
                          marginLeft: '-13px',
                        }}
                        color="secondary"
                        error={!!errors.brand}
                      >
                        Brand
                      </StyledInputLabel>
                      <Select
                        {...field}
                        sx={{ mt: '20px' }}
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
                            (b) => b.id === value
                          );

                          return selectedBrand?.name;
                        }}
                      >
                        {brands.map((brand) => (
                          <MenuItem key={brand.id} value={brand.id}>
                            <Typography variant="caption">
                              {brand.name}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.brand && (
                        <FormLabel
                          sx={{
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: 1,
                          }}
                          error
                        >
                          <WarningAmberIcon fontSize="small" />
                          {errors.brand.message}
                        </FormLabel>
                      )}
                    </FormControl>
                  )}
                />
              </Box>

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Box sx={{ width: 436 }}>
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
                              ? `1px solid ${theme.palette.error.main} !important`
                              : `1px solid ${theme.palette.divider}`,
                        }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '12px',
                          color: (theme) => theme.palette.grey[600],
                          cursor: 'pointer',
                        }}
                        onClick={() => console.log('AI autosuggestion...')}
                      >
                        <AutoFixHighIcon />
                      </IconButton>
                    </Box>
                    {errors.description && (
                      <FormLabel
                        sx={{
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: 1,
                        }}
                        error
                      >
                        <WarningAmberIcon fontSize="small" />
                        {errors.description.message}
                      </FormLabel>
                    )}
                  </Box>
                )}
              />

              <Box sx={{ marginTop: '8px' }}>
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
                                  sx={{
                                    height: 48,
                                    width: 74,
                                    minWidth: 74,
                                    border: (theme) =>
                                      errors.sizes
                                        ? `1px solid ${theme.palette.error.main} !important`
                                        : `1px solid ${theme.palette.divider}`,
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
                        {errors.sizes && (
                          <FormLabel
                            sx={{
                              fontSize: '13px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mt: 1,
                            }}
                            error
                          >
                            <WarningAmberIcon fontSize="small" />
                            {errors.sizes.message}
                          </FormLabel>
                        )}
                      </Box>
                    );
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '52px',
              }}
            >
              <FileDropZone onFilesDropped={handleFilesDropped} />

              {images.map((image) => (
                <>
                  <Box key={image.id} sx={{ position: 'relative' }}>
                    <Image
                      src={image.url}
                      alt="Product"
                      width={320}
                      height={380}
                    />
                    <Fab
                      size="small"
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                      }}
                      onClick={() => setIsDeleteImageModalOpen(true)}
                    >
                      <DeleteIcon />
                    </Fab>
                  </Box>
                  <DeleteImageModal
                    open={isDeleteImageModalOpen}
                    onClose={() => setIsDeleteImageModalOpen(false)}
                    onDelete={() => {
                      onRemoveImage(image.id);
                      setIsDeleteImageModalOpen(false);
                    }}
                  />
                </>
              ))}
            </Box>
          </Box>
        </Box>
      </form>
    </>
  );
};
