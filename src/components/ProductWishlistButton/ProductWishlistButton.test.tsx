import { render, screen, fireEvent } from '@testing-library/react';
import { ProductWishlistButton } from '@/components/ProductWishlistButton';

describe('ProductWishlistButton', () => {
  it('renders the heart icon', () => {
    render(<ProductWishlistButton />);
    const icon = screen.getByTestId('HeartBrokenOutlinedIcon');
    expect(icon).toBeInTheDocument();
  });

  it('calls handleClick when clicked', () => {
    const handleClick = jest.fn();
    render(<ProductWishlistButton handleClick={handleClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
