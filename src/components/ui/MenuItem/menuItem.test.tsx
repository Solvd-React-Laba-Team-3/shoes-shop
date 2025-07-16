import { render, screen, fireEvent } from '@testing-library/react';
import { MenuItem } from './MenuItem';
import '@testing-library/jest-dom';

describe('MenuItem', () => {
  test('renders with correct text', () => {
    render(<MenuItem>Option 1</MenuItem>);
    expect(screen.getByText(/Option 1/i)).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<MenuItem onClick={handleClick}>Click Me</MenuItem>);
    fireEvent.click(screen.getByText(/Click Me/i));
    expect(handleClick).toHaveBeenCalled();
  });
});
