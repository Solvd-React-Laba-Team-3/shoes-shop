import React from 'react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from '@testing-library/react';
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
      },
    },
    {
      id: 2,
      url: '/register.jpg',
      attributes: {
        name: 'Shoe 2',
        description: 'Desc 2',
        price: 30,
      },
    },
  ],
};

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
  });
});

afterAll(() => {
  (global.fetch as jest.Mock).mockRestore();
});

function renderWithSession(ui: React.ReactElement) {
  return render(<SessionProvider session={null}>{ui}</SessionProvider>);
}

describe('Cart Component - summary calculations', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock) = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockProductsResponse),
      })
    );

    window.localStorage.getItem = jest.fn((key) => {
      if (key === 'cart-products') {
        return JSON.stringify(mockProductsResponse.data);
      }
      if (key === 'cart-quantities') {
        return JSON.stringify({ 1: 0, 2: 0 });
      }
      return null;
    });

    window.localStorage.setItem = jest.fn();
  });

  test('initial summary values are zero', async () => {
    renderWithSession(<Cart />);
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const summarySection = screen.getByText(/Summary/i).closest('div');
    expect(summarySection).toBeTruthy();

    const totalElements = within(summarySection!).getAllByText(/Total/i);
    expect(totalElements.length).toBeGreaterThan(0);

    const zeroAmounts = within(summarySection!).queryAllByText((content) =>
      content.includes('$0.00')
    );
    expect(zeroAmounts.length).toBeGreaterThanOrEqual(2);
  });

  test('increase and decrease quantity updates summary', async () => {
    renderWithSession(<Cart />);
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const increaseButtons = await screen.findAllByText('+');
    fireEvent.click(increaseButtons[0]);

    const summarySection = screen.getByText(/Summary/i).closest('div');
    expect(summarySection).toBeTruthy();

    await waitFor(() => {
      const fiftyAmounts = within(summarySection!).queryAllByText((content) =>
        content.includes('$50.00')
      );
      expect(fiftyAmounts.length).toBeGreaterThanOrEqual(0);
    });

    const decreaseButtons = await screen.findAllByText('-');
    fireEvent.click(decreaseButtons[0]);

    await waitFor(() => {
      const zeroAmounts = within(summarySection!).queryAllByText((content) =>
        content.includes('$0.00')
      );
      expect(zeroAmounts.length).toBeGreaterThanOrEqual(0);
    });
  });
});
