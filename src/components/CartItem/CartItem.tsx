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
      <Box
        sx={(theme) => ({
          [theme.breakpoints.down('xl')]: {
            mx: '20px',
          },
        })}
      >
        <Stack
          sx={(theme) => ({
            marginRight: { xs: 0, md: 4 },
            flexDirection: { sm: 'row' },
            alignItems: 'flex-end',
            gap: { xs: 1.5, sm: 3, md: 4 },
            maxWidth: '963px',
            '@media (min-width:900px) and (max-width:970px)': {
              maxWidth: '510px',
            },
            '@media (min-width:1200px) and (max-width:1237px)': {
              maxWidth: '760px',
            },
            [theme.breakpoints.down('sm')]: {
              flexDirection: 'row',
            },
          })}
        >
          <Stack
            direction="row"
            sx={{
              flexShrink: 1,
              minWidth: 0,
              gap: { xs: 1.5, sm: 3, md: 4 },
              alignItems: 'flex-start',
            }}
          >
            <Box
              sx={{
                aspectRatio: '1 / 1',
                width: { xs: 120, sm: 160, lg: 223 },
                height: 'auto',
                flexShrink: 0,
                marginRight: '46px',
                '@media (max-width: 1100px)': {
                  marginRight: '10px',
                },
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

            <Stack
              spacing={0.5}
              sx={{
                flex: 1,
                minWidth: 0,
                '& .MuiTypography-root': {
                  minWidth: 'max-content',
                  whiteSpace: 'nowrap',
                  '@media (max-width: 380px)': {
                    whiteSpace: 'break-spaces',
                    minWidth: 'fit-content',
                    fontSize: '12px',
                  },
                },
              }}
            >
              <Stack direction="row">
                <Typography
                  variant="h3"
                  sx={{
                    alignItems: 'center',
                    '@media (max-width: 380px)': {
                      maxWidth: '10%',
                    },
                  }}
                >
                  {name}
                </Typography>
              </Stack>

              <Typography variant="h6">{gender}&apos;s Shoes</Typography>
              <Typography variant="subtitle1">Size: {size}</Typography>
              <Typography
                variant="h4"
                color="primary.main"
                sx={(theme) => ({
                  [theme.breakpoints.down('sm')]: { display: 'none' },
                })}
              >
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
            <Typography
              variant="h3"
              sx={{
                '@media (max-width: 380px)': {
                  fontSize: '12px',
                },
              }}
            >
              ${updatedPrice}
            </Typography>

            <Box
              display="flex"
              alignItems="center"
              gap={2}
              sx={(theme) => ({
                '@media (max-width: 1100px)': {
                  gap: 0,
                },
                '@media (max-width: 420px)': {
                  maxWidth: '50%',
                },
                // '@media (min-width: 600px) and (max-width: 740px)': {
                //   margin: '-30px 0',
                // },
                [theme.breakpoints.down('sm')]: { margin: '-20px 0' },
              })}
            >
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
                    '@media (max-width: 420px)': {
                      width: '15px',
                      height: '15px',
                    },
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
                sx={(theme) => ({
                  color: 'text.secondary',
                  fontSize: '16px',
                  [theme.breakpoints.down('lg')]: { display: 'none' },
                })}
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
                  '@media (max-width: 1280px)': {
                    borderLeft: 'none',
                  },
                  '@media (max-width: 420px)': {
                    fontSize: '12px',
                  },
                })}
                onClick={() => setRemoveModalOpen(true)}
              >
                <DeleteIcon
                  aria-label="delete item"
                  sx={{
                    color: (theme) => theme.palette.grey[400],
                    '@media (max-width: 420px)': {
                      width: '12px',
                      height: '12px',
                    },
                  }}
                />
                Delete
              </Button>
            </Box>
          </Stack>
        </Stack>

        <Divider
          sx={(theme) => ({
            margin: '60px 0',
            [theme.breakpoints.down('sm')]: { margin: '30px 0' },
          })}
        />
      </Box>

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
