import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useResetPassword } from '@/api/auth/useResetPassword';
import ResetPassword from './page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

interface ResetPasswordData {
  password: string;
  passwordConfirmation: string;
  code: string;
}

interface MutateOptions {
  onSuccess: () => void;
}

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
}));

jest.mock('@/api/auth/useResetPassword', () => ({
  useResetPassword: jest.fn(),
}));

jest.mock('@/components/LoaderButton', () => ({
  LoaderButton: ({
    text,
    isSubmitting,
    loadingText,
  }: {
    text: string;
    isSubmitting: boolean;
    loadingText: string;
  }) => <button type="submit">{isSubmitting ? loadingText : text}</button>,
}));

jest.mock('@/components/ui', () => {
  const originalModule = jest.requireActual('@/components/ui');
  return {
    __esModule: true,
    ...originalModule,
    Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
      <a href={href}>{children}</a>
    ),
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithQueryClient = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

describe('ResetPassword', () => {
  const mockReplace = jest.fn();
  const mockResetPassword = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockImplementation(() => ({
      replace: mockReplace,
    }));
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: () => 'test-code',
    }));
    (useResetPassword as jest.Mock).mockImplementation(() => ({
      mutate: mockResetPassword,
      isError: false,
      isSuccess: false,
    }));
  });

  it('redirects if no code parameter is present', () => {
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: () => null,
    }));
    renderWithQueryClient(<ResetPassword />);
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('submits form with valid data', async () => {
    renderWithQueryClient(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123' },
    });

    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith(
        {
          password: 'Password123',
          passwordConfirmation: 'Password123',
          code: 'test-code',
        },
        expect.any(Object)
      );
    });
  });

  it('shows success message and redirects on successful submission', async () => {
    (useResetPassword as jest.Mock).mockImplementation(() => ({
      mutate: (data: ResetPasswordData, options: MutateOptions) => {
        options.onSuccess();
      },
      isError: false,
      isSuccess: true,
    }));

    renderWithQueryClient(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123' },
    });

    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);

    expect(screen.getByText(/password reset successful/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(mockReplace).toHaveBeenCalledWith('/auth/sign-in');
      },
      { timeout: 2500 }
    );
  });
});
