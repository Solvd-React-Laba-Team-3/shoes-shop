import { ProductCard } from '../ProductCard';
import { Product } from '@/types/Product';
import { Grid } from '@mui/material';
import { FC } from 'react';

interface ProductListProps {
  products: Product[];
  type?: 'actionMenu' | 'wishlist' | 'catalog';
}

export const ProductList: FC<ProductListProps> = ({
  products,
  type = 'catalog',
}) => {
  return (
    <Grid
      container
      columnSpacing={{ xs: 2, md: 8 }}
      rowSpacing={{ xs: 2, md: 5 }}
    >
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
          <ProductCard {...product} cardType={type} />
        </Grid>
      ))}
    </Grid>
  );
};
