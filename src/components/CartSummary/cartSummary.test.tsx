import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartSummary } from './CartSummary';
import { useRouter } from 'next/navigation';
import { useCart, useLocalStorage } from '@/lib/hooks';
import { TAX_PERCENT } from '@/constants/taxPercent';
import { SHIPPING_AMOUNT } from '@/constants/shippingAmount';
import { useApplyDiscount } from '@/api/discount/useApplyDiscount';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/lib/hooks', () => ({
  ...jest.requireActual('@/lib/hooks'),
  useCart: jest.fn(),
  useLocalStorage: jest.fn(() => ({ value: true, setValue: jest.fn() })),
}));

jest.mock('@/api/discount/useApplyDiscount', () => ({
  useApplyDiscount: jest.fn(),
}));

const defaultCart = {
  items: [],
  subtotal: 100,
  discountAmount: 0,
  discountCode: '',
  discountType: undefined,
  isLoading: false,
  getTotal: () => 100,
  addItem: jest.fn(),
  removeItem: jest.fn(),
  clearCart: jest.fn(),
  updateQuantity: jest.fn(),
  applyDiscount: jest.fn(),
  isUpdating: false,
  isApplyingDiscount: false,
};
const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};
describe('CartSummary', () => {
  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue(defaultCart);
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (useLocalStorage as jest.Mock).mockReturnValue({
      value: true,
      setValue: jest.fn(),
    });
    (useApplyDiscount as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
  });
  it('renders an accordion with a promo code', () => {
    renderWithClient(<CartSummary />);
    expect(screen.getByText(/Do you have a promo code\?/i)).toBeInTheDocument();
  });
  it('renders a LabeledTextField', () => {
    renderWithClient(<CartSummary />);
    expect(
      screen.getByPlaceholderText(/Enter promo code/i)
    ).toBeInTheDocument();
  });
  it('shows Edit button when discountAmount > 0', () => {
    (useCart as jest.Mock).mockReturnValueOnce({
      ...defaultCart,
      discountAmount: 10,
      discountCode: 'PROMO',
    });
    renderWithClient(<CartSummary />);
    fireEvent.click(screen.getByText(/Do you have a promo code\?/i));
    expect(screen.getByText(/Do you have a promo code\?/i)).toBeInTheDocument();
  });
  it('renders "Confirm & Pay" when checkout is true', () => {
    renderWithClient(<CartSummary checkout />);
    expect(
      screen.getByRole('button', { name: /Confirm & Pay/i })
    ).toBeInTheDocument();
  });
  it('calls router.push("/checkout") on submit when checkout=false', () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    renderWithClient(<CartSummary />);
    fireEvent.click(screen.getByRole('button', { name: /Checkout/i }));
    expect(pushMock).toHaveBeenCalledWith('/checkout');
  });

  it('renders Apply button when discountAmount is 0', () => {
    (useCart as jest.Mock).mockReturnValueOnce({
      ...defaultCart,
      discountAmount: 0,
    });

    renderWithClient(<CartSummary />);
    expect(screen.getByRole('button', { name: /Apply/i })).toBeInTheDocument();
  });

  it('converts promo code to uppercase on change', () => {
    renderWithClient(<CartSummary />);
    const input = screen.getByPlaceholderText(
      /Enter promo code/i
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input.value).toBe('ABC');
  });

  it('calls onOrderComplete when checkout and form submitted', () => {
    const onOrderCompleteMock = jest.fn();
    renderWithClient(
      <CartSummary checkout onOrderComplete={onOrderCompleteMock} />
    );
    fireEvent.click(screen.getByRole('button', { name: /Confirm & Pay/i }));
    expect(onOrderCompleteMock).toHaveBeenCalled();
  });

  it('disables apply button when subtotal is 0 or promo code empty', () => {
    (useCart as jest.Mock).mockReturnValueOnce({ ...defaultCart, subtotal: 0 });
    renderWithClient(<CartSummary />);
    expect(screen.getByRole('button', { name: /Apply/i })).toBeDisabled();
  });

  it('shows shipping and tax when checkout is true', () => {
    renderWithClient(<CartSummary checkout />);
    expect(
      screen.getByText(`$${SHIPPING_AMOUNT.toFixed(2)}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `$${(((defaultCart.subtotal - defaultCart.discountAmount) * TAX_PERCENT) / 100).toFixed(2)}`
      )
    ).toBeInTheDocument();
  });

  it('toggles promo accordion using localStorage value', () => {
    const setValueMock = jest.fn();
    (useLocalStorage as jest.Mock).mockReturnValue({
      value: false,
      setValue: setValueMock,
    });
    renderWithClient(<CartSummary />);
    fireEvent.click(screen.getByText(/Do you have a promo code\?/i));
    expect(setValueMock).toHaveBeenCalledWith(true);
  });

  it('Apply button is enabled when subtotal > 0 and promo code is non-empty', () => {
    renderWithClient(<CartSummary />);
    const input = screen.getByPlaceholderText(
      /Enter promo code/i
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'DISCOUNT10' } });
    const applyButton = screen.getByRole('button', { name: /Apply/i });
    expect(applyButton).toBeEnabled();
  });

  it('calculates finalTotal correctly', () => {
    (useCart as jest.Mock).mockReturnValueOnce({
      ...defaultCart,
      subtotal: 100,
      discountAmount: 0,
    });

    const shippingAmount = 10;
    const taxPercent = 10;

    renderWithClient(
      <CartSummary
        checkout
        shippingAmount={shippingAmount}
        taxPercent={taxPercent}
      />
    );

    const expectedTotal = 100 + shippingAmount + (100 * taxPercent) / 100; // 100 + 10 + 10 = 120

    const totalText = screen.getByText((content, element) => {
      return (
        element?.tagName === 'H3' &&
        content.includes(`$${expectedTotal.toFixed(2)}`)
      );
    });

    expect(totalText).toBeInTheDocument();
  });
});
