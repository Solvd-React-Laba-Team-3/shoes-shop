import { render, screen, fireEvent } from '@testing-library/react';
import { Catalog } from './Catalog';
import React from 'react';

jest.mock('@/components/ProductsContainer', () => ({
  ProductsContainer: ({
    isFiltersOpen,
    onFiltersToggle,
  }: {
    isFiltersOpen: boolean;
    onFiltersToggle: () => void;
  }) => (
    <div>
      ProductsContainer - FiltersOpen: {isFiltersOpen.toString()}
      <button onClick={onFiltersToggle}>Toggle Filters</button>
    </div>
  ),
}));

jest.mock('@/components/common/Filters', () => ({
  Filters: ({ open, onClose }: { open: boolean; onClose: () => void }) => (
    <div>
      Filters - Open: {open.toString()}
      <button onClick={onClose}>Close Filters</button>
    </div>
  ),
}));

jest.mock('@/components/common/ProductListFallback', () => ({
  ProductListFallback: () => <div>ProductListFallback</div>,
}));

jest.mock('@/components/common/FiltersFallback', () => ({
  FiltersFallback: () => <div>FiltersFallback</div>,
}));

jest.mock('@/lib/hooks', () => ({
  useDeviceSize: jest.fn(),
}));

const mockUseMediaQuery = jest.fn();
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: (query: string) => mockUseMediaQuery(query),
}));

describe('Catalog Component', () => {
  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(false);
  });

  it('opens Filters when toggled and shows FiltersFallback on desktop', () => {
    render(<Catalog />);

    fireEvent.click(screen.getByText('Toggle Filters'));

    expect(screen.getByText(/Filters - Open: true/)).toBeInTheDocument();
    expect(screen.queryByText(/FiltersFallback/)).not.toBeInTheDocument();
  });

  it('closes Filters when onClose is called', () => {
    render(<Catalog />);

    fireEvent.click(screen.getByText('Toggle Filters'));
    expect(screen.getByText(/Filters - Open: true/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close Filters'));
    expect(screen.queryByText(/Filters - Open: true/)).not.toBeInTheDocument();
  });

  it('renders FiltersFallback on desktop when Suspense is pending', () => {
    mockUseMediaQuery.mockReturnValue(false);

    jest.mock('@/components/common/Filters', () => ({
      Filters: React.lazy(() => new Promise(() => {})),
    }));

    render(<Catalog />);

    expect(screen.queryByText('FiltersFallback')).not.toBeInTheDocument();
  });

  it('does not render FiltersFallback on mobile', () => {
    mockUseMediaQuery.mockReturnValue(true);
    render(<Catalog />);

    fireEvent.click(screen.getByText('Toggle Filters'));

    expect(screen.queryByText('FiltersFallback')).not.toBeInTheDocument();
  });
});
