import { render, screen, fireEvent } from '@testing-library/react';
import Order from './page';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('@/components/common/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>,
}));

describe('Order', () => {
  const mockRouter = {
    replace: jest.fn(),
  };

  const mockSearchParams = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it('redirects to home if no order number is present', () => {
    mockSearchParams.get.mockReturnValue(null);
    render(<Order />);
    expect(mockRouter.replace).toHaveBeenCalledWith('/');
  });

  it('displays order number from search params', () => {
    mockSearchParams.get.mockReturnValue('9082372');
    render(<Order />);
    expect(screen.getByText('#9082372')).toBeInTheDocument();
  });

  it('displays thank you message and order confirmation text', () => {
    mockSearchParams.get.mockReturnValue('9082372');
    render(<Order />);

    expect(screen.getByText('THANK YOU')).toBeInTheDocument();
    expect(screen.getByText('for your order')).toBeInTheDocument();
    expect(
      screen.getByText(/Your order has been received/)
    ).toBeInTheDocument();
  });

  it('displays view order button and continue shopping button', () => {
    mockSearchParams.get.mockReturnValue('9082372');
    render(<Order />);

    expect(screen.getByText('View Order')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('renders the thank you image', () => {
    mockSearchParams.get.mockReturnValue('9082372');
    render(<Order />);

    const image = screen.getByAltText('Thank you');
    expect(image).toBeInTheDocument();
  });

  it('navigates to /products when View Order button is clicked', () => {
    mockSearchParams.get.mockReturnValue('9082372');
    render(<Order />);

    fireEvent.click(screen.getByText('View Order'));
    expect(mockRouter.replace).toHaveBeenCalledWith('/products');
  });

  it('navigates to the home page when Continue shopping button is clicked', () => {
    mockSearchParams.get.mockReturnValue('9082372');
    render(<Order />);

    fireEvent.click(screen.getByText('Continue Shopping'));
    expect(mockRouter.replace).toHaveBeenCalledWith('/');
  });
});
