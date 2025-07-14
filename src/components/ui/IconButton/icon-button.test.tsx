import { render, screen, fireEvent } from '@testing-library/react';
import { IconButton } from './IconButton';
import MoreIcon from '@mui/icons-material/MoreHoriz';
import '@testing-library/jest-dom';

describe('IconButton', () => {
  test('renders with the correct icon', () => {
    render(
      <IconButton>
        <MoreIcon data-testid="MoreIcon" />
      </IconButton>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('MoreIcon')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(
      <IconButton onClick={handleClick}>
        <MoreIcon />
      </IconButton>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <IconButton onClick={handleClick} disabled>
        <MoreIcon />
      </IconButton>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
