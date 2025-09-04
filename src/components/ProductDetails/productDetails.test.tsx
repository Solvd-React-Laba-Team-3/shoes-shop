import { screen, fireEvent } from '@testing-library/react';
import { Catalog } from '../common/Catalog';
import { render } from '@/testing/utils';

describe('Catalog', () => {
  it('toggles filters open state via ProductsContainer', () => {
    render(<Catalog />);

    expect(screen.getByText('No Filters')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Toggle Filters'));

    expect(screen.getByText('With Filters')).toBeInTheDocument();
    expect(screen.getByText('Filters Open')).toBeInTheDocument();
  });
});
