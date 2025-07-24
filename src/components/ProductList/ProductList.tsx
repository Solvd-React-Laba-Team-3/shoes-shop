import { Grid } from '@mui/material';
import { ProductCard } from '../ProductCard';
import { Product } from '@/types/Product';

type ProductListProps = {
  products: Product[];
};

export function ProductList({ products }: ProductListProps) {
  return (
    <Grid
      container
      columnSpacing={{ xs: 2, md: 8 }}
      rowSpacing={{ xs: 2, md: 5 }}
    >
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
          <ProductCard {...product} hasWishlistButton />
        </Grid>
      ))}
    </Grid>
  );
}
