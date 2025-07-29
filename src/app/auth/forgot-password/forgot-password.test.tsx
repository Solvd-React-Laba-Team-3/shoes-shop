import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ForgotPassword from './page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock router
const mockRouter = {
  push: jest.fn(),
};
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

// Mock forgot password hook
const mockMutate = jest.fn();
jest.mock('@/api/auth/useForgotPassword', () => ({
  useForgotPassword: () => ({
    mutate: mockMutate,
    isSuccess: false,
    isError: false,
  }),
}));

// Query client wrapper
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('ForgotPassword page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
        {
          onSuccess: expect.any(Function),
        }
      );
    });
  });
});
