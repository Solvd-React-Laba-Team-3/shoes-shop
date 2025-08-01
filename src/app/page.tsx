import { getBrandsOptions } from '@/api/brand/getBrandsOptions';
import { getColorsOptions } from '@/api/color/getColorsOptions';
import { getGendersOptions } from '@/api/gender/getGendersOptions';
import { getProductsOptions } from '@/api/products/getProductsOptions';
import { getSizesOptions } from '@/api/size/getSizesOptions';
import { CheckoutForm } from '@/components/CheckoutForm';
import { Header } from '@/components/common/Header';
import { getQueryClient } from '@/lib/utils';
import { Box } from '@mui/material';

const queryClient = getQueryClient();
queryClient.prefetchQuery(getSizesOptions());
queryClient.prefetchQuery(getBrandsOptions());
queryClient.prefetchQuery(getGendersOptions());
queryClient.prefetchQuery(getColorsOptions());
queryClient.prefetchInfiniteQuery(getProductsOptions());

export default function Home() {
  return (
    <>
      <Header />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CheckoutForm></CheckoutForm>
      </Box>
    </>
  );
}
