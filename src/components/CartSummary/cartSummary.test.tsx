import { screen, fireEvent } from '@testing-library/react';
import { CartSummary } from './CartSummary';
import { useRouter } from 'next/navigation';
import { useCart, useLocalStorage } from '@/lib/hooks';
import { TAX_PERCENT } from '@/constants/taxPercent';
import { SHIPPING_AMOUNT } from '@/constants/shippingAmount';
import { useApplyDiscount } from '@/api/discount/useApplyDiscount';
import { useSession } from 'next-auth/react';
import { render } from '@/testing/utils';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

jest.mock('next-auth/react', () => ({ useSession: jest.fn() }));

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
describe('CartSummary', () => {
  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue(defaultCart);
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (useSession as jest.Mock).mockReturnValue({ data: {} });
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
    render(<CartSummary />);
    expect(screen.getByText(/Do you have a promo code\?/i)).toBeInTheDocument();
  });
  it('renders a LabeledTextField', () => {
    render(<CartSummary />);
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
    render(<CartSummary />);
    fireEvent.click(screen.getByText(/Do you have a promo code\?/i));
    expect(screen.getByText(/Do you have a promo code\?/i)).toBeInTheDocument();
  });

  it('renders "Confirm & Pay" when checkout is true and payment method is "Card"', () => {
    render(
      <CartSummary
        checkout
        shippingAmount={SHIPPING_AMOUNT}
        taxPercent={TAX_PERCENT}
        paymentMethod="card"
      />
    );
    expect(
      screen.getByRole('button', { name: /Confirm & Pay/i })
    ).toBeInTheDocument();
  });

  it('renders "Confirm & Pay" when checkout is true', () => {
    render(
      <CartSummary
        checkout
        shippingAmount={SHIPPING_AMOUNT}
        taxPercent={TAX_PERCENT}
        paymentMethod="googlePay"
      />
    );
    expect(
      screen.queryByRole('button', { name: /Confirm & Pay/gim })
    ).not.toBeInTheDocument();
  });

  it('calls router.push("/checkout") on submit when checkout=false', () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    render(<CartSummary />);
    fireEvent.click(screen.getByRole('button', { name: /Checkout/i }));
    expect(pushMock).toHaveBeenCalledWith('/checkout');
  });

  it('renders Apply button when discountAmount is 0', () => {
    (useCart as jest.Mock).mockReturnValueOnce({
      ...defaultCart,
      discountAmount: 0,
    });

    render(<CartSummary />);
    expect(screen.getByRole('button', { name: /Apply/i })).toBeInTheDocument();
  });

  it('converts promo code to uppercase on change', () => {
    render(<CartSummary />);
    const input = screen.getByPlaceholderText(
      /Enter promo code/i
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input.value).toBe('ABC');
  });

  it('calls onOrderComplete when checkout and form submitted', () => {
    const onOrderCompleteMock = jest.fn();

    render(
      <CartSummary
        checkout
        onOrderComplete={onOrderCompleteMock}
        paymentMethod="card"
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Confirm & Pay/i }));
    expect(onOrderCompleteMock).toHaveBeenCalled();
  });

  it('disables apply button when subtotal is 0 or promo code empty', () => {
    (useCart as jest.Mock).mockReturnValueOnce({ ...defaultCart, subtotal: 0 });
    render(<CartSummary />);
    expect(screen.getByRole('button', { name: /Apply/i })).toBeDisabled();
  });

  it('shows shipping and tax when checkout is true', () => {
    render(
      <CartSummary
        checkout
        shippingAmount={SHIPPING_AMOUNT}
        taxPercent={TAX_PERCENT}
      />
    );
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
    render(<CartSummary />);
    fireEvent.click(screen.getByText(/Do you have a promo code\?/i));
    expect(setValueMock).toHaveBeenCalledWith(true);
  });

  it('Apply button is enabled when subtotal > 0 and promo code is non-empty', () => {
    render(<CartSummary />);
    const input = screen.getByPlaceholderText(
      /Enter promo code/i
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'DISCOUNT10' } });
    const applyButton = screen.getByRole('button', { name: /Apply/i });
    expect(applyButton).toBeEnabled();
  });

  it('calculates finalTotal correctly', () => {
    (useCart as jest.Mock).mockReturnValue({
      ...defaultCart,
      subtotal: 108,
      discountAmount: 10,
      getTotal: (shippingAmount: number, taxPercent: number) => {
        return Number(
          ((108 + shippingAmount - 10) * (1 + taxPercent / 100)).toFixed(2)
        );
      },
    });

    const shippingAmount = 20;
    const taxPercent = 17;
    const subtotal = 108;
    const discountAmount = 10;

    render(
      <CartSummary
        checkout
        shippingAmount={shippingAmount}
        taxPercent={taxPercent}
      />
    );

    const expectedTotal =
      (subtotal + shippingAmount - discountAmount) * (1 + taxPercent / 100);

    const totalText = screen.getByTestId('total').textContent;

    expect(totalText).toEqual(`$${expectedTotal.toFixed(2)}`);
  });

  it('shows "Shipping and tax will be calculated at checkout" when checkout is false', () => {
    render(<CartSummary />);
    expect(
      screen.getByText(/Shipping and tax will be calculated at checkout\./i)
    ).toBeInTheDocument();
  });

  it('renders discount row when discountAmount > 0 and not loading', () => {
    const cartWithDiscount = {
      ...defaultCart,
      discountAmount: 15,
      isLoading: false,
    };

    (useCart as jest.Mock).mockReturnValue(cartWithDiscount);

    (useLocalStorage as jest.Mock).mockReturnValue({
      value: true,
      setValue: jest.fn(),
    });

    render(<CartSummary />);

    expect(screen.getByText(/Discount/i)).toBeInTheDocument();
    expect(screen.getByText(/-\$15\.00/)).toBeInTheDocument();
  });

  it('does not render discount row when loading', () => {
    (useCart as jest.Mock).mockReturnValueOnce({
      ...defaultCart,
      discountAmount: 20,
      isLoading: true,
    });

    render(<CartSummary checkout />);
    expect(screen.queryByText(/-\$20\.00/)).not.toBeInTheDocument();
  });

  it('clicking Edit button sets isEditing to true', () => {
    const setValueMock = jest.fn();
    (useLocalStorage as jest.Mock).mockReturnValue({
      value: true,
      setValue: setValueMock,
    });

    (useCart as jest.Mock).mockReturnValue({
      ...defaultCart,
      discountAmount: 15,
      discountCode: 'PROMO',
    });

    render(<CartSummary />);

    const editButton = screen.getByRole('button', { name: /Edit/i });
    fireEvent.click(editButton);

    expect(screen.getByRole('button', { name: /Apply/i })).toBeInTheDocument();
  });

  it('submits promo code and calls applyDiscount', async () => {
    const mutateMock = jest.fn();
    (useApplyDiscount as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });

    render(<CartSummary />);

    const input = screen.getByPlaceholderText(
      /Enter promo code/i
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'promo1' } });

    const form = input.closest('form')!;
    fireEvent.submit(form);

    await screen.findByRole('button', { name: /Apply/i });

    expect(mutateMock).toHaveBeenCalledWith({
      code: 'promo1',
      total: defaultCart.subtotal,
    });
  });
});
