'use client';

import { ProductFormData } from '@/components/ProductForm/productForm.schema';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/ProductForm';
import { useCreateProduct } from '@/api/products/useCreateProduct';
import { useSession } from 'next-auth/react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function CreateProductPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { mutate: createProduct, isPending } = useCreateProduct();

  const handleSubmit = (data: ProductFormData) => {
    if (!session) return;

    createProduct({
      body: {
        data: {
          ...data,
          userID: session.user.id,
          // TODO: connect Image Dropzone to form
          images: null,
          categories: null,
        },
      },
      token: session.user.accessToken,
    });

    router.replace('/profile/products');
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
        isPending={isPending}
      />
    </Suspense>
  );
}
