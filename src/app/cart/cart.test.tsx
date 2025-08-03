import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Cart from './page';
import { SessionProvider } from 'next-auth/react';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({ data: [], isLoading: false })),
}));

const mockProductsResponse = {
  data: [
    {
      id: 1,
      url: '/recovery.jpg',
      attributes: {
        name: 'Shoe 1',
        description: 'Desc 1',
        price: 50,
        teamName: 'Team A',
      },
    },
    {
      id: 2,
      url: '/register.jpg',
      attributes: {
        name: 'Shoe 2',
        description: 'Desc 2',
        price: 30,
        teamName: 'Team B',
      },
    },
  ],
};

beforeAll(() => {
  global.fetch = jest.fn();
});

afterAll(() => {
  (global.fetch as jest.Mock).mockRestore();
});

function renderWithSession(ui: React.ReactElement) {
  return render(<SessionProvider session={null}>{ui}</SessionProvider>);
}

describe('Cart Component - summary calculations', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockProductsResponse,
    });
  });

  test('initial summary values are zero', async () => {
    renderWithSession(<Cart />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.getAllByText('Total')).toHaveLength(2);
    expect(screen.getAllByText('$0.00')).toHaveLength(4);
    expect(screen.getByText('Delivery')).toBeInTheDocument();
    expect(screen.getByText('Discount')).toBeInTheDocument();
  });

  test('increase and decrease quantity updates summary', async () => {
    renderWithSession(<Cart />);
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const increaseButtons = screen.getAllByText('+');
    fireEvent.click(increaseButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('$50.00')).toBeInTheDocument(); // Subtotal
      expect(screen.getByText('$20.00')).toBeInTheDocument(); // Shipping
      expect(screen.getByText('$70.00')).toBeInTheDocument(); // Total
    });

    const decreaseButtons = screen.getAllByText('-');
    fireEvent.click(decreaseButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByText('$0.00')).toHaveLength(1);
    });
  });
});
