import { render, screen, fireEvent } from '@testing-library/react';
import Order from './page';
import { SessionProvider } from 'next-auth/react';

const mockPush = jest.fn();
const mockGet = jest.fn();

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: mockGet,
  }),
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Order', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });
  it('renders the Thank You heading', () => {
    render(
      <SessionProvider session={null}>
        <Order />
      </SessionProvider>
    );

    expect(screen.getByText('THANK YOU')).toBeInTheDocument();
  });

  it('renders  for your order text', () => {
    render(
      <SessionProvider session={null}>
        <Order />
      </SessionProvider>
    );

    expect(screen.getByText('for your order')).toBeInTheDocument();
  });

  it('renders order number from search params', () => {
    mockGet.mockReturnValue('12345');
    render(
      <SessionProvider session={null}>
        <Order />
      </SessionProvider>
    );
    expect(screen.getByText('#12345')).toBeInTheDocument();
  });

  it('renders default order number when order param is missing', () => {
    mockGet.mockReturnValue(null);
    render(
      <SessionProvider session={null}>
        <Order />
      </SessionProvider>
    );
    expect(screen.getByText('#9082372')).toBeInTheDocument();
  });

  it('displays view order button and continue shopping button', () => {
    render(
      <SessionProvider session={null}>
        <Order />
      </SessionProvider>
    );

    expect(
      screen.getByRole('button', { name: 'View Order' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Continue Shopping' })
    ).toBeInTheDocument();
  });

  it('renders the thank you image', () => {
    render(
      <SessionProvider session={null}>
        <Order />
      </SessionProvider>
    );

    expect(screen.getByAltText('Thank you')).toBeInTheDocument();
  });

  it('renders order confirmation text', () => {
    render(
      <SessionProvider session={null}>
        <Order />
      </SessionProvider>
    );

    expect(
      screen.getByText(
        'Your order has been received and is currently being processed. You will receive an email confirmation with your order details shortly.'
      )
    ).toBeInTheDocument();
  });

  it('navigates to /products when View Order button is clicked', () => {
    render(
      <SessionProvider session={null}>
        <Order />
      </SessionProvider>
    );
    const viewOrderButton = screen.getByRole('button', { name: 'View Order' });

    fireEvent.click(viewOrderButton);

    expect(mockPush).toHaveBeenCalledWith('/products');
  });

  it('navigates to the home page when Continue shopping button is clicked', () => {
    render(
      <SessionProvider session={null}>
        <Order />
      </SessionProvider>
    );
    const continueOrderButton = screen.getByRole('button', {
      name: 'Continue Shopping',
    });
    fireEvent.click(continueOrderButton);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
