'use client';

import { Product } from '@/types/Product';
import { Box, Grid, Typography } from '@mui/material';
import { FC, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductActionMenu } from '../ProductActionMenu';
import { WishlistButton } from '../WishlistButton';
import placeholderImage from '../../../public/product-placeholder.png';
import { useWishlist } from '@/lib/hooks';
import {
  ActionButtonContainer,
  StyledCard,
  StyledCardActionArea,
  StyledCardContent,
} from './productCard.styles';

export type CardVariant = 'catalog' | 'actionMenu' | 'wishlist';

interface ProductCardProps {
  product: Product;
  variant?: CardVariant;
}

export const getGenderText = (genderName: string): string => {
  return genderName === 'Men' ? "Men's Shoes" : "Women's Shoes";
};

export const ProductCard: FC<ProductCardProps> = ({
  product,
  variant = 'catalog',
}) => {
  const { removeItem } = useWishlist();

  const [imageIndex, setImageIndex] = useState(0);

  const productImage = product.images?.[imageIndex]?.url || placeholderImage;
  const productImageAlt =
    product.images && product.images[imageIndex].alternativeText
      ? product.images[imageIndex].alternativeText
      : `product image: ${product.name}`;

  return (
    <StyledCard
      onMouseEnter={() =>
        setImageIndex((product.images?.length ?? 0) > 1 ? 1 : 0)
      }
      onMouseLeave={() => setImageIndex(0)}
    >
      <ActionButtonContainer>
        {variant === 'actionMenu' && <ProductActionMenu product={product} />}
        {variant === 'wishlist' && (
          <WishlistButton onRemove={() => removeItem(product.id)} />
        )}
      </ActionButtonContainer>
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
        <StyledCardActionArea disableRipple>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: 320 / 380,
              animation: ' img fadeIn 0.5s',
            }}
          >
            <Image
              sizes="400px"
              fill
              src={productImage}
              alt={productImageAlt}
              style={{
                objectFit: 'cover',
              }}
            />
          </Box>

          <StyledCardContent>
            <Grid
              container
              justifyContent="space-between"
              alignItems="flex-start"
              color="text.primary"
            >
              <Grid size={{ xs: 9 }} sx={{ minWidth: 0 }}>
                <Typography variant="h5" component={'p'} gutterBottom={false}>
                  {product.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component={'span'}
                  color="text.secondary"
                >
                  {getGenderText(product.gender?.name)}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="h5" component={'span'}>
                  ${product.price}
                </Typography>
              </Grid>
            </Grid>
          </StyledCardContent>
        </StyledCardActionArea>
      </Link>
    </StyledCard>
  );
};
