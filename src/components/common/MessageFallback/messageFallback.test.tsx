import { render, screen } from '@testing-library/react';
import { MessageFallback } from './MessageFallback';

describe('MessageFallback', () => {
  it('renders with align="left" correctly', () => {
    render(<MessageFallback align="left" />);
    const skeleton = screen.getByTestId('message-skeleton');

    expect(skeleton).toBeInTheDocument();
    expect(skeleton.parentElement).toHaveStyle('justify-content: flex-start');
    expect(skeleton).toHaveStyle('border-bottom-left-radius: 4px');
    expect(skeleton).toHaveStyle('border-bottom-right-radius: 16px');
  });

  it('renders with align="right" correctly', () => {
    render(<MessageFallback align="right" />);
    const skeleton = screen.getByTestId('message-skeleton');

    expect(skeleton).toBeInTheDocument();
    expect(skeleton.parentElement).toHaveStyle('justify-content: flex-end');
    expect(skeleton).toHaveStyle('border-bottom-left-radius: 16px');
    expect(skeleton).toHaveStyle('border-bottom-right-radius: 4px');
  });
});
