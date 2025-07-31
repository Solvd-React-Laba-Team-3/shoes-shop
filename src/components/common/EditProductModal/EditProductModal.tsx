'use client';

import { Product } from '@/components/Product/Product';
import type { ProductData } from '@/components/Product/productForm.schema';
import { Button } from '@/components/ui';
import { Box, Typography, CircularProgress } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import React from 'react';
import { Suspense } from 'react';

interface EditPageProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductData) => void;
}

export const EditProductModal = ({
  open,
  onClose,
  onSubmit,
}: EditPageProps) => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="draggable-dialog-title"
        fullWidth
        maxWidth={false}
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '1487px',
            padding: '57px 0 40px 57px',
          },
        }}
      >
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
            <Typography variant="h2">Edit product</Typography>
            <Button>Save</Button>
          </Box>

          <Typography variant="caption">
            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used
            in laying out print, graphic or web designs. The passage is
            attributed to an unknown typesetter in the 15th century who is
            thought to have scrambled parts of Cicero&apos;s De Finibus Bonorum
            et Malorum for use in a type specimen book. It usually begins with
          </Typography>
        </Box>
        <Product
          editingProduct={{
            productName: '',
            price: '$160',
            gender: 'Men',
            color: 'Black',
            brand: 'Nike',
            description: '',
            size: [],
          }}
          onSubmit={onSubmit}
        />
      </Dialog>
    </Suspense>
  );
};
