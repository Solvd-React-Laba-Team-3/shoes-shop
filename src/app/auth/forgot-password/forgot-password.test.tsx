import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ForgotPassword from './page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  mockForgotPasswordMutate,
  mockUseForgotPassword,
} from '@/testing/mocks/';

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

    mockUseForgotPassword.mockReturnValue({
      mutate: mockForgotPasswordMutate,
      isSuccess: false,
      isError: false,
    });

    mockForgotPasswordMutate.mockReset();
  });

  it('renders title and description', () => {
    renderComponent();
    expect(
      screen.getByRole('heading', { name: /forgot password\?/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/we’ll send you reset instructions/i)
    ).toBeInTheDocument();
  });

  it('renders email input with correct attributes', () => {
    renderComponent();

    const input = screen.getByLabelText(/email/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter your email');
  });

  it('renders reset password button', () => {
    renderComponent();

    const button = screen.getByRole('button', { name: /reset password/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).not.toBeEnabled();
  });

  it('renders "Back to log in" link', () => {
    renderComponent();

    expect(screen.getByText(/back to/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /log in/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/auth/sign-in');
  });

  it('allows typing in email field', () => {
    renderComponent();

    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input).toHaveValue('test@example.com');
  });

  it('shows validation error on invalid email submission', async () => {
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
    mockForgotPasswordMutate.mockResolvedValueOnce({});

    renderComponent();

    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: 'valid@example.com' } });

    const button = screen.getByRole('button', { name: /reset password/i });

    await waitFor(() => {
      expect(button).toBeEnabled();
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockForgotPasswordMutate).toHaveBeenCalledWith({
        email: 'valid@example.com',
      });
    });
  });

  it('disables submit button when isSuccess is true', () => {
    mockUseForgotPassword.mockReturnValue({
      mutate: mockForgotPasswordMutate,
      isSuccess: true,
      isError: false,
    });
    renderComponent();

    const button = screen.getByRole('button', { name: /reset password/i });
    expect(button).toBeDisabled();
  });

  it('shows success message only after submit and success', () => {
    mockUseForgotPassword.mockReturnValue({
      mutate: mockForgotPasswordMutate,
      isSuccess: true,
      isError: false,
    });
    renderComponent();

    expect(
      screen.queryByText(/a confirmation link has been sent to your email/i)
    ).not.toBeInTheDocument();
  });

  it('shows error message with icon on isError', () => {
    mockUseForgotPassword.mockReturnValue({
      mutate: jest.fn(),
      isSuccess: false,
      isError: true,
    });
    renderComponent();

    expect(
      screen.getByText(/failed to send reset instructions/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/failed to send reset instructions/i).previousSibling
    ).toBeDefined();
  });

  it('shows success message only after submit and success', async () => {
    mockUseForgotPassword.mockReturnValue({
      mutate: mockForgotPasswordMutate,
      isSuccess: false,
      isError: false,
    });
    renderComponent();

    expect(
      screen.queryByText(/a confirmation link has been sent to your email/i)
    ).not.toBeInTheDocument();
    mockForgotPasswordMutate.mockImplementationOnce(() => {
      mockUseForgotPassword.mockReturnValue({
        mutate: mockForgotPasswordMutate,
        isSuccess: true,
        isError: false,
      });
      return Promise.resolve({});
    });

    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: 'success@example.com' } });
    const button = screen.getByRole('button', { name: /reset password/i });

    await waitFor(() => {
      expect(button).toBeEnabled();
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockForgotPasswordMutate).toHaveBeenCalledWith({
        email: 'success@example.com',
      });
    });

    expect(
      screen.getByText(/a confirmation link has been sent to your email/i)
    ).toBeInTheDocument();
  });

  it('does not call mutate if email is invalid', async () => {
    renderComponent();

    const input = screen.getByLabelText(/email/i);
    const button = screen.getByRole('button', { name: /reset password/i });

    fireEvent.change(input, { target: { value: 'bad-email' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockForgotPasswordMutate).not.toHaveBeenCalled();
    });
  });
});
