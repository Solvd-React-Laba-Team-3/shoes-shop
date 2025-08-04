import { getBrandsOptions } from '@/api/brand/getBrandsOptions';
import { getColorsOptions } from '@/api/color/getColorsOptions';
import { getGendersOptions } from '@/api/gender/getGendersOptions';
import { getProductsOptions } from '@/api/products/getProductsOptions';
import { getSizesOptions } from '@/api/size/getSizesOptions';
import { CheckoutForm } from '@/components/CheckoutForm';
import { Header } from '@/components/common/Header';
import { getQueryClient } from '@/lib/utils';
import StripeProvider from '@/providers/StripeProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/constants/authConfig';
import { Box } from '@mui/material';
import { CartProduct } from '@/types/CartProduct';

const queryClient = getQueryClient();
queryClient.prefetchQuery(getSizesOptions());
queryClient.prefetchQuery(getBrandsOptions());
queryClient.prefetchQuery(getGendersOptions());
queryClient.prefetchQuery(getColorsOptions());
queryClient.prefetchInfiniteQuery(getProductsOptions());

const products: CartProduct[] = [
  {
    id: 101,
    name: 'Zapatilla Urbana Flex',
    size: 42,
    gender: 'male',
    price: 17999,
    quantity: 1,
    image: 'https://example.com/images/zapatilla-flex.jpg',
    color: 'Negro',
  },
  {
    id: 102,
    name: 'Campera Impermeable Pro',
    size: 38,
    gender: 'female',
    price: 32999,
    quantity: 1,
    image: 'https://example.com/images/campera-pro.jpg',
    color: 'Azul',
  },
  {
    id: 103,
    name: 'Remera DryFit Training',
    size: 44,
    gender: 'unisex',
    price: 9999,
    quantity: 2,
    image: 'https://example.com/images/remera-training.jpg',
    color: 'Rojo',
  },
  {
    id: 104,
    name: 'Short Deportivo Runner',
    size: 40,
    gender: 'male',
    price: 8499,
    quantity: 1,
    image: 'https://example.com/images/short-runner.jpg',
    color: 'Gris',
  },
  {
    id: 105,
    name: 'Calza Compresión Alta',
    size: 36,
    gender: 'female',
    price: 12999,
    quantity: 1,
    image: 'https://example.com/images/calza-compresion.jpg',
    color: 'Negro',
  },
];

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/orders?userId=${session.user.id}`,
      { cache: 'no-store' }
    );
    const { orders } = await res.json();

    console.log('ORDERS FROM STRIPE:', orders);
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          width: '100%',
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <StripeProvider>
          <CheckoutForm
            amount={500}
            discountCode="free10"
            discountAmount={18.5}
            products={products}
          />
        </StripeProvider>
      </Box>
    </>
  );
}
