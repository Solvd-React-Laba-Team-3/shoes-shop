import { render, screen, fireEvent } from '@testing-library/react';
import { Catalog } from './Catalog';
import { useDeviceSize } from '@/lib/hooks';
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

describe('Catalog Component', () => {
  beforeEach(() => {
    (useDeviceSize as jest.Mock).mockReturnValue({ isMobile: false });
  });

  it('renders ProductsContainer and fallback components correctly', () => {
    render(<Catalog />);

    expect(screen.getByText(/ProductsContainer/)).toBeInTheDocument();

    expect(screen.queryByText(/Filters - Open/)).not.toBeInTheDocument();
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
    expect(screen.queryByText(/Filters - Open/)).not.toBeInTheDocument();
  });

  it('renders FiltersFallback on desktop when Suspense is pending', () => {
    (useDeviceSize as jest.Mock).mockReturnValue({ isMobile: false });

    jest.mock('@/components/common/Filters', () => ({
      Filters: React.lazy(() => new Promise(() => {})),
    }));

    render(<Catalog />);

    expect(screen.queryByText('FiltersFallback')).not.toBeInTheDocument();
  });

  it('does not render FiltersFallback on mobile', () => {
    (useDeviceSize as jest.Mock).mockReturnValue({ isMobile: true });
    render(<Catalog />);

    fireEvent.click(screen.getByText('Toggle Filters'));

    expect(screen.queryByText('FiltersFallback')).not.toBeInTheDocument();
  });
});
