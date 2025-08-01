import { getBrandsOptions } from '@/api/brand/getBrandsOptions';
import { getColorsOptions } from '@/api/color/getColorsOptions';
import { getGendersOptions } from '@/api/gender/getGendersOptions';
import { getProductsOptions } from '@/api/products/getProductsOptions';
import { getSizesOptions } from '@/api/size/getSizesOptions';
import { Catalog } from '@/components/common/Catalog';
import { Header } from '@/components/common/Header';
import { getQueryClient } from '@/lib/utils';
import { Hydrate } from '@/providers/Hydrate';
import { dehydrate } from '@tanstack/react-query';

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
      <Hydrate state={dehydrate(queryClient)}>
        <Catalog />
      </Hydrate>
    </>
  );
}
