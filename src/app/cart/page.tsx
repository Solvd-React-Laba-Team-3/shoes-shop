'use client';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { Header } from '@/components/common/Header';
import { useEffect, useState } from 'react';
import { CartItem } from '@/components/CartItem/CartItem';
import { CartSummary } from '@/components/CartSummary';

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

type SummaryProps = {
  subtotal: number;
  // shipping: number;
  // tax: number;
  total: number;
};

const Cart = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [summary, setSummary] = useState<SummaryProps>({
    subtotal: 0,
    // shipping: 0,
    // tax: 0,
    total: 0,
  });

  useEffect(() => {
    fetch('https://shoes-shop-strapi.herokuapp.com/api/products')
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

  useEffect(() => {
    const subtotal = products.reduce((acc, product) => {
      const productQuantity = quantities[product.id] || 0;
      return acc + product.attributes.price * productQuantity;
    }, 0);

    // const shipping = subtotal > 0 ? 20 : 0;
    // const tax = 0;
    const total = subtotal;

    setSummary({ subtotal, total });
  }, [products, quantities]);

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
    setQuantities((prev) => ({
      ...prev,
      [id]: 0,
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

        <Stack>
          <Typography variant="h2" sx={{ marginBottom: '32px' }}>
            Summary
          </Typography>

          <Box>
            <Stack direction="column">
              <CartSummary
                subtotal={summary.subtotal}
                // shipping={summary.shipping}
                // tax={summary.tax}
                total={summary.total}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default Cart;
