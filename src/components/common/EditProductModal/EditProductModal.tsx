'use client';

import { ProductForm } from '@/components/ProductForm';
import type { ProductFormData } from '@/components/ProductForm/productForm.schema';
import { Product } from '@/types/Product';
import Dialog from '@mui/material/Dialog';
import { FC } from 'react';
import { Suspense } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useSession } from 'next-auth/react';
import { useUpdateProduct } from '@/api/products/useUpdateProduct';

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

  const handleSubmit = async (data: ProductFormData) => {
    if (!session) return;

    editProduct({
      body: {
        data,
      },
      id: editingProduct.id,
      token: session.user.accessToken,
    });

    onClose();
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
          isPending={isPending}
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
