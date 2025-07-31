'use client';

import { Product } from '@/types/Product';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  styled,
  Grid,
  Typography,
  Stack,
} from '@mui/material';
import { FC } from 'react';
import Link from 'next/link';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Image from 'next/image';
import { ProductActionMenu } from '../ProductActionMenu';
import { ProductWishlistButton } from '../ProductWishlistButton';
import placeholderImage from '../../../public/product-placeholder.png';

type ProductCardProps = Pick<
  Product,
  'id' | 'name' | 'gender' | 'price' | 'images'
> & {
  cardType?: 'catalog' | 'actionMenu' | 'wishlist';
};

const StyledCard = styled(Card)({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  position: 'relative',
  borderRadius: 0,
});

const StyledCardActionArea = styled(CardActionArea)({
  '&:hover, &:focus, &:active': {
    backgroundColor: 'transparent',
  },
  '& .MuiCardActionArea-focusHighlight': {
    backgroundColor: 'transparent',
  },
  touchAction: 'pan-y',
});

const StyledCardContent = styled(CardContent)({
  padding: '12px 0 0 0',
});

const HoverCartBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  opacity: 0,
  transition: 'opacity 0.2s ease',
  background: 'rgba(255,255,255,0.75)',
  width: '80px',
  height: '80px',
  borderRadius: '100%',
  color: theme.palette.text.secondary,
  '.MuiCardActionArea-root:hover &': {
    opacity: 1,
  },
}));

const ActionButtonContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  zIndex: 2,
  '& .MuiIconButton-root': {
    backgroundColor: 'transparent',
    transition: 'color 0.2s ease-in, background-color 0.2s ease-in',
  },
  '& .MuiIconButton-root:hover': {
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
}));

const getGenderText = (genderName: string): string => {
  return genderName === 'Men' ? "Men's Shoes" : "Women's Shoes";
};

export const ProductCard: FC<ProductCardProps> = ({
  id,
  images,
  name,
  gender,
  price,
  cardType = 'catalog',
}) => {
  const productImage = images?.[0]?.url || placeholderImage;
  const productImageAlt =
    images && images[0].alternativeText
      ? images[0].alternativeText
      : `product image: ${name}`;

  return (
    <StyledCard>
      <ActionButtonContainer>
        {cardType === 'actionMenu' && <ProductActionMenu productId={id} />}
        {cardType === 'wishlist' && <ProductWishlistButton />}
      </ActionButtonContainer>
      <Link href={`/products/${id}`} style={{ textDecoration: 'none' }}>
        <StyledCardActionArea disableRipple>
          <Box sx={{ position: 'relative' }}>
            <Image
              width={300}
              height={300}
              src={productImage}
              alt={productImageAlt}
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '320/380',
              }}
            />

            <HoverCartBox>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1}
                height="100%"
              >
                <AddShoppingCartIcon color="inherit" />
                <Typography fontSize="8px" fontWeight="500">
                  Add to cart
                </Typography>
              </Stack>
            </HoverCartBox>
          </Box>

          <StyledCardContent>
            <Grid
              container
              justifyContent="space-between"
              alignItems="flex-start"
              color="text.primary"
            >
              <Grid size={{ xs: 9 }} sx={{ minWidth: 0 }}>
                <Typography variant="h5" gutterBottom={false}>
                  {name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {getGenderText(gender.name)}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="h5">${price}</Typography>
              </Grid>
            </Grid>
          </StyledCardContent>
        </StyledCardActionArea>
      </Link>
    </StyledCard>
  );
};
