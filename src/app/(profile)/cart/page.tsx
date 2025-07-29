import {
  Box,
  ButtonGroup,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Button } from '@/components/ui';
import DeleteIcon from '@mui/icons-material/Delete';
import { Accordion } from '@/components/ui';

const Cart = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Cart
      </Typography>

      <Stack direction="row" spacing={4} alignItems="flex-start">
        <Skeleton variant="rectangular" width={223} height={214} />

        <Box sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: '24px', width: '200px' }} />
          <Skeleton variant="text" sx={{ fontSize: '16px', width: '150px' }} />
          <Skeleton
            variant="text"
            sx={{ fontSize: '16px', width: '100px', color: '#FE645E' }}
          />

          <Box sx={{ minWidth: '160px' }}>
            <Skeleton
              variant="text"
              sx={{ fontSize: '24px', width: '60px', mb: 2 }}
            />

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="flex-end"
            >
              <ButtonGroup
                size="small"
                sx={{
                  mt: 1,
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
                <Button sx={{ backgroundColor: '#E8E8E8', color: '#CECECE' }}>
                  -
                </Button>
                <Typography sx={{ px: 1, fontWeight: 500 }}>0</Typography>
                <Button sx={{ backgroundColor: '#FFD7D6', color: '#FE645E' }}>
                  +
                </Button>
              </ButtonGroup>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', fontSize: '14px' }}
              >
                Quantity
              </Typography>
              <IconButton size="small" sx={{ color: '#BDBDBD' }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Box>

        {/* <Box sx={{ minWidth: '160px' }}>
          <Skeleton
            variant="text"
            sx={{ fontSize: '24px', width: '60px', mb: 2 }}
          />

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="flex-end"
          >
            <ButtonGroup
              size="small"
              sx={{
                mt: 1,
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
              <Button sx={{ backgroundColor: '#E8E8E8', color: '#CECECE' }}>
                -
              </Button>
              <Typography sx={{ px: 1, fontWeight: 500 }}>0</Typography>
              <Button sx={{ backgroundColor: '#FFD7D6', color: '#FE645E' }}>
                +
              </Button>
            </ButtonGroup>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', fontSize: '14px' }}
            >
              Quantity
            </Typography>
            <IconButton size="small" sx={{ color: '#BDBDBD' }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box> */}

        <Box>
          <Typography>Summary</Typography>
          <Accordion label="Do you have a promocode?">
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                size="small"
                placeholder="Enter promo code"
                sx={{ flex: 1 }}
              />
              <Button variant="contained" color="primary">
                Apply
              </Button>
            </Box>
          </Accordion>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Subtotal</Typography>
            <Typography>$410</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Shipping</Typography>
            <Typography>$20</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Tax</Typography>
            <Typography>$0</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Total</Typography>
            <Typography>$430</Typography>
          </Box>

          <Button>Checkout</Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default Cart;
