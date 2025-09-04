import { screen, fireEvent } from '@testing-library/react';
import { useFormContext, useWatch } from 'react-hook-form';
import { shippingCountries } from '@/constants/shippingCountries';
import { CardElement } from '@stripe/react-stripe-js';
import { CheckoutForm } from './CheckoutForm';
import { render } from '@/testing/utils';

jest.mock('react-hook-form', () => ({
  useFormContext: jest.fn(),
  useWatch: jest.fn(),
  Controller: jest.fn(({ render, name }) => {
    const mockField = {
      value: name === 'country' ? '' : 'card',
      onChange: jest.fn(),
    };
    return render({ field: mockField });
  }),
}));

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
        availablePaymentMethods={['card']}
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
        availablePaymentMethods={['card']}
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
      'Zip Code',
      'Address',
    ].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders country select with shipping countries', () => {
    render(
      <CheckoutForm
        availablePaymentMethods={['card']}
        error={false}
        cardError={null}
        setCardError={mockSetCardError}
      />
    );

    expect(screen.getByText('Select country')).toBeInTheDocument();
    const countrySelect = screen.getByRole('combobox');
    fireEvent.mouseDown(countrySelect);

    shippingCountries.forEach((country) => {
      expect(screen.getByText(country)).toBeInTheDocument();
    });
  });

  it('renders payment methods and chevron toggle', () => {
    render(
      <CheckoutForm
        availablePaymentMethods={['card']}
        error={false}
        cardError={null}
        setCardError={mockSetCardError}
      />
    );

    expect(screen.getByText('Card')).toBeInTheDocument();
    expect(screen.getByText('Google Pay')).toBeInTheDocument();
    expect(screen.getByText('Apple Pay')).toBeInTheDocument();
    expect(screen.getByText('Link')).toBeInTheDocument();
  });

  it('renders CardElement when paymentMethod is card', () => {
    render(
      <CheckoutForm
        availablePaymentMethods={['card']}
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
        availablePaymentMethods={['card']}
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
        availablePaymentMethods={['card']}
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
        availablePaymentMethods={['card']}
        error={true}
        cardError="Card failed"
        setCardError={mockSetCardError}
      />
    );
    expect(screen.getByText('Card failed')).toBeInTheDocument();
    expect(screen.getByText('Payment failed')).toBeInTheDocument();
  });
});
