import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  ButtonGroup,
  Divider,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { FC, useState } from 'react';
import { Button, IconButton } from '../ui';
import { CartProduct } from '@/types/CartProduct';
import { useCart } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import IncreaseIcon from '@mui/icons-material/Add';
import DecreaseIcon from '@mui/icons-material/Remove';
import { ConfirmActionModal } from '../common/ConfirmActionModal';

const StyledDeleteButton = styled(Button)(({ theme }) => ({
  background: 'transparent',
  color: theme.palette.grey[400],
  gap: 1,
  padding: 0,
  borderRadius: 0,
  width: '120px',
  borderLeft: `1px solid ${theme.palette.divider}`,
}));

const StyledImageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  aspectRatio: '1 / 1',
  flexShrink: 0,
  marginRight: '46px',
  width: '300px',
  height: '300px',
  [theme.breakpoints.down('sm')]: {
    width: '200px',
    height: '200px',
  },
}));

export const CartItem: FC<CartProduct> = ({
  image,
  name,
  gender,
  size,
  price,
  quantity,
  id,
}) => {
  const router = useRouter();
  const { removeItem, decreaseQuantity, increaseQuantity } = useCart();
  const [removeModalOpen, setRemoveModalOpen] = useState(false);

  const updatedPrice = price * quantity;

  const handleRemoveItem = () => {
    removeItem(id, size);
    setRemoveModalOpen(false);
  };

  return (
    <>
      <Box>
        <Stack
          direction="row"
          sx={{
            marginRight: { xs: 0, md: 4 },
            alignItems: 'flex-end',
            gap: { xs: 1.5, sm: 3, md: 4 },
          }}
        >
          <Stack
            sx={{
              flexShrink: 1,
              minWidth: 0,
              gap: { xs: 1.5, sm: 3, md: 4 },
              alignItems: 'flex-start',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <StyledImageWrapper>
              <Image
                src={image}
                fill
                sizes="(max-width: 600px) 200px, 300px"
                alt="product image"
                style={{
                  cursor: 'pointer',
                  objectFit: 'cover',
                }}
                onClick={() => router.push(`/products/${id}`)}
              />
            </StyledImageWrapper>

            <Stack>
              <Stack direction="row">
                <Typography
                  variant="h3"
                  sx={{
                    whiteSpace: { xs: 'nowrap', md: 'normal', lg: 'nowrap' },
                  }}
                >
                  {name}
                </Typography>
              </Stack>

              <Typography variant="h6">{gender}&apos;s Shoes</Typography>
              <Typography variant="subtitle1">Size: {size}</Typography>
              <Typography variant="h4" color="primary.main">
                In Stock
              </Typography>
            </Stack>
          </Stack>

          <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="flex-end"
            sx={{
              flex: 1,
              alignSelf: 'stretch',
              minHeight: '100%',
            }}
          >
            <Typography variant="h3">${updatedPrice}</Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <ButtonGroup
                size="small"
                sx={{ gap: '10px', alignItems: 'center' }}
              >
                <IconButton
                  size="small"
                  sx={(theme) => ({
                    width: '20px',
                    height: '20px',
                    backgroundColor: theme.palette.grey[100],
                    color: theme.palette.text.secondary,
                  })}
                  onClick={() => decreaseQuantity(id, size, quantity)}
                >
                  <DecreaseIcon fontSize="small" />
                </IconButton>
                <Typography variant="body1">{quantity}</Typography>
                <IconButton
                  size="small"
                  data-cy="increaseButton"
                  sx={(theme) => ({
                    width: '20px',
                    height: '20px',
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  })}
                  onClick={() => increaseQuantity(id, size, quantity)}
                >
                  <IncreaseIcon fontSize="small" />
                </IconButton>
              </ButtonGroup>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Quantity
              </Typography>
              <StyledDeleteButton
                size="small"
                onClick={() => setRemoveModalOpen(true)}
                startIcon={
                  <DeleteIcon
                    aria-label="delete item"
                    sx={{ color: 'text.secondary', mt: '2px' }}
                  />
                }
              >
                <Typography variant="subtitle1">Delete</Typography>
              </StyledDeleteButton>
            </Box>
          </Stack>
        </Stack>

        <Divider sx={{ margin: '60px 0' }} />
      </Box>

      <ConfirmActionModal
        title="Are you sure you want to remove this product from the cart?"
        description="Confirm to continue or cancel."
        open={removeModalOpen}
        onClose={() => setRemoveModalOpen(false)}
        onConfirm={handleRemoveItem}
        confirmText="Remove"
      />
    </>
  );
};
