import { render } from '@testing-library/react';
import { ProductListFallback } from './ProductListFallback';
import '@testing-library/jest-dom';

describe('ProductListFallback', () => {
  it('renders 12 product skeleton groups (each with 4 skeletons)', () => {
    const { container } = render(<ProductListFallback />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBe(53);
  });
});
