import {
  Box,
  Divider,
  ButtonGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Button } from '@/components/ui';
import DeleteIcon from '@mui/icons-material/Delete';
import { Accordion } from '@/components/ui';
import Image from 'next/image';
import { Header } from '@/components/common/Header';
import { GlobalStyles } from '@mui/material';

const Cart = () => {
  return (
    <>
      <Header />
      <Box sx={{ padding: '80px 196px' }}>
        <Stack
          direction="row"
          alignItems="baseline"
          justifyContent="space-between"
          sx={{ maxWidth: '85%' }}
        >
          <Typography variant="h2" sx={{ mb: 4, fontWeight: 600 }}>
            Cart
          </Typography>

          <Typography variant="h2">Summary</Typography>
        </Stack>

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
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="h3">Nike Air Max 270</Typography>
              <Typography variant="h6">Women&apos;s Shoes</Typography>
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
              <Typography variant="h3">$160</Typography>

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
                  <Typography sx={{ px: 1 }}>0</Typography>
                  <Button sx={{ backgroundColor: '#FFD7D6', color: '#FE645E' }}>
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
                  fontSize="small"
                  sx={{ color: '#8B8E93', width: '24px', height: '24px' }}
                />
                <Typography>Delete</Typography>
              </Stack>
            </Stack>
          </Stack>

          <Box>
            <GlobalStyles
              styles={{
                '.MuiAccordionSummary-root': {
                  width: 'auto !important',
                },
              }}
            />
            <Accordion
              label={
                <Typography
                  sx={{
                    fontSize: '20px',
                  }}
                >
                  Do you have a promocode?
                </Typography>
              }
            >
              <Box>
                <TextField
                  size="small"
                  sx={{
                    width: '50%',
                    height: '40px',
                    marginRight: '10px',
                    '& .MuiInputBase-root': {
                      fontSize: '16px',
                    },
                  }}
                  placeholder="Enter promo code"
                />
                <Button variant="contained" color="primary" size="small">
                  Apply
                </Button>
              </Box>
            </Accordion>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '38px 0 20px',
              }}
            >
              <Typography>Subtotal</Typography>
              <Typography>$410</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '20px 0',
              }}
            >
              <Typography>Shipping</Typography>
              <Typography>$20</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Tax</Typography>
              <Typography>$0</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '56px 0 113px',
              }}
            >
              <Typography>Total</Typography>
              <Typography>$430</Typography>
            </Box>

            <Button>Checkout</Button>
          </Box>
        </Stack>

        <Divider />
      </Box>
    </>
  );
};

export default Cart;
