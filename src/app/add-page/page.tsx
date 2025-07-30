'use client';

import { ProductData } from '@/components/ui/ProductPage/Product';

import { Product } from '@/components/ui/ProductPage';

export default function AddPage() {
  const handleAdd = (data: ProductData) => {
    console.log('Add submitted: ', data);
  };

  return (
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
      onSubmit={handleAdd}
    />
  );
}
