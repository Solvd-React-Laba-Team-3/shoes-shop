import { fireEvent, screen, waitFor } from '@testing-library/react';
import { CartItem } from './CartItem';
import { useCart } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { render } from '@/testing/utils';

jest.mock('@/lib/hooks', () => ({
  useCart: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('CartItem', () => {
  const mockRemoveItem = jest.fn();
  const mockDecreaseQuantity = jest.fn();
  const mockIncreaseQuantity = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue({
      removeItem: mockRemoveItem,
      decreaseQuantity: mockDecreaseQuantity,
      increaseQuantity: mockIncreaseQuantity,
    });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  const renderCartItem = (props = {}) =>
    render(
      <CartItem
        id={37}
        name="Test Name"
        gender="Female"
        price={20}
        color="blue"
        size={35}
        quantity={1}
        image="https://fakestoreapi.com/img/test.jpg"
        {...props}
      />
    );
  it('renders cart elements without crashing', () => {
    renderCartItem();
    expect(screen.getByText('Test Name')).toBeInTheDocument();
    expect(screen.getByText("Female's Shoes")).toBeInTheDocument();
    expect(screen.getByText('Size: 35')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByAltText('product image')).toBeInTheDocument();
  });

  it('calls decreaseQuantity when decrease button is clicked', () => {
    renderCartItem();
    fireEvent.click(screen.getByRole('button', { name: 'decrease quantity' }));
    expect(mockDecreaseQuantity).toHaveBeenCalledWith(37, 35, 1);
  });

  it('calls increaseQuantity when increase button is clicked', () => {
    renderCartItem();

    fireEvent.click(screen.getByRole('button', { name: 'increase quantity' }));
    expect(mockIncreaseQuantity).toHaveBeenCalledWith(37, 35, 1);
  });

  it('navigates to product page when image is clicked', () => {
    renderCartItem();
    fireEvent.click(screen.getByAltText('product image'));
    expect(mockPush).toHaveBeenCalledWith('/products/37');
  });

  it('closes modal when onClose is triggered', async () => {
    renderCartItem();
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(
      screen.getByText(
        /Are you sure you want to remove this product from the cart/i
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() =>
      expect(
        screen.queryByText(
          /Are you sure you want to remove this product from the cart/i
        )
      ).not.toBeInTheDocument()
    );
  });

  it('calls removeItem when confirming delete', () => {
    renderCartItem();
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    fireEvent.click(screen.getByRole('button', { name: /remove/i }));
    expect(mockRemoveItem).toHaveBeenCalledWith(37, 35);
  });
});
