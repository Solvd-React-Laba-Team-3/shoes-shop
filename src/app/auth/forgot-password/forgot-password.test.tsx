import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ForgotPassword from './page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockReplace = jest.fn();
const mockMutate = jest.fn();

let mockUseForgotPasswordReturn = {
  mutate: mockMutate,
  isSuccess: false,
  isError: false,
  isPending: false,
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@/api/auth/useForgotPassword', () => ({
  useForgotPassword: () => mockUseForgotPasswordReturn,
}));

// Query client wrapper
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('ForgotPassword page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseForgotPasswordReturn = {
      mutate: mockMutate,
      isSuccess: false,
      isError: false,
      isPending: false,
    };
  });

  it('renders title and description', () => {
    render(<ForgotPassword />, { wrapper: TestWrapper });
    expect(
      screen.getByRole('heading', { name: /Forgot password\?/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Don’t worry, we’ll send you reset instructions./i)
    ).toBeInTheDocument();
  });

  it('renders email input with correct attributes', () => {
    render(<ForgotPassword />, { wrapper: TestWrapper });
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter your email');
  });

  it('renders reset password button', () => {
    render(<ForgotPassword />, { wrapper: TestWrapper });
    const button = screen.getByRole('button', { name: /Forgot password/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders "Back to log in" link', () => {
    render(<ForgotPassword />, { wrapper: TestWrapper });
    expect(screen.getByText(/back to/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /log in/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/auth/sign-in');
  });

  it('shows validation error on invalid email submission', async () => {
    render(<ForgotPassword />, { wrapper: TestWrapper });
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: 'invalid-email' } });
    fireEvent.submit(screen.getByRole('button', { name: /Forgot password/i }));
    expect(
      await screen.findByText(/invalid email address/i)
    ).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('submits form with valid email', async () => {
    render(<ForgotPassword />, { wrapper: TestWrapper });
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: 'valid@example.com' } });
    fireEvent.submit(screen.getByRole('button', { name: /Forgot password/i }));
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { email: 'valid@example.com' },
        { onSuccess: expect.any(Function) }
      );
    });
  });

  it('shows API error message when isError is true', () => {
    mockUseForgotPasswordReturn.isError = true;
    render(<ForgotPassword />, { wrapper: TestWrapper });
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeInTheDocument();
    expect(
      screen.getByText(/Failed to send reset instructions/i)
    ).toBeInTheDocument();
  });

  it('disables button when loading', () => {
    mockUseForgotPasswordReturn.isPending = true;
    const { rerender } = render(<ForgotPassword />, { wrapper: TestWrapper });
    let button = screen.getByRole('button', { name: /Forgot password/i });
    expect(button).toHaveAttribute('disabled');

    mockUseForgotPasswordReturn.isPending = false;
    mockUseForgotPasswordReturn.isSuccess = true;
    rerender(<ForgotPassword />);
    button = screen.getByRole('button', { name: /Forgot password/i });
    expect(button).toHaveAttribute('disabled');
  });

  it('shows success message and redirects after successful submit', async () => {
    jest.useFakeTimers();
    const { rerender } = render(<ForgotPassword />, { wrapper: TestWrapper });
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: 'valid@example.com' } });
    fireEvent.submit(screen.getByRole('button', { name: /Forgot password/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });

    const [, options] = mockMutate.mock.calls[0];
    options.onSuccess();

    mockUseForgotPasswordReturn.isSuccess = true;
    rerender(<ForgotPassword />);
    expect(
      await screen.findByTestId('reset-success-message')
    ).toBeInTheDocument();

    jest.advanceTimersByTime(2000);
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/auth/sign-in');
    });

    jest.useRealTimers();
  });
});
