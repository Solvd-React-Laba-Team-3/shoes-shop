import { render, screen, fireEvent } from '@testing-library/react';
import { Catalog } from '../common/Catalog';

jest.mock('@/components/common/Filters', () => ({
  Filters: ({ open, onClose }: { open: boolean; onClose: () => void }) => (
    <div data-testid="filters">
      <span>{open ? 'Filters Open' : 'Filters Closed'}</span>
      <button onClick={onClose}>Close Filters</button>
    </div>
  ),
}));

jest.mock('@/components/ProductsContainer', () => ({
  ProductsContainer: ({
    isFiltersOpen,
    onFiltersToggle,
  }: {
    isFiltersOpen: boolean;
    onFiltersToggle: () => void;
  }) => (
    <div data-testid="products">
      <span>{isFiltersOpen ? 'With Filters' : 'No Filters'}</span>
      <button onClick={onFiltersToggle}>Toggle Filters</button>
    </div>
  ),
}));

describe('Catalog', () => {
  it('toggles filters open state via ProductsContainer', () => {
    render(<Catalog />);

    expect(screen.getByText('No Filters')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Toggle Filters'));

    expect(screen.getByText('With Filters')).toBeInTheDocument();
    expect(screen.getByText('Filters Open')).toBeInTheDocument();
  });
});
