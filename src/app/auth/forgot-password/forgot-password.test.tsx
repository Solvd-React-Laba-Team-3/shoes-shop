import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ForgotPassword from './page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockMutate = jest.fn();
const mockUseForgotPassword = jest.fn();

jest.mock('@/api/auth/useForgotPassword', () => ({
  useForgotPassword: () => mockUseForgotPassword(),
}));

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

const renderComponent = () =>
  render(<ForgotPassword />, { wrapper: TestWrapper });

describe('ForgotPassword page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and description', () => {
    mockUseForgotPassword.mockReturnValue({
      mutate: jest.fn(),
      isSuccess: false,
      isError: false,
    });
    renderComponent();

    expect(
      screen.getByRole('heading', { name: /forgot password\?/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/we’ll send you reset instructions/i)
    ).toBeInTheDocument();
  });

  it('renders email input with correct attributes', () => {
    mockUseForgotPassword.mockReturnValue({
      mutate: jest.fn(),
      isSuccess: false,
      isError: false,
    });
    renderComponent();

    const input = screen.getByLabelText(/email/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter your email');
  });

  it('renders reset password button', () => {
    mockUseForgotPassword.mockReturnValue({
      mutate: jest.fn(),
      isSuccess: false,
      isError: false,
    });
    renderComponent();

    const button = screen.getByRole('button', { name: /reset password/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders "Back to log in" link', () => {
    mockUseForgotPassword.mockReturnValue({
      mutate: jest.fn(),
      isSuccess: false,
      isError: false,
    });
    renderComponent();

    expect(screen.getByText(/back to/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /log in/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/auth/sign-in');
  });

  it('allows typing in email field', () => {
    mockUseForgotPassword.mockReturnValue({
      mutate: jest.fn(),
      isSuccess: false,
      isError: false,
    });
    renderComponent();

    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input).toHaveValue('test@example.com');
  });

  it('shows validation error on invalid email submission', async () => {
    mockUseForgotPassword.mockReturnValue({
      mutate: jest.fn(),
      isSuccess: false,
      isError: false,
    });
    renderComponent();

    const input = screen.getByLabelText(/email/i);
    const button = screen.getByRole('button', { name: /reset password/i });

    fireEvent.change(input, { target: { value: 'invalid-email' } });
    fireEvent.click(button);

    expect(
      await screen.findByText(/invalid email address/i)
    ).toBeInTheDocument();
  });

  it('calls mutate with email on valid form submit', async () => {
    mockMutate.mockClear();
    mockUseForgotPassword.mockReturnValue({
      mutate: mockMutate,
      isSuccess: false,
      isError: false,
    });

    renderComponent();

    const input = screen.getByLabelText(/email/i);
    const button = screen.getByRole('button', { name: /reset password/i });

    fireEvent.change(input, { target: { value: 'valid@example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ email: 'valid@example.com' });
    });
  });

  it('disables submit button when isSuccess is true', () => {
    mockUseForgotPassword.mockReturnValue({
      mutate: jest.fn(),
      isSuccess: true,
      isError: false,
    });
    renderComponent();

    const button = screen.getByRole('button', { name: /reset password/i });
    expect(button).toBeDisabled();
  });

  it('redirects to reset-password page on success', () => {
    mockUseForgotPassword.mockReturnValue({
      mutate: jest.fn(),
      isSuccess: true,
      isError: false,
    });
    renderComponent();

    expect(mockPush).toHaveBeenCalledWith('/auth/reset-password');
  });

  it('alerts error message on mutation error', () => {
    mockUseForgotPassword.mockReturnValue({
      mutate: jest.fn(),
      isSuccess: false,
      isError: true,
    });
    window.alert = jest.fn();

    renderComponent();

    expect(window.alert).toHaveBeenCalledWith(
      'Failed to send reset instructions. Please try again.'
    );
  });
});
