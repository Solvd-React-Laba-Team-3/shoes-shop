import { getUserProductsOptions } from '@/api/products/getUserProductsOptions';
import { ProfileProductsFallback } from '@/components/common/ProfileProductsFallback';
import { Hydrate } from '@/providers/Hydrate';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

interface ProductsLayoutProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export default async function ProductsLayout({
  children,
}: ProductsLayoutProps) {
  const session = await getServerSession();

  queryClient.prefetchQuery(
    getUserProductsOptions(session?.user.accessToken || '')
  );

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Suspense fallback={<ProfileProductsFallback />}>{children}</Suspense>
    </Hydrate>
  );
}
