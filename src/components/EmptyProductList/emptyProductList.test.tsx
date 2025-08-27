import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmptyProductList } from './';
import BlockIcon from '@mui/icons-material/Block';

describe('EmptyProductList', () => {
  it('displays the correct messages', () => {
    render(
      <EmptyProductList
        message="Test empty list message"
        caption="Test empty list caption"
        icon={<BlockIcon />}
      />
    );
    expect(screen.getByText(/Test empty list message/i)).toBeInTheDocument();
    expect(screen.getByText(/Test empty list caption/i)).toBeInTheDocument();
  });

  it('renders an icon if present', () => {
    render(
      <EmptyProductList
        message="Test empty list message"
        caption="Test empty list caption"
        icon={<BlockIcon data-testid="empty-icon" />}
      />
    );
    Example: expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
  });
});
