import { render, screen, fireEvent } from '@testing-library/react';
import { PopUpMenu } from './PopUpMenu';
import { MenuItem } from '@mui/material';
import '@testing-library/jest-dom';

describe('PopUpMenu', () => {
  test('renders when open and displays children', () => {
    const anchor = document.createElement('div');
    document.body.appendChild(anchor);

    render(
      <PopUpMenu anchorEl={anchor} open onClose={jest.fn()}>
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
      </PopUpMenu>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  test('does not render when `open` is false', () => {
    const anchor = document.createElement('div');
    document.body.appendChild(anchor);

    render(
      <PopUpMenu anchorEl={anchor} open={false} onClose={jest.fn()}>
        <MenuItem>Hidden Item</MenuItem>
      </PopUpMenu>
    );

    expect(screen.queryByText('Hidden Item')).not.toBeInTheDocument();
  });

  test('calls onClose when a menu item is clicked', () => {
    const anchor = document.createElement('div');
    document.body.appendChild(anchor);
    const handleClose = jest.fn();

    render(
      <PopUpMenu anchorEl={anchor} open onClose={handleClose}>
        <MenuItem onClick={handleClose}>Close Me</MenuItem>
      </PopUpMenu>
    );

    fireEvent.click(screen.getByText('Close Me'));
    expect(handleClose).toHaveBeenCalled();
  });
});
