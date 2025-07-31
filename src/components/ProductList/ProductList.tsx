import { ProductCard } from '../ProductCard';
import { Product } from '@/types/Product';
import { FC } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

interface ProductListProps {
  products: Product[];
  type?: 'actionMenu' | 'wishlist' | 'catalog';
}

export const ProductList: FC<ProductListProps> = ({
  products,
  type = 'catalog',
}) => {
  if (products.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: 240,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: 'grey.200',
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <RemoveShoppingCartIcon sx={{ color: 'grey.700' }} />
        </Box>
        <Typography variant="h6">No products match your search</Typography>
        <Typography variant="caption" color="text.secondary">
          Try adjusting filters or keywords.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid
      container
      columnSpacing={{ xs: 2, md: 8 }}
      rowSpacing={{ xs: 2, md: 5 }}
      sx={{ width: '100%' }}
    >
      {products.map((product) => (
        <Grid
          key={product.id}
          size={{ xs: 6, md: 4, lg: 3 }}
          sx={{ minWidth: 0 }}
        >
          <ProductCard {...product} cardType={type} />
        </Grid>
      ))}
    </Grid>
  );
};
