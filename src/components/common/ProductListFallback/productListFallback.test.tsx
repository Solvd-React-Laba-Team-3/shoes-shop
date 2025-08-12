import { render } from '@testing-library/react';
import { ProductListFallback } from './ProductListFallback';
import '@testing-library/jest-dom';

describe('ProductListFallback', () => {
  it('renders 6 product skeleton groups (each with 4 skeletons)', () => {
    const { container } = render(<ProductListFallback />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBe(24);
  });

  it('renders image skeletons with correct dimensions', () => {
    const { container } = render(<ProductListFallback />);
    const imageSkeleton = container.querySelector('.MuiSkeleton-root');

    expect(imageSkeleton).toHaveStyle({
      width: '380px',
      height: '460px',
    });
  });
});
