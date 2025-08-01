import {
  Box,
  Divider,
  GlobalStyles,
  TextField,
  Typography,
} from '@mui/material';
import { Accordion } from '../ui/Accordion/Accordion';
import { Button } from '../ui/Button/Button';
type CartSummaryProps = {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shipping,
  tax,
  total,
}) => {
  return (
    <Box sx={{ marginLeft: '166px' }}>
      <GlobalStyles
        styles={{
          '.MuiAccordionSummary-root': {
            width: 'auto !important',
          },
        }}
      />
      {/* <Typography variant="h2" sx={{ marginBottom: '32px' }}>
        Summary
      </Typography> */}
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
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          {subtotal > 0 ? 'Subtotal' : 'Total'}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          ${subtotal}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '20px 0',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          {shipping > 0 ? 'Shipping' : 'Delivery'}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          ${shipping}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          {tax > 0 ? 'Tax' : 'Discount'}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          ${tax}
        </Typography>
      </Box>

      <Divider sx={{ marginTop: '56px' }} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '20px 0',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          {total > 0 ? 'Total' : 'Final Price'}
        </Typography>

        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          ${total}
        </Typography>
      </Box>
      <Divider sx={{ marginBottom: '113px' }} />

      <Button>Checkout</Button>
    </Box>
  );
};
