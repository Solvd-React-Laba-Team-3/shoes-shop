import { render, screen, fireEvent } from '@testing-library/react';
import { CheckoutForm } from './CheckoutForm';
import { useFormContext, useWatch } from 'react-hook-form';
import { shippingCountries } from '@/constants/shippingCountries';
import { CardElement } from '@stripe/react-stripe-js';

jest.mock('react-hook-form', () => ({
  useFormContext: jest.fn(),
  useWatch: jest.fn(),
  Controller: jest.fn(({ render }) =>
    render({ field: { value: 'card', onChange: jest.fn() } })
  ),
}));

jest.mock('@stripe/react-stripe-js', () => ({
  CardElement: jest.fn(() => <div data-testid="card-element" />),
}));

jest.mock('../ui', () => ({
  LabeledTextfield: jest.fn(({ label, errorMessage }) => (
    <div data-testid={`textfield-${label}`}>
      <span>{label}</span>
      {errorMessage && <span>{errorMessage}</span>}
    </div>
  )),
  FormErrorMessage: jest.fn(({ message }) =>
    message ? <div>{message}</div> : null
  ),
  Link: jest.fn(({ children }) => <a href="/cart">{children}</a>),
  Select: jest.fn(({ children }) => <select>{children}</select>),
  MenuItem: jest.fn(({ children }) => <option>{children}</option>),
}));

jest.mock('./checkoutForm.styles', () => ({
  StyledChevronButton: jest.fn(({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  )),
  StyledPaymentMethod: jest.fn(({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  )),
}));

jest.mock('../ProductForm/productForm.styles', () => ({
  StyledInputLabel: jest.fn(({ children }) => <label>{children}</label>),
}));

jest.mock('@mui/icons-material/Payment', () => {
  const PaymentIcon = () => <span>PaymentIcon</span>;
  PaymentIcon.displayName = 'PaymentIcon';
  return PaymentIcon;
});

jest.mock('@mui/icons-material/Google', () => {
  const GoogleIcon = () => <span>GoogleIcon</span>;
  GoogleIcon.displayName = 'GoogleIcon';
  return GoogleIcon;
});

jest.mock('@mui/icons-material/AttachMoney', () => {
  const MoneyIcon = () => <span>MoneyIcon</span>;
  MoneyIcon.displayName = 'MoneyIcon';
  return MoneyIcon;
});

jest.mock('@mui/icons-material/Schedule', () => {
  const ScheduleIcon = () => <span>ScheduleIcon</span>;
  ScheduleIcon.displayName = 'ScheduleIcon';
  return ScheduleIcon;
});

jest.mock('@mui/icons-material/KeyboardArrowDown', () => {
  const DownIcon = () => <span>DownIcon</span>;
  DownIcon.displayName = 'DownIcon';
  return DownIcon;
});

jest.mock('@mui/icons-material/KeyboardArrowUp', () => {
  const UpIcon = () => <span>UpIcon</span>;
  UpIcon.displayName = 'UpIcon';
  return UpIcon;
});

describe('CheckoutForm', () => {
  const mockSetCardError = jest.fn();

  const defaultFormContext = {
    register: jest.fn(),
    control: {},
    formState: { errors: {} },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useFormContext as jest.Mock).mockReturnValue(defaultFormContext);
    (useWatch as jest.Mock).mockReturnValue('card');
  });

  it('renders main sections', () => {
    render(
      <CheckoutForm
        error={false}
        cardError={null}
        setCardError={mockSetCardError}
      />
    );
    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getByText('Personal info')).toBeInTheDocument();
    expect(screen.getByText('Shipping info')).toBeInTheDocument();
    expect(screen.getByText('Payment info')).toBeInTheDocument();
  });

  it('renders all text fields', () => {
    render(
      <CheckoutForm
        error={false}
        cardError={null}
        setCardError={mockSetCardError}
      />
    );
    [
      'Name',
      'Surname',
      'Email',
      'Phone number',
      'City',
      'State',
      'Zip Code',
      'Address',
    ].forEach((label) => {
      expect(screen.getByTestId(`textfield-${label}`)).toBeInTheDocument();
    });
  });

  it('renders country select with shipping countries', () => {
    render(
      <CheckoutForm
        error={false}
        cardError={null}
        setCardError={mockSetCardError}
      />
    );
    shippingCountries.forEach((country) => {
      expect(screen.getByText(country)).toBeInTheDocument();
    });
  });

  it('renders payment methods and chevron toggle', () => {
    render(
      <CheckoutForm
        error={false}
        cardError={null}
        setCardError={mockSetCardError}
      />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(5);
    fireEvent.click(buttons[buttons.length - 1]);
    fireEvent.click(buttons[0]);
  });

  it('renders CardElement when paymentMethod is card', () => {
    render(
      <CheckoutForm
        error={false}
        cardError={null}
        setCardError={mockSetCardError}
      />
    );
    expect(screen.getByTestId('card-element')).toBeInTheDocument();
  });

  it('calls setCardError with Stripe error', () => {
    (CardElement as jest.Mock).mockImplementation(({ onChange }) => {
      onChange({
        error: { message: 'Card invalid' },
        complete: false,
        empty: false,
      });
      return <div data-testid="card-element" />;
    });
    render(
      <CheckoutForm
        error={false}
        cardError={null}
        setCardError={mockSetCardError}
      />
    );
    expect(mockSetCardError).toHaveBeenCalledWith('Card invalid');
  });

  it('calls setCardError when card is incomplete', () => {
    (CardElement as jest.Mock).mockImplementation(({ onChange }) => {
      onChange({ error: null, complete: false, empty: true });
      return <div data-testid="card-element" />;
    });
    render(
      <CheckoutForm
        error={false}
        cardError={null}
        setCardError={mockSetCardError}
      />
    );
    expect(mockSetCardError).toHaveBeenCalledWith('Card number is required');
  });

  it('renders cardError and general error messages', () => {
    render(
      <CheckoutForm
        error={true}
        cardError="Card failed"
        setCardError={mockSetCardError}
      />
    );
    expect(screen.getByText('Card failed')).toBeInTheDocument();
    expect(screen.getByText('Payment failed')).toBeInTheDocument();
  });
});
