import { render } from '@testing-library/react';
import { ProductPageFallback } from './ProductPageFallback';
import {
  StyledContainer,
  StyledFallbackWrapper,
} from './productPageFallback.styles';

jest.mock('./productPageFallback.styles', () => ({
  StyledContainer: jest.fn(({ children }) => <div>{children}</div>),
  StyledFallbackWrapper: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('ProductPageFallback', () => {
  it('renders without crashing', () => {
    render(<ProductPageFallback />);
  });

  it('renders StyledContainer and StyledFallbackWrapper', () => {
    render(<ProductPageFallback />);
    expect(StyledContainer).toHaveBeenCalled();
    expect(StyledFallbackWrapper).toHaveBeenCalled();
  });
});
