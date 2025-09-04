import { render } from '@/testing/utils';
import { ProductListFallback } from './ProductListFallback';

describe('ProductListFallback', () => {
  it('renders 12 product skeleton groups (each with 4 skeletons)', () => {
    const { container } = render(<ProductListFallback />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBe(51);
  });
});
