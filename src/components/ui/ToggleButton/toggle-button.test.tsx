import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleButton } from './ToggleButton';
import '@testing-library/jest-dom';

describe('ToggleButton', () => {
  test('renders correctly', () => {
    render(<ToggleButton value="test">Click me</ToggleButton>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(
      <ToggleButton value="test" onClick={handleClick}>
        Click me
      </ToggleButton>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <ToggleButton value="test" onClick={handleClick} disabled>
        Disabled
      </ToggleButton>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('applies selected styles when selected', () => {
    render(
      <ToggleButton value="test" selected>
        Selected
      </ToggleButton>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('Mui-selected');
    expect(button).toHaveStyle('background-color: #F0F0F0');
  });

  test('applies disabled styles when disabled', () => {
    render(
      <ToggleButton value="test" disabled>
        Disabled
      </ToggleButton>
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveStyle('background-color: #F9F9F9');
  });
});
