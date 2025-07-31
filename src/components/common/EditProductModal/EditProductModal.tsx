'use client';

import { Product } from '@/components/ui/ProductPage/Product';
import type { ProductData } from '@/components/ui/ProductPage/productForm.schema';
import Dialog from '@mui/material/Dialog';
import React from 'react';

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
    <>
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
        <Product
          defaultValues={{
            productName: 'Nike Air Max 90',
            price: '$160',
            gender: 'Men',
            color: 'Black',
            brand: 'Nike',
            description:
              "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with",
            size: [],
          }}
          onSubmit={onSubmit}
        />
      </Dialog>
    </>
  );
};
