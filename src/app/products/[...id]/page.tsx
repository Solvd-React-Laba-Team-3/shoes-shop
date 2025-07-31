import { getProductOptions } from '@/api/products/getProductOptions';
import { getSizesOptions } from '@/api/size/getSizesOptions';
import { ProductDetails } from '@/components/ProductDetails';
import { getQueryClient } from '@/lib/utils';
import { Hydrate } from '@/providers/Hydrate';
import { dehydrate } from '@tanstack/react-query';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getProductOptions(productId));
  await queryClient.prefetchQuery(getSizesOptions());
  return (
    <Hydrate state={dehydrate(queryClient)}>
      <ProductDetails productId={productId} />
    </Hydrate>
  );
}
