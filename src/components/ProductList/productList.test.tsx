import { screen, act } from '@testing-library/react';
import { ProductList } from './ProductList';
import { Product } from '@/types/Product';
import { productMock } from '@/testing/mocks';
import { render } from '@/testing/utils';

describe('ProductList', () => {
  const mockProducts: Product[] = [productMock];

  it('renders without crashing', () => {
    act(() => {
      render(<ProductList products={mockProducts} />);
    });
    expect(screen.getAllByTestId('product-card')).toHaveLength(
      mockProducts.length
    );
  });

  it('passes the default variant prop to ProductCard', () => {
    act(() => {
      render(<ProductList products={mockProducts} />);
    });
    const cards = screen.getAllByTestId('product-card');
    expect(cards).toHaveLength(mockProducts.length);
  });

  it('renders the correct number of ProductCard components', () => {
    act(() => {
      render(<ProductList products={mockProducts} />);
    });
    expect(screen.getAllByTestId('product-card').length).toBe(
      mockProducts.length
    );
  });
});
