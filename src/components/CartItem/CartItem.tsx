import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  ButtonGroup,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Image from 'next/image';
import { FC, useState } from 'react';
import { Accordion, Button } from '../ui';
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
  const isBigScreen = useMediaQuery('(min-width:860px)');
  const isSmallScreen = useMediaQuery('(max-width:780px)');

  const updatedPrice = price * quantity;

  const handleRemoveItem = () => {
    removeItem(id, size);
    setRemoveModalOpen(false);
  };

  return (
    <>
      <Stack
        sx={{
          marginRight: { xs: 0, md: 4 },
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 1.5, sm: 3, md: 4 }, // smaller gap for mobile
        }}
      >
        <Box>
          <Stack direction="row" spacing={{ xs: 2, sm: 4 }}>
            <Box
              sx={{
                width: { xs: 120, sm: 160, lg: 223 }, // smaller img on mobile
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

            <Stack direction="row" justifyContent="space-between">
              <Stack spacing={0.5}>
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
                    [theme.breakpoints.down('sm')]: {
                      fontSize: '8px',
                    },
                  })}
                >
                  {gender}&apos;s Shoes
                </Typography>
                {!isSmallScreen && (
                  <>
                    <Typography variant="subtitle1">Size: {size}</Typography>
                    <Typography variant="h4" color="primary.main">
                      In Stock
                    </Typography>
                  </>
                )}
              </Stack>

              <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="flex-end"
                sx={{ marginRight: 'auto', maxWidth: { sx: '200px' } }}
              >
                <Typography
                  variant="h3"
                  sx={(theme) => ({
                    [theme.breakpoints.down('sm')]: {
                      fontSize: '12px',
                    },
                  })}
                >
                  ${updatedPrice}
                </Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={'20px'}
                  sx={{
                    paddingLeft: '237px',
                    '@media (max-width: 1760px)': {
                      padding: '0',
                    },
                  }}
                >
                  {isBigScreen ? (
                    <>
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

                      {/* <Button
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
                          sx={{ color: (theme) => theme.palette.grey[400] }}
                        />
                        Delete
                      </Button> */}
                    </>
                  ) : (
                    <Box sx={{ maxWidth: 100 }}>
                      <Accordion
                        label={
                          <Typography sx={{ fontSize: '12px' }}>
                            Quantity
                          </Typography>
                        }
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
                            sx={{
                              backgroundColor: '#E8E8E8',
                              color: '#CECECE',
                            }}
                            onClick={() => decreaseQuantity(id, size, quantity)}
                          >
                            -
                          </Button>
                          <Typography variant="body1">{quantity}</Typography>
                          <Button
                            sx={{
                              backgroundColor: '#FFD7D6',
                              color: '#FE645E',
                            }}
                            onClick={() => increaseQuantity(id, size, quantity)}
                          >
                            +
                          </Button>
                        </ButtonGroup>
                      </Accordion>
                    </Box>
                  )}

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

                      '@media (max-width: 600px)': {
                        fontSize: '12px',
                      },
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

      {/* accordion */}

      {/* <Box sx={{ maxWidth: 100 }}>
        <Accordion
          label={<Typography sx={{ fontSize: '12px' }}>Quantity</Typography>}
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
        </Accordion>
      </Box> */}

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
