import DeleteIcon from '@mui/icons-material/Delete';
import { Box, ButtonGroup, Divider, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { FC, useState } from 'react';
import { Button } from '../ui';
import { CartProduct } from '@/types/CartProduct';
import { useCart } from '@/lib/hooks';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import { useRouter } from 'next/navigation';

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
      <Stack
        sx={(theme) => ({
          marginRight: { xs: 0, md: 4 },
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 1.5, sm: 3, md: 4 },
          width: { xs: '100%', md: 'auto' }, // <- 100% width for screens <= 900px
          [theme.breakpoints.down('sm')]: { height: '17vh' },
        })}
      >
        <Box sx={{ width: '100%' }}>
          <Stack direction="row" sx={{ width: '100%' }}>
            {/* Product Image */}
            <Box
              sx={{
                width: { xs: 120, sm: 160, lg: 223 },
                height: 'auto',
                flexShrink: 0,
              }}
            >
              <Image
                src={image}
                width={223}
                height={214}
                alt="product image"
                style={{ cursor: 'pointer', maxWidth: '100%', height: 'auto' }}
                onClick={() => router.push(`/products/${id}`)}
              />
            </Box>

            {/* Product Info & Actions */}
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ width: '100%' }}
            >
              {/* Product Details */}
              <Stack spacing={0.5} sx={{ paddingLeft: '20px' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: {
                      xs: '1rem',
                      sm: '1.25rem',
                      md: '1.5rem',
                      lg: '1.75rem',
                      xl: '2rem',
                    },
                  }}
                >
                  {name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={(theme) => ({
                    [theme.breakpoints.down('sm')]: { fontSize: '8px' },
                  })}
                >
                  {gender}&apos;s Shoes
                </Typography>
                <Typography variant="subtitle1">Size: {size}</Typography>
                <Typography variant="h4" color="primary.main">
                  In Stock
                </Typography>
              </Stack>

              {/* Price and Quantity */}
              <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="flex-end"
                sx={{ marginRight: 'auto', maxWidth: { sx: '200px' } }}
              >
                <Typography
                  variant="h3"
                  sx={(theme) => ({
                    [theme.breakpoints.down('sm')]: { fontSize: '12px' },
                  })}
                >
                  ${updatedPrice}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={2}>
                  <ButtonGroup
                    size="small"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      '& .MuiButton-root': {
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        minWidth: 0,
                        padding: 0,
                        fontSize: '18px',
                      },
                    }}
                  >
                    <Button
                      sx={{ backgroundColor: '#E8E8E8', color: '#CECECE' }}
                      onClick={() => decreaseQuantity(id, size, quantity)}
                    >
                      -
                    </Button>
                    <Typography variant="body1">{quantity}</Typography>
                    <Button
                      sx={{ backgroundColor: '#FFD7D6', color: '#FE645E' }}
                      onClick={() => increaseQuantity(id, size, quantity)}
                    >
                      +
                    </Button>
                  </ButtonGroup>

                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', fontSize: '16px' }}
                  >
                    Quantity
                  </Typography>

                  <Button
                    size="small"
                    sx={(theme) => ({
                      background: 'transparent',
                      color: theme.palette.grey[400],
                      fontSize: '24px',
                      gap: 1,
                      padding: 0,
                      borderRadius: 0,
                      borderLeft: `1px solid ${theme.palette.divider}`,
                      '@media (max-width: 860px)': {
                        fontSize: '12px',
                        borderLeft: 'none',
                      },
                    })}
                    onClick={() => setRemoveModalOpen(true)}
                  >
                    <DeleteIcon
                      aria-label="delete item"
                      sx={{ color: (theme) => theme.palette.grey[400] }}
                    />
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        <Divider sx={{ margin: '60px 0' }} />
      </Stack>

      <DeleteConfirmationModal
        title="Are you sure you want to remove this product from the cart?"
        description="Confirm to continue or cancel."
        open={removeModalOpen}
        onClose={() => setRemoveModalOpen(false)}
        onDelete={handleRemoveItem}
        deleteText="Remove"
      />
    </>
  );
};
