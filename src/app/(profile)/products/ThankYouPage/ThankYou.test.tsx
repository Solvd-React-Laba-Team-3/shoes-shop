import { render, screen, fireEvent } from '@testing-library/react';
import ThankYou from './page';

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

describe('ThankYou', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });
  it('renders thr Thank You heading', () => {
    render(<ThankYou />);

    expect(screen.getByText('THANK YOU')).toBeInTheDocument();
  });

  it('renders  for your order text', () => {
    render(<ThankYou />);

    expect(screen.getByText('for your order')).toBeInTheDocument();
  });

  //   it('displays the order number from query params', () => {
  //     render(<ThankYou />);

  //     expect(screen.getByText('#9082372')).toBeInTheDocument();
  //   });

  it('renders order number from search params', () => {
    mockGet.mockReturnValue('12345');
    render(<ThankYou />);
    expect(screen.getByText('#12345')).toBeInTheDocument();
  });

  it('renders default order number when order param is missing', () => {
    mockGet.mockReturnValue(null); // имитация отсутствия параметра
    render(<ThankYou />);
    expect(screen.getByText('#9082372')).toBeInTheDocument();
  });

  it('displays view order button and continue shopping button', () => {
    render(<ThankYou />);

    expect(
      screen.getByRole('button', { name: 'View Order' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Continue Shopping' })
    ).toBeInTheDocument();
  });

  it('renders the thank you image', () => {
    render(<ThankYou />);

    expect(screen.getByAltText('Thank you')).toBeInTheDocument();
  });

  it('renders order confirmation text', () => {
    render(<ThankYou />);

    expect(
      screen.getByText(
        'Your order has been received and is currently being processed. You will receive an email confirmation with your order details shortly.'
      )
    ).toBeInTheDocument();
  });

  it('navigates to /products when View Order button is clicked', () => {
    render(<ThankYou />);
    const viewOrderButton = screen.getByRole('button', { name: 'View Order' });

    fireEvent.click(viewOrderButton);

    expect(mockPush).toHaveBeenCalledWith('/products');
  });

  it('navigates to the home page when Continue shopping button is clicked', () => {
    render(<ThankYou />);
    const continueOrderButton = screen.getByRole('button', {
      name: 'Continue Shopping',
    });
    fireEvent.click(continueOrderButton);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
