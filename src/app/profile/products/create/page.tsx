'use client';

import { ProductFormData } from '@/components/ProductForm/productForm.schema';
import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/ProductForm';
import { useCreateProduct } from '@/api/products/useCreateProduct';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useUploadFile } from '@/api/uploadFile/useUploadFile';
import { TempImage } from '@/types/TempImage';

export default function CreateProductPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<TempImage[]>([]);

  const { mutate: createProduct, isPending } = useCreateProduct();
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();

  const handleFilesDropped = (uploadedFiles: File[]) => {
    const updatedFiles = [...files, ...uploadedFiles];
    setFiles(updatedFiles);

    const tempImages = uploadedFiles.map((file, index) => ({
      id: images.length + index,
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
          createProduct(
            {
              body: {
                data: {
                  ...data,
                  images: uploadedFiles.map((file) => file.id),
                },
              },
            },
            {
              onSuccess: () => {
                router.replace('/profile/products');
              },
            }
          );
        },
      });
    } else {
      createProduct(
        {
          body: {
            data,
          },
        },
        {
          onSuccess: () => {
            router.replace('/profile/products');
          },
        }
      );
    }
  };

  return (
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
        title="Add a product"
        description="Create your product there! You can add multiple images and sizes. Try using AI to generate a description for your product. Don't forget to add a brand and a gender to your product."
        onSubmit={handleSubmit}
        isPending={isPending || isUploading}
        images={images}
        handleFilesDropped={handleFilesDropped}
        onRemoveImage={handleRemoveImage}
      />
    </Suspense>
  );
}
