import { render, screen, fireEvent } from '@testing-library/react';
import {
  normalizeToUniqueArray,
  parseQueryString,
  toQueryString,
} from '@/lib/utils';

import { Filters } from './Filters';
import { useSearchParams, useDebounce, useFilters } from '@/lib/hooks';
import { useSuspenseQueries } from '@tanstack/react-query';

import '@testing-library/jest-dom';

const mockUseMediaQuery = jest.fn();
jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: (query: string) => mockUseMediaQuery(query),
}));

jest.mock('@/lib/hooks', () => ({
  useSearchParams: jest.fn(),
  useDebounce: jest.fn(),
  useFilters: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useSuspenseQueries: jest.fn(),
}));

jest.mock('@/api/gender/getGendersOptions', () => ({
  getGendersOptions: jest.fn(),
}));

jest.mock('@/api/size/getSizesOptions', () => ({ getSizesOptions: jest.fn() }));

jest.mock('@/api/color/getColorsOptions', () => ({
  getColorsOptions: jest.fn(),
}));

jest.mock('@/api/brand/getBrandsOptions', () => ({
  getBrandsOptions: jest.fn(),
}));

jest.mock('@/lib/utils', () => ({
  parseQueryString: jest.fn(() => ({ filters: {} })),
  normalizeToUniqueArray: jest.fn((arr) => Array.from(new Set(arr))),
  toQueryString: jest.fn((filters) => JSON.stringify(filters)),
}));

describe('Filters component full coverage', () => {
  const mockSet = jest.fn();
  const mockDelete = jest.fn();
  const mockUpdateFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn(() => null),
      set: mockSet,
      delete: mockDelete,
    });

    (normalizeToUniqueArray as jest.Mock).mockImplementation((arr: []) =>
      Array.from(new Set(arr))
    );
    (parseQueryString as jest.Mock).mockReturnValue({ filters: {} });
    (toQueryString as jest.Mock).mockImplementation((filters) =>
      JSON.stringify(filters)
    );

    (useFilters as jest.Mock).mockReturnValue({
      currentFilters: {},
      updateFilters: mockUpdateFilters,
      clearFilters: jest.fn(() => mockDelete()),
      priceInput: [1, 10000],
      toggleSelection: jest.fn(() => mockSet()),
    });

    (useDebounce as jest.Mock).mockReturnValue({ debouncedValue: '' });

    mockUseMediaQuery.mockReturnValue(false);

    (useSuspenseQueries as jest.Mock).mockReturnValue([
      { data: [{ id: 1, name: 'Male' }] },
      { data: [{ id: 1, value: 'M' }] },
      { data: [{ id: 1, name: 'Nike' }] },
      { data: [{ id: 1, name: 'Red' }] },
    ]);
  });

  it('renders all sections', () => {
    render(<Filters open />);
    expect(screen.getByText('Catalog')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByText('Size')).toBeInTheDocument();
  });

  it('toggles gender selection on/off', () => {
    render(<Filters open />);
    const checkbox = screen.getByRole('checkbox', { name: 'Male' });
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);

    expect(mockSet).toHaveBeenCalled();
  });

  it('toggles brand selection on/off', () => {
    render(<Filters open />);
    const checkbox = screen.getByRole('checkbox', { name: 'Nike' });
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);

    expect(mockSet).toHaveBeenCalled();
  });

  it('toggles color selection on/off', () => {
    render(<Filters open />);
    const checkbox = screen.getByRole('checkbox', { name: 'Red' });
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);

    expect(mockSet).toHaveBeenCalled();
  });

  it('toggles size selection on/off', () => {
    render(<Filters open />);
    const checkbox = screen.getByRole('checkbox', { name: 'M' });
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);

    expect(mockSet).toHaveBeenCalled();
  });

  it('handles price input invalid values', () => {
    render(<Filters open />);
    const inputs = screen.getAllByTestId('price-range');
    fireEvent.change(inputs[0], { target: { value: 'abc' } });
    fireEvent.change(inputs[1], { target: { value: 'NaN' } });
    expect(mockSet).toHaveBeenCalledTimes(0);
  });

  it('calls updateFilters for price-range changes', () => {
    render(<Filters open />);
    const inputs = screen.getAllByTestId('price-range');
    fireEvent.change(inputs[0], { target: { value: 100 } });
    fireEvent.change(inputs[1], { target: { value: 1000 } });
    expect(mockUpdateFilters).toHaveBeenCalledTimes(2);
  });

  it('clears filters on mobile', () => {
    mockUseMediaQuery.mockReturnValue(true);
    const onClose = jest.fn();
    render(<Filters open onClose={onClose} />);
    fireEvent.click(screen.getByText('Clear'));

    expect(mockDelete).toHaveBeenCalled();
  });

  it('updates search input for brands', () => {
    render(<Filters open />);
    const input = screen.getByPlaceholderText('Search brand');
    fireEvent.change(input, { target: { value: 'Nike' } });
    expect(input).toHaveValue('Nike');
  });

  it('renders search param if exists', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn((key) => (key === 'search' ? 'Shoes' : null)),
      set: mockSet,
      delete: mockDelete,
    });
    render(<Filters open />);
    expect(screen.getByText('Shoes/Shoes')).toBeInTheDocument();
  });
});
