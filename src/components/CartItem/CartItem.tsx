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
      <Stack>
        <Box>
          <Stack direction="row" spacing={4}>
            <Box sx={{ width: 223, height: 214, flexShrink: 0 }}>
              <Image
                src={image}
                width={223}
                height={214}
                alt="product image"
                style={{ cursor: 'pointer' }}
                onClick={() => router.push(`/products/${id}`)}
              />
            </Box>

            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{
                height: 214,
                flexGrow: 1,
              }}
            >
              <Stack spacing={0.5}>
                <Typography variant="h3">{name}</Typography>
                <Typography variant="h6">{gender}&apos;s Shoes</Typography>
                <Typography variant="subtitle1">Size: {size}</Typography>
                <Typography variant="h4" color="primary.main">
                  In Stock
                </Typography>
              </Stack>

              <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="flex-end"
                sx={{ marginRight: '166px' }}
              >
                <Typography variant="h3">${updatedPrice}</Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={'20px'}
                  sx={{
                    paddingLeft: '237px',
                  }}
                >
                  <ButtonGroup
                    size="small"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',

                      '& .MuiButton-root': {
                        width: 25,
                        height: 25,
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
                    sx={{ color: 'text.secondary', fontSize: '24px' }}
                  >
                    Quantity
                  </Typography>
                  <Button
                    size="small"
                    sx={{
                      background: 'transparent',
                      color: (theme) => theme.palette.grey[400],
                      fontSize: '24px',
                      gap: 1,
                      padding: 0,
                      borderRadius: 0,
                      borderLeft: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                    }}
                    onClick={() => setRemoveModalOpen(true)}
                  >
                    <DeleteIcon
                      aria-label="delete item"
                      sx={{
                        color: (theme) => theme.palette.grey[400],
                      }}
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
