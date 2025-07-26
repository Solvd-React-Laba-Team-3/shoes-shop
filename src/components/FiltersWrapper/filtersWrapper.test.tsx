import { render, screen } from '@testing-library/react';
import { FiltersWrapper } from './FiltersWrapper';

jest.mock('../Filters', () => ({
  Filters: jest.fn(() => <div data-testid="filters-component" />),
}));

describe('<FiltersWrapper />', () => {
  it('renders Filters inside Box with correct styles', () => {
    render(<FiltersWrapper />);

    const box = screen.getByTestId('filters-component').parentElement;

    expect(box).toBeInTheDocument();
    expect(box).toHaveStyle({
      overflowX: 'hidden',
      paddingBottom: '200px',
      minWidth: '320px',
    });
    expect(screen.getByTestId('filters-component')).toBeInTheDocument();
  });
});
