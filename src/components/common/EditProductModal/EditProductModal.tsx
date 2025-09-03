'use client';

import { ProductForm } from '@/components/ProductForm';
import type { ProductFormData } from '@/components/ProductForm/productForm.schema';
import { Product } from '@/types/Product';
import Dialog from '@mui/material/Dialog';
import { FC, useState } from 'react';
import { Suspense } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useUpdateProduct } from '@/api/products/useUpdateProduct';
import { useUploadFile } from '@/api/uploadFile/useUploadFile';
import { TempImage } from '@/types/TempImage';
import { styled } from '@mui/material';

interface EditPageProps {
  open: boolean;
  onClose: () => void;
  editingProduct: Product;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '95%',
    maxWidth: 'unset',
    margin: '10px',
    padding: '53px 40px',
    [theme.breakpoints.down('md')]: {
      padding: '12px 24px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '12px 16px',
    },
  },
}));

export const EditProductModal: FC<EditPageProps> = ({
  open,
  onClose,
  editingProduct,
}) => {
  const { mutate: editProduct, isPending } = useUpdateProduct();
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();

  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<TempImage[]>(
    editingProduct.images?.map((image) => ({
      id: image.id,
      url: image.url,
    })) || []
  );

  const handleFilesDropped = (uploadedFiles: File[]) => {
    const updatedFiles = [...files, ...uploadedFiles];
    setFiles(updatedFiles);

    const maxId = images.reduce((max, img) => Math.max(max, img.id), -1);

    const tempImages = uploadedFiles.map((file, index) => ({
      id: maxId + index + 1,
      url: URL.createObjectURL(file),
    }));

    const updatedImages = [...images, ...tempImages];
    setImages(updatedImages);
  };

  const handleRemoveImage = (id: number, index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

    const updatedImages = images.filter((image) => image.id !== id);
    setImages(updatedImages);
  };

  const handleSubmit = async (data: ProductFormData) => {
    if (files.length > 0) {
      uploadFile(files, {
        onSuccess: (uploadedFiles) => {
          editProduct(
            {
              body: {
                data: {
                  ...data,
                  images: [
                    ...uploadedFiles.map((file) => file.id),
                    ...images
                      .filter((image) => !files[image.id])
                      .map((image) => image.id),
                  ],
                },
              },
              id: editingProduct.id,
            },
            {
              onSuccess: () => {
                onClose();
              },
            }
          );
        },
      });
    } else {
      editProduct(
        {
          body: {
            data: {
              ...data,
              images: images.map((image) => image.id),
            },
          },
          id: editingProduct.id,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <Suspense
        fallback={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <ProductForm
          title="Edit product"
          description="Edit your product there! You can add multiple images and sizes. Try using AI to generate a description for your product. Don't forget to add a brand and a gender to your product."
          onSubmit={handleSubmit}
          isPending={isPending || isUploading}
          images={images}
          handleFilesDropped={handleFilesDropped}
          onRemoveImage={handleRemoveImage}
          editingProduct={{
            name: editingProduct.name,
            price: editingProduct.price,
            gender: editingProduct.gender.id.toString(),
            color: editingProduct.color.id.toString(),
            brand: editingProduct.brand?.id.toString(),
            description: editingProduct.description,
            sizes: editingProduct.sizes.map((size) => size.id),
          }}
        />
      </Suspense>
    </StyledDialog>
  );
};
