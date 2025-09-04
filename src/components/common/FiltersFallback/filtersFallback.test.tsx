import { screen } from '@testing-library/react';
import { FiltersFallback } from './FiltersFallback';
import { render } from '@/testing/utils';

describe('FiltersFallback', () => {
  it('renders 5 filter sections', () => {
    render(<FiltersFallback />);
    const filterSections = screen.getAllByTestId('filter-section');
    expect(filterSections).toHaveLength(5);
  });

  it('renders 4 items inside each filter section', () => {
    render(<FiltersFallback />);
    const items = screen.getAllByTestId('filter-item');
    expect(items).toHaveLength(5 * 4);
  });
});
