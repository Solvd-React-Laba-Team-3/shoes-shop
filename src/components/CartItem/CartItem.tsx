import { Box, ButtonGroup, Divider, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { Button } from '../ui/Button/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '@/lib/hooks/useCart/useCart';
import { File } from '@/types/api/File';

interface CartItemProps {
  id: number;
  images: File[];
  name: string;
  category?: string;
  inStock?: boolean;
  price: number;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  id,
  images,
  name,
  category,
  inStock,
  price,
  quantity,
  // onIncrease,
  // onDecrease,
  // onDelete,
}) => {
  const { handleIncrease, handleDecrease, handleDelete } = useCart();

  const imageSrc = images && images.length > 0 ? images[0].url : null;

  return (
    <Stack>
      <Box>
        <Stack direction="row" spacing={4}>
          <Box sx={{ width: 223, height: 214, flexShrink: 0 }}>
            {imageSrc ? (
              <Image
                src={imageSrc}
                width={223}
                height={214}
                alt="product image"
              />
            ) : (
              <Box
                sx={{
                  width: '223px',
                  height: '214px',
                  backgroundColor: '#ccc',
                  borderRadius: '4px',
                }}
              />
            )}
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
              <Typography variant="h6">{category}</Typography>
              <Typography variant="h4" color="primary.main">
                {inStock ? 'In Stock' : 'Out of Stock'}
              </Typography>
            </Stack>

            <Stack
              direction="column"
              justifyContent="space-between"
              alignItems="flex-end"
              sx={{ marginRight: '166px' }}
            >
              <Typography variant="h3">${price}</Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  paddingLeft: '237px',
                }}
              >
                <ButtonGroup
                  size="small"
                  sx={{
                    '& .MuiButton-root': {
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      minWidth: 0,
                      p: 0,
                      fontSize: '18px',
                    },
                  }}
                >
                  <Button
                    sx={{ backgroundColor: '#E8E8E8', color: '#CECECE' }}
                    onClick={() => handleDecrease(id, quantity)}
                  >
                    -
                  </Button>
                  <Typography sx={{ px: 1 }}>{quantity}</Typography>
                  <Button
                    sx={{ backgroundColor: '#FFD7D6', color: '#FE645E' }}
                    onClick={() => handleIncrease(id, quantity)}
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
                <Typography sx={{ color: '#8B8E93' }}>|</Typography>
                <DeleteIcon
                  aria-label="delete item"
                  fontSize="small"
                  sx={{ color: '#8B8E93', width: '24px', height: '24px' }}
                  onClick={() => handleDelete(id)}
                />
                <Typography>Delete</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Divider sx={{ margin: '60px 0' }} />
    </Stack>
  );
};
