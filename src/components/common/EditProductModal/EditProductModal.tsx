'use client';

import { ProductForm, type ImageType } from '@/components/ProductForm';
import type { ProductFormData } from '@/components/ProductForm/productForm.schema';
import { Product } from '@/types/Product';
import Dialog from '@mui/material/Dialog';
import { FC, useState } from 'react';
import { Suspense } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useSession } from 'next-auth/react';
import { useUpdateProduct } from '@/api/products/useUpdateProduct';
import { useUploadFile } from '@/api/uploadFile/useUploadFile';

interface EditPageProps {
  open: boolean;
  onClose: () => void;
  editingProduct: Product;
}

export const EditProductModal: FC<EditPageProps> = ({
  open,
  onClose,
  editingProduct,
}) => {
  const { data: session } = useSession();
  const { mutate: editProduct, isPending } = useUpdateProduct();
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();

  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<ImageType[]>(
    editingProduct.images?.map((image) => ({
      id: image.id,
      url: image.url,
    })) || []
  );

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
          editProduct(
            {
              body: {
                data: {
                  ...data,
                  images: [
                    ...uploadedFiles.map((file) => file.id),
                    ...(editingProduct.images?.map((image) => image.id) || []),
                  ],
                },
              },
              id: editingProduct.id,
              token: session.user.accessToken,
            },
            {
              onSettled: () => {
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
              images: editingProduct.images?.map((image) => image.id),
            },
          },
          id: editingProduct.id,
          token: session.user.accessToken,
        },
        {
          onSettled: () => {
            onClose();
          },
        }
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          minWidth: '1487px',
          padding: '53px 40px 40px 85px',
        },
      }}
    >
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
          description="Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with"
          onSubmit={handleSubmit}
          isPending={isPending || isUploading}
          images={images}
          handleFilesDropped={handleFilesDropped}
          onRemoveImage={handleRemoveImage}
          editingProduct={{
            name: editingProduct.name,
            price: editingProduct.price,
            gender: editingProduct.gender.id,
            color: editingProduct.color.id,
            brand: editingProduct.brand?.id,
            description: editingProduct.description,
            sizes: editingProduct.sizes.map((size) => size.id),
          }}
        />
      </Suspense>
    </Dialog>
  );
};
