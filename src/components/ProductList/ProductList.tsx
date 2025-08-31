import { Product } from '@/types/Product';
import { FC } from 'react';
import { Grid } from '@mui/material';
import { CardVariant, ProductCard } from '../ProductCard';
interface ProductListProps {
  products: Product[];
  variant?: CardVariant;
}

export const ProductList: FC<ProductListProps> = ({
  products,
  variant = 'catalog',
}) => {
  return (
    <Grid
      container
      columnSpacing={{ xs: 2, md: 8 }}
      rowSpacing={{ xs: 2, md: 5 }}
      sx={{ width: '100%' }}
    >
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 6, md: 6, lg: 4, xl: 3 }}>
          <ProductCard key={product.id} product={product} variant={variant} />
        </Grid>
      ))}
    </Grid>
  );
};
