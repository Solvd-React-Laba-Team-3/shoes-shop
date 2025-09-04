import { render } from '@/testing/utils';
import { ProductPageFallback } from './ProductPageFallback';

describe('ProductPageFallback', () => {
  it('renders without crashing', () => {
    render(<ProductPageFallback />);
  });

  it('renders skeleton elements for loading state', () => {
    const { container } = render(<ProductPageFallback />);

    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders the main container structure', () => {
    const { container } = render(<ProductPageFallback />);

    expect(container.firstChild).toBeInTheDocument();
  });
});
