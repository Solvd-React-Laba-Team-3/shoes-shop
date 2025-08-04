import { ProductCard } from '../ProductCard';
import { Product } from '@/types/Product';
import { FC } from 'react';
import { Grid } from '@mui/material';

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
      sx={{ width: '100%' }}
    >
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 6, md: 4, lg: 3 }}>
          <ProductCard key={product.id} product={product} cardType={type} />
        </Grid>
      ))}
    </Grid>
  );
};
