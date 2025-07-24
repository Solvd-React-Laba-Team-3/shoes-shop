import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useResetPassword } from '@/api/auth/useResetPassword';
import ResetPassword from './page';
import { ReactElement } from 'react';

const mockRouter = {
  replace: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => ({
    get: () => 'mock-code',
  }),
}));

const mockResetPassword = jest.fn();
jest.mock('@/api/auth/useResetPassword', () => ({
  useResetPassword: () => ({
    mutate: mockResetPassword,
    isError: false,
    isSuccess: false,
  }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (ui: ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
};

describe('ResetPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithQueryClient(<ResetPassword />);
  });

  it('renders without crashing and shows title and description', () => {
    expect(
      screen.getByRole('heading', { name: /reset password/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/please create new password here/i)
    ).toBeInTheDocument();
  });

  it('renders password and confirm password inputs with correct attributes', () => {
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute(
      'placeholder',
      'at least 6 characters'
    );

    expect(confirmInput).toBeInTheDocument();
    expect(confirmInput).toHaveAttribute('type', 'password');
    expect(confirmInput).toHaveAttribute(
      'placeholder',
      'at least 6 characters'
    );
  });

  it('renders submit button with correct text', () => {
    const button = screen.getByRole('button', { name: /reset password/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders "Back to log in" link with correct href', () => {
    expect(screen.getByText(/back to/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /log in/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/auth/sign-in');
  });

  it('redirects to home if no code is provided', () => {
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: () => null,
    }));

    renderWithQueryClient(<ResetPassword />);
    expect(mockRouter.replace).toHaveBeenCalledWith('/');
  });

  it('submits form with valid data', async () => {
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });

    fireEvent.submit(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith(
        {
          password: 'password123',
          passwordConfirmation: 'password123',
          code: 'mock-code',
        },
        expect.any(Object)
      );
    });
  });

  it('shows success message and redirects after successful reset', async () => {
    (useResetPassword as jest.Mock).mockImplementation(() => ({
      mutate: mockResetPassword,
      isError: false,
      isSuccess: true,
    }));

    renderWithQueryClient(<ResetPassword />);

    expect(screen.getByText(/password reset successful/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/auth/sign-in');
      },
      { timeout: 2500 }
    );
  });

  it('shows error message on failed reset', () => {
    (useResetPassword as jest.Mock).mockImplementation(() => ({
      mutate: mockResetPassword,
      isError: true,
      isSuccess: false,
    }));

    renderWithQueryClient(<ResetPassword />);

    expect(screen.getByText(/failed to reset password/i)).toBeInTheDocument();
  });
});
