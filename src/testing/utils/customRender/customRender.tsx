import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { StripeProvider } from '@/providers/StripeProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { QUERIES_STALE_TIME } from '@/constants/queriesStaleTime';
import { sessionMock } from '@/testing/mocks';

/**
 * Renders a component with a test query client
 * @param component - The component to render
 * @param renderOptions - The options to pass to the render function
 * @returns A rendered component
 */

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERIES_STALE_TIME,
        retry: false,
      },
    },
  });
};

interface CustomRenderOptions extends RenderOptions {
  isLoggedIn?: boolean;
}

const customRender = (
  component: ReactElement,
  { ...renderOptions }: CustomRenderOptions = {
    isLoggedIn: false,
  }
) => {
  const queryClient = createTestQueryClient();

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <StripeProvider>
          <ThemeProvider>
            <SessionProvider
              session={renderOptions.isLoggedIn ? sessionMock : null}
            >
              {children}
            </SessionProvider>
          </ThemeProvider>
        </StripeProvider>
      </QueryClientProvider>
    );
  };

  return render(component, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';

export { customRender as render, createTestQueryClient };
