import { screen, waitFor, fireEvent } from '@testing-library/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useResetPassword } from '@/api/auth/useResetPassword';
import ResetPassword from './page';
import { render } from '@/testing/utils';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
}));

jest.mock('@/api/auth/useResetPassword', () => ({
  useResetPassword: jest.fn(),
}));

describe('ResetPassword', () => {
  const replaceMock = jest.fn();
  const resetPasswordMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockImplementation(() => ({
      replace: replaceMock,
    }));
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: () => 'test-code',
    }));
    (useResetPassword as jest.Mock).mockImplementation(() => ({
      mutate: resetPasswordMock,
      isError: false,
      isSuccess: false,
    }));
  });

  it('redirects if no code parameter is present', () => {
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: () => null,
    }));
    render(<ResetPassword />);
    expect(replaceMock).toHaveBeenCalledWith('/');
  });

  it('submits form with valid data', async () => {
    render(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123' },
    });

    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(resetPasswordMock).toHaveBeenCalledWith(
        {
          password: 'Password123',
          passwordConfirmation: 'Password123',
          code: 'test-code',
        },
        expect.any(Object)
      );
    });
  });

  it('shows success message when isSuccess is true', async () => {
    (useResetPassword as jest.Mock).mockImplementation(() => ({
      mutate: jest.fn(),
      isError: false,
      isSuccess: true,
    }));

    render(<ResetPassword />);

    expect(screen.getByText(/password reset successful/i)).toBeInTheDocument();
  });

  it('redirects after successful form submission', async () => {
    jest.useFakeTimers();

    render(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123' },
    });

    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(resetPasswordMock).toHaveBeenCalled();
    });

    const mutateCall = resetPasswordMock.mock.calls[0];
    const options = mutateCall[1];
    options.onSuccess();

    jest.advanceTimersByTime(2000);

    expect(replaceMock).toHaveBeenCalledWith('/auth/sign-in');

    jest.useRealTimers();
  });
});
