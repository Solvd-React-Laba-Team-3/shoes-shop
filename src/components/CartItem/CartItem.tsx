import { File } from '@/types/api/File';
import { Gender } from '@/types/Gender';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, ButtonGroup, Divider, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { FC } from 'react';
import { Button } from '../ui';

export interface CartItemProps {
  id: number;
  images: File[];
  name: string;
  price: number;
  quantity: number;
  gender: Gender;
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
}

export const CartItem: FC<CartItemProps> = ({
  images,
  name,
  gender,
  price,

  quantity,
  onIncrease,
  onDecrease,
  onDelete,
}) => {
  const imageSrc = images && images.length > 0 ? images[0].url : null;

  const updatedPrice = price * quantity;

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
              <Typography variant="h6">{gender.name}&apos;s Shoes </Typography>
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
                    onClick={onDecrease}
                  >
                    -
                  </Button>
                  <Typography sx={{ px: 1 }}>{quantity}</Typography>
                  <Button
                    sx={{ backgroundColor: '#FFD7D6', color: '#FE645E' }}
                    onClick={onIncrease}
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
                <Button
                  size="small"
                  sx={{
                    background: 'transparent',
                    color: (theme) => theme.palette.grey[400],
                    fontSize: '28px',
                    gap: 2,
                  }}
                  onClick={onDelete}
                >
                  <DeleteIcon
                    aria-label="delete item"
                    fontSize="small"
                    sx={{
                      width: '24px',
                      height: '24px',
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
  );
};
