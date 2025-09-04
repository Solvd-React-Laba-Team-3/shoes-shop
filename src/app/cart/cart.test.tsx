import { useCart } from '@/lib/hooks';
import { cartMock } from '@/testing/mocks';
import { render } from '@/testing/utils';
import { fireEvent, screen } from '@testing-library/react';
import Cart from './page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/cart',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('@/lib/hooks', () => ({
  ...jest.requireActual('@/lib/hooks'),
  useCart: jest.fn(),
}));

const increaseQuantityMock = jest.fn();
const decreaseQuantityMock = jest.fn();
const removeItemMock = jest.fn();
const getTotalMock = jest.fn().mockReturnValue(100);

describe('Cart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCart as jest.Mock).mockReturnValue({
      items: cartMock,
      subtotal: 100,
      isLoading: false,
      increaseQuantity: increaseQuantityMock,
      decreaseQuantity: decreaseQuantityMock,
      removeItem: removeItemMock,
      getTotal: getTotalMock,
    });
  });

  it('renders the page with cart item information', () => {
    render(<Cart />);
    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Test Shoe')).toBeInTheDocument();
  });

  it('calls increaseQuantity when increase button clicked', () => {
    render(<Cart />);
    const increaseButton = screen
      .getAllByRole('button')
      .find((button) => button.querySelector('[data-testid="AddIcon"]'));
    fireEvent.click(increaseButton!);
    expect(increaseQuantityMock).toHaveBeenCalledWith(1, 42, 2);
  });

  it('calls decreaseQuantity when decrease button is clicked', () => {
    render(<Cart />);

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

    render(<Cart />);

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

    render(<Cart />);
    expect(screen.getByTestId('cart-fallback')).toBeInTheDocument();
  });
});
