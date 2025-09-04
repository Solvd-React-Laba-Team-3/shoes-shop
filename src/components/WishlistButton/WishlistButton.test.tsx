import { screen, fireEvent } from '@testing-library/react';
import { WishlistButton } from './WishlistButton';
import { render } from '@/testing/utils';

describe('ProductWishlistButton', () => {
  it('renders the heart icon', () => {
    render(<WishlistButton onRemove={() => {}} />);
    const icon = screen.getByTestId('HeartBrokenOutlinedIcon');
    expect(icon).toBeInTheDocument();
  });

  it('calls handleClick when clicked', () => {
    const handleClick = jest.fn();
    render(<WishlistButton onRemove={handleClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
