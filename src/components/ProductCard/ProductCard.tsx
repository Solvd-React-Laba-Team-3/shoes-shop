'use client';

import { Product } from '@/types/Product';
import { Box, Grid, Typography } from '@mui/material';
import { FC } from 'react';
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

const getGenderText = (genderName: string): string => {
  return genderName === 'Men' ? "Men's Shoes" : "Women's Shoes";
};

export const ProductCard: FC<ProductCardProps> = ({
  product,
  variant = 'catalog',
}) => {
  const { removeItem } = useWishlist();

  const productImage = product.images?.[0]?.url || placeholderImage;
  const productImageAlt =
    product.images && product.images[0].alternativeText
      ? product.images[0].alternativeText
      : `product image: ${product.name}`;

  return (
    <StyledCard>
      <ActionButtonContainer>
        {variant === 'actionMenu' && <ProductActionMenu product={product} />}
        {variant === 'wishlist' && (
          <WishlistButton onRemove={() => removeItem(product.id)} />
        )}
      </ActionButtonContainer>
      <Link
        href={`/products/${product.id}`}
        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      >
        <StyledCardActionArea disableRipple>
          <Box
            sx={{ position: 'relative', width: '100%', aspectRatio: 320 / 380 }}
          >
            <Image
              sizes="400px"
              fill
              src={productImage}
              alt={productImageAlt}
              style={{ objectFit: 'cover' }}
            />
          </Box>

          <StyledCardContent>
            <Grid
              container
              justifyContent="space-between"
              alignItems="flex-start"
              color="text.primary"
              height={'100%'}
              flexDirection={{ xs: 'column', md: 'row' }}
            >
              <Grid
                size={{ xs: 9 }}
                display={'flex'}
                flexDirection={'column'}
                sx={{
                  minWidth: 0,
                  flex: 1,
                  marginRight: { md: '10px' },
                  width: { xs: '100%', md: 'auto' },
                  height: '100%',
                }}
              >
                <Typography variant="h5" component={'p'} gutterBottom={false}>
                  {product.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component={'span'}
                  color="text.secondary"
                  marginTop={{ xs: 'auto', md: '0' }}
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
