import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/utils';

export const createWrapper = () => {
  const queryClient = getQueryClient();
  queryClient.setDefaultOptions({
    queries: { retry: false },
    mutations: { retry: false },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = 'QueryClientTestWrapper';

  return Wrapper;
};
