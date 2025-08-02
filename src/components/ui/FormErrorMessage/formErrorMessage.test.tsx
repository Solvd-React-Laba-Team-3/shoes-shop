import { render, screen } from '@testing-library/react';
import { FormErrorMessage } from './FormErrorMessage';

describe('FormErrorMessage', () => {
  it('should render error message when provided', () => {
    const testMessage = 'Test error message';
    render(<FormErrorMessage message={testMessage} />);

    expect(screen.getByText(testMessage)).toBeInTheDocument();
    expect(screen.getByTestId('WarningAmberIcon')).toBeInTheDocument();
  });

  it('should render with empty message but remain in DOM', () => {
    render(<FormErrorMessage />);

    expect(screen.getByTestId('WarningAmberIcon')).toBeInTheDocument();
    expect(screen.queryByRole('label')).toBeInTheDocument();
  });

  it('should have correct opacity based on message presence', () => {
    const { rerender } = render(<FormErrorMessage />);
    const label = screen.getByRole('label');

    expect(label).toHaveStyle({ opacity: '0' });

    rerender(<FormErrorMessage message="Error" />);
    expect(label).toHaveStyle({ opacity: '1' });
  });
});
