import { useCart } from '@/lib/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import Cart from './page';

jest.mock('@/lib/hooks/useCart/useCart');
jest.mock('@/components/common/CartFallback', () => ({
  CartFallback: jest.fn(() => <div data-testid="cart-fallback" />),
}));

const increaseQuantityMock = jest.fn();
const decreaseQuantityMock = jest.fn();
const removeItemMock = jest.fn();
const getTotalMock = jest.fn().mockReturnValue(100);

describe('Cart', () => {
  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue({
      items: [
        {
          id: 1,
          quantity: 2,
          gender: 'male',
          image: '/img1.jpg',
          size: 42,
          name: 'Test Shoe',
          price: 50,
        },
      ],
      subtotal: 100,
      isLoading: false,
      increaseQuantity: increaseQuantityMock,
      decreaseQuantity: decreaseQuantityMock,
      removeItem: removeItemMock,
      getTotal: getTotalMock,
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
    expect(screen.getByText('Test Shoe')).toBeInTheDocument();
  });

  it('calls increaseQuantity when increase button clicked', () => {
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
    const increaseButton = screen
      .getAllByRole('button')
      .find((button) => button.querySelector('[data-testid="AddIcon"]'));
    fireEvent.click(increaseButton!);
    expect(increaseQuantityMock).toHaveBeenCalledWith(1, 42, 2);
  });

  it('calls decreaseQuantity when decrease button is clicked', () => {
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

    const decreaseButton = screen
      .getAllByRole('button')
      .find((button) => button.querySelector('[data-testid="RemoveIcon"]'));
    fireEvent.click(decreaseButton!);
    expect(decreaseQuantityMock).toHaveBeenCalledWith(1, 42, 2);
  });

  it('renders "Your cart is empty." when there are no items', () => {
    (useCart as jest.Mock).mockReturnValueOnce({
      items: [],
      subtotal: 0,
      isLoading: false,
      increaseQuantity: increaseQuantityMock,
      decreaseQuantity: decreaseQuantityMock,
      removeItem: removeItemMock,
    });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <SessionProvider session={null}>
        <QueryClientProvider client={queryClient}>
          <Cart />
        </QueryClientProvider>
      </SessionProvider>
    );

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('renders CartFallback when cart is loading', () => {
    (useCart as jest.Mock).mockReturnValueOnce({
      items: [],
      subtotal: 0,
      isLoading: true,
      increaseQuantity: increaseQuantityMock,
      decreaseQuantity: decreaseQuantityMock,
      removeItem: removeItemMock,
    });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <SessionProvider session={null}>
        <QueryClientProvider client={queryClient}>
          <Cart />
        </QueryClientProvider>
      </SessionProvider>
    );
    expect(screen.getByTestId('cart-fallback')).toBeInTheDocument();
  });
});
