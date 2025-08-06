import { render, screen, fireEvent } from '@testing-library/react';
import Cart from './page';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCart } from '@/lib/hooks';

jest.mock('@/lib/hooks/useCart/useCart');

describe('Cart', () => {
  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue({
      items: [
        { id: 1, quantity: 2, gender: 'male', images: ['img1.jpg'] },
        { id: 2, quantity: 0, gender: 'female', images: [] },
      ],
      subtotal: 100,
      handleIncrease: jest.fn(),
      handleDecrease: jest.fn(),
      handleDelete: jest.fn(),
    });
  });
  it('renders the page with cart item information', () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    render(
      <SessionProvider session={null}>
        <QueryClientProvider client={queryClient}>
          <Cart />
        </QueryClientProvider>
      </SessionProvider>
    );

    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });

  it('calls handleIncrease when increase button clicked', () => {
    const { handleIncrease } = useCart();
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    render(
      <SessionProvider session={null}>
        <QueryClientProvider client={queryClient}>
          <Cart />
        </QueryClientProvider>
      </SessionProvider>
    );

    const increaseButtons = screen.getAllByRole('button', {
      name: /\+/i,
    });
    fireEvent.click(increaseButtons[0]);
    expect(handleIncrease).toHaveBeenCalledWith(1, 2);
  });

  it('calls handleDecrease when decrease button is clicked', () => {
    const { handleDecrease } = useCart();
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    render(
      <SessionProvider session={null}>
        <QueryClientProvider client={queryClient}>
          <Cart />
        </QueryClientProvider>
      </SessionProvider>
    );

    const decreaseButtons = screen.getAllByRole('button', {
      name: /\-/i,
    });

    fireEvent.click(decreaseButtons[0]);
    expect(handleDecrease).toHaveBeenCalledWith(1, 2);
  });
});
