'use client';
import {
  Box,
  Divider,
  // ButtonGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Button } from '@/components/ui';
// import DeleteIcon from '@mui/icons-material/Delete';
import { Accordion } from '@/components/ui';
// import Image from 'next/image';
import { Header } from '@/components/common/Header';
import { GlobalStyles } from '@mui/material';
import { useEffect, useState } from 'react';
import { CartItem } from '@/components/CartItem/CartItem';

type Product = {
  id: number;
  url: string;
  attributes: {
    name: string;
    description: string;
    price: number;
    teamName: string;
  };
};

const Cart = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    fetch('https://shoes-shop-strapi.herokuapp.com/api/products') // заменить на реальный URL
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data);

        const initialQuantities: { [key: number]: number } = {};
        data.data.forEach((item: Product) => {
          initialQuantities[item.id] = 0;
        });
        setQuantities(initialQuantities);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleIncrease = (id: number) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleDecrease = (id: number) => {
    setQuantities((prev) => {
      if (prev[id] <= 1) return prev;
      return { ...prev, [id]: prev[id] - 1 };
    });
  };

  const handleDelete = (id: number) => {
    // setProducts((prev) => prev.filter((item) => item.id !== id));
    setQuantities((prev) => ({
      ...prev,
      [id]: 0,
      // const newQuantities = { ...prev };
      // delete newQuantities[id];
      // return newQuantities;
    }));
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '80px 196px',
        }}
      >
        {/* cart part */}

        <Stack>
          <Typography variant="h2" sx={{ marginBottom: '32px' }}>
            Cart
          </Typography>
          <Box>
            <Stack direction="column" spacing={4} alignItems="stretch">
              {products.map((product) => (
                <CartItem
                  key={product.id}
                  images={product.url}
                  name={product.attributes.name}
                  category={product.attributes.teamName}
                  inStock={true}
                  price={product.attributes.price}
                  quantity={quantities[product.id] || 0}
                  onIncrease={() => handleIncrease(product.id)}
                  onDecrease={() => handleDecrease(product.id)}
                  onDelete={() => handleDelete(product.id)}
                />
              ))}
            </Stack>
          </Box>

          <Divider sx={{ margin: '60px 0' }} />
        </Stack>
        {/* summary part */}
        <Box sx={{ marginLeft: '166px' }}>
          <GlobalStyles
            styles={{
              '.MuiAccordionSummary-root': {
                width: 'auto !important',
              },
            }}
          />
          <Typography variant="h2" sx={{ marginBottom: '32px' }}>
            Summary
          </Typography>
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
              Subtotal
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 400 }}>
              $410
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
              Shipping
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 400 }}>
              $20
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h3" sx={{ fontWeight: 400 }}>
              Tax
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 400 }}>
              $0
            </Typography>
          </Box>

          <Divider sx={{ marginTop: '56px' }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '20px',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              Total
            </Typography>

            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              $430
            </Typography>
          </Box>
          <Divider sx={{ marginBottom: '113px' }} />

          <Button>Checkout</Button>
        </Box>
      </Box>
    </>
  );
};

export default Cart;
