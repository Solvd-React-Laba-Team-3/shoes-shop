'use client';

import { ProductFormData } from '@/components/ProductForm/productForm.schema';
import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageType, ProductForm } from '@/components/ProductForm';
import { useCreateProduct } from '@/api/products/useCreateProduct';
import { useSession } from 'next-auth/react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useUploadFile } from '@/api/uploadFile/useUploadFile';

export default function CreateProductPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();

  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<ImageType[]>([]);

  const handleFilesDropped = (files: File[]) => {
    setFiles(files);

    const tempImages = files.map((file, index) => ({
      id: index,
      url: URL.createObjectURL(file),
    }));

    setImages(tempImages);
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (data: ProductFormData) => {
    if (!session) return;

    if (files.length > 0) {
      uploadFile(files, {
        onSuccess: (uploadedFiles) => {
          createProduct(
            {
              body: {
                data: {
                  ...data,
                  userID: session.user.id,
                  images: uploadedFiles.map((file) => file.id),
                  categories: null,
                },
              },
              token: session.user.accessToken,
            },
            {
              onSettled: () => {
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
            data: {
              ...data,
              userID: session.user.id,
              images: null,
              categories: null,
            },
          },
          token: session.user.accessToken,
        },
        {
          onSettled: () => {
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
        description="Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with"
        onSubmit={handleSubmit}
        isPending={isPending || isUploading}
        images={images}
        handleFilesDropped={handleFilesDropped}
        onRemoveImage={handleRemoveImage}
      />
    </Suspense>
  );
}
