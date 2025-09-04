import { screen } from '@testing-library/react';
import { FormErrorMessage } from './FormErrorMessage';
import { render } from '@/testing/utils';

describe('FormErrorMessage', () => {
  it('should render error message when provided', () => {
    const testMessage = 'Test error message';
    render(<FormErrorMessage message={testMessage} />);

    expect(screen.getByText(testMessage)).toBeInTheDocument();
    expect(screen.getByTestId('form-error-icon')).toBeInTheDocument();
  });

  it('should render with empty message but remain in DOM', () => {
    render(<FormErrorMessage />);

    expect(screen.getByTestId('form-error-icon')).toBeInTheDocument();
    expect(screen.getByTestId('form-error-message')).toBeInTheDocument();
  });

  it('should have correct opacity based on message presence', () => {
    const { rerender } = render(<FormErrorMessage />);
    const label = screen.getByTestId('form-error-message');

    expect(label).toHaveStyle({ opacity: '0' });

    rerender(<FormErrorMessage message="Error" />);
    expect(label).toHaveStyle({ opacity: '1' });
  });
});
