import { getBrandsOptions } from '@/api/brand/getBrandsOptions';
import { getColorsOptions } from '@/api/color/getColorsOptions';
import { getGendersOptions } from '@/api/gender/getGendersOptions';
import { getProductsOptions } from '@/api/products/getProductsOptions';
import { getSizesOptions } from '@/api/size/getSizesOptions';

import { Header } from '@/components/common/Header';
import { FiltersWrapper } from '@/components/FiltersWrapper/';
import { ProductsContainer } from '@/components/ProductsContainer/ProductsContainer';
import { getQueryClient } from '@/lib/utils';
import { Hydrate } from '@/providers/Hydrate';
import Box from '@mui/material/Box';
import { dehydrate } from '@tanstack/react-query';

const queryClient = getQueryClient();
queryClient.prefetchQuery(getSizesOptions());
queryClient.prefetchQuery(getBrandsOptions());
queryClient.prefetchQuery(getGendersOptions());
queryClient.prefetchQuery(getColorsOptions());
queryClient.prefetchInfiniteQuery(getProductsOptions({}));

export default function Home() {
  return (
    <>
      <Header />
      <Hydrate state={dehydrate(queryClient)}>
        <Box sx={{ display: 'flex' }}>
          <FiltersWrapper />
          <ProductsContainer />
        </Box>
      </Hydrate>
    </>
  );
}
