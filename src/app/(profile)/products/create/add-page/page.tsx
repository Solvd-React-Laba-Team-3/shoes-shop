'use client';
import { Product } from '@/components/Product/Product';
import { ProductData } from '@/components/Product/productForm.schema';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Suspense, useRef } from 'react';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
  const router = useRouter();
  const formRef = useRef<{ submit: () => void }>(null);

  const handleAdd = (data: ProductData) => {
    console.log('Add submitted: ', data);
    router.push('/');
  };

  return (
    <>
      <Suspense fallback={<CircularProgress />}>
        <Box sx={{ marginBottom: '40px' }}>
          <Box
            sx={{
              display: 'flex',
              paddingRight: '38px',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '35px',
            }}
          >
            <Typography variant="h2">Add a product</Typography>
            <Button onClick={() => formRef.current?.submit()}>Save</Button>
          </Box>

          <Typography
            variant="caption"
            sx={{ display: 'block', maxWidth: '890px' }}
          >
            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used
            in laying out print, graphic or web designs. The passage is
            attributed to an unknown typesetter in the 15th century who is
            thought to have scrambled parts of Cicero&apos;s De Finibus Bonorum
            et Malorum for use in a type specimen book. It usually begins with
          </Typography>
        </Box>

        <Product
          ref={formRef}
          editingProduct={{
            productName: '',
            price: '$160',
            gender: 'Men',
            color: 'Black',
            brand: 'Nike',
            description: '',
            size: [],
          }}
          onSubmit={handleAdd}
        />
      </Suspense>
    </>
  );
}
