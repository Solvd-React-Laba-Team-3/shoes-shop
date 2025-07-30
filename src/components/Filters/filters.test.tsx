// __tests__/Filters.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Filters } from '@/components/Filters';
import * as hooks from '@/lib/hooks';
import React from 'react';

jest.mock('@/lib/hooks');
jest.mock('@/api/gender/getGendersOptions');
jest.mock('@/api/size/getSizesOptions');
jest.mock('@/api/brand/getBrandsOptions');
jest.mock('@/api/color/getColorsOptions');
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useSuspenseQueries: jest.fn(),
}));

import { useSuspenseQueries } from '@tanstack/react-query';

describe('Filters component', () => {
  const setMock = jest.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();

    (hooks.useSearchsParams as jest.Mock).mockReturnValue({
      get: (key: string) => mockSearchParams.get(key),
      set: setMock,
    });

    (hooks.useDebounce as jest.Mock).mockImplementation((v) => v);

    (useSuspenseQueries as jest.Mock).mockReturnValue([
      { data: [{ id: 1, name: 'Male' }] },
      { data: [{ id: 2, value: '42' }] },
      { data: [{ id: 3, name: 'Nike' }] },
      { data: [{ id: 4, name: 'Red' }] },
    ]);
  });

  it('renders all filter sections', async () => {
    render(<Filters />);

    expect(screen.getByText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByText(/Brand/i)).toBeInTheDocument();
    expect(screen.getByText(/Price/i)).toBeInTheDocument();
    expect(screen.getByText(/Color/i)).toBeInTheDocument();
    expect(screen.getByText(/Size/i)).toBeInTheDocument();
  });

  it('updates brand search and triggers debounce', async () => {
    render(<Filters />);

    const input = screen.getByPlaceholderText('Search brand');
    fireEvent.change(input, { target: { value: 'Adidas' } });

    await waitFor(() => {
      expect(input).toHaveValue('Adidas');
    });
  });

  it('updates filters when selecting gender', () => {
    render(<Filters />);
    const checkbox = screen.getByLabelText('Male');
    fireEvent.click(checkbox);

    expect(setMock).toHaveBeenCalled();
  });

  it('updates filters when slider changes', () => {
    render(<Filters />);
    const minInput = screen.getAllByTestId('price-range')[0];

    fireEvent.change(minInput, { target: { value: 100 } });

    expect(minInput).toHaveValue('100');
    expect(setMock).toHaveBeenCalled();
  });
});
