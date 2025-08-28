import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CartFallback } from './CartFallback';

describe('CartFallback', () => {
  it('renders without crashing', () => {
    render(<CartFallback />);
    expect(screen.getByText(/Cart/i)).toBeInTheDocument();
    expect(screen.getByText(/Summary/i)).toBeInTheDocument();
  });

  it('renders 3 cart item placeholders', () => {
    render(<CartFallback />);
    const dividers = screen.getAllByRole('separator');
    expect(dividers).toHaveLength(5);
  });

  it('renders styled container', () => {
    const { container } = render(<CartFallback />);
    const styledContainer = container.firstChild as HTMLElement;
    expect(styledContainer).toHaveStyle('display: flex');
    expect(styledContainer).toHaveStyle('max-width: 1600px');
  });
});
