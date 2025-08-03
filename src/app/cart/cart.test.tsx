import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Cart from './page';
import { SessionProvider } from 'next-auth/react';
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({ data: [], isLoading: false })),
}));

const mockProductsResponse = {
  data: [
    {
      id: 1,
      url: 'url1',
      attributes: {
        name: 'Shoe 1',
        description: 'Desc 1',
        price: 50,
        teamName: 'Team A',
      },
    },
    {
      id: 2,
      url: 'url2',
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

describe('Cart Component - summary calculations', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockProductsResponse,
    });
  });

  function renderWithSession(ui: React.ReactElement) {
    return render(<SessionProvider session={null}>{ui}</SessionProvider>);
  }

  test('initial summary values are zero', async () => {
    renderWithSession(<Cart />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const totalLabels = screen.getAllByText('Total');
    expect(totalLabels.length).toBe(2);

    totalLabels.forEach((label) => expect(label).toBeInTheDocument());

    const zeroPrices = screen.getAllByText('$0.00');
    expect(zeroPrices).toHaveLength(4);

    expect(screen.getByText('Delivery')).toBeInTheDocument();
    expect(screen.getByText('Discount')).toBeInTheDocument();
  });
});
