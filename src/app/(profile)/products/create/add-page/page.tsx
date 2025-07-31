'use client';
import { Product } from '@/components/Product/Product';
import { ProductData } from '@/components/Product/productForm.schema';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Suspense } from 'react';
import { Button } from '@/components/ui';

export default function CreateProductPage() {
  const handleAdd = (data: ProductData) => {
    console.log('Add submitted: ', data);
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
            <Button>Save</Button>
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
          editingProduct={{
            productName: 'Nike Air Max 90',
            price: '$160',
            gender: 'Men',
            color: 'Black',
            brand: 'Nike',
            description:
              "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with",
            size: [],
          }}
          onSubmit={handleAdd}
        />
      </Suspense>
    </>
  );
}
