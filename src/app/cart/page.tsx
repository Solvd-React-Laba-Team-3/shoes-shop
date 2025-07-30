import {
  Box,
  ButtonGroup,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Button } from '@/components/ui';
import DeleteIcon from '@mui/icons-material/Delete';
import { Accordion } from '@/components/ui';
import Image from 'next/image';
import { Header } from '@/components/common/Header';

const Cart = () => {
  return (
    <>
      <Header />
      <Box sx={{ padding: '80px 196px' }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
          Cart
        </Typography>

        <Stack direction="row" spacing={4} alignItems="flex-start">
          <Box sx={{ width: 223, height: 214, flexShrink: 0 }}>
            <Image src="/recovery.jpg" width={223} height={214} alt="image" />
          </Box>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              height: 214,
              flexGrow: 1,
              maxWidth: '963px',
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Nike Air Max 270
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#555' }}>
                Women&apos;s Shoes
              </Typography>
              <Typography
                sx={{ fontSize: '14px', color: '#FE645E', fontWeight: 500 }}
              >
                In Stock
              </Typography>
            </Stack>

            <Stack
              direction="column"
              justifyContent="space-between"
              alignItems="flex-end"
              sx={{ marginRight: '166px' }}
            >
              <Typography sx={{ fontWeight: 600 }}>$160</Typography>

              <Stack direction="row" spacing={1} alignItems="center">
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
            </Stack>
          </Stack>

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
    </>
  );
};

export default Cart;
