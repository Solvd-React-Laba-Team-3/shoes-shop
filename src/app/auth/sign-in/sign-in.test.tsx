import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SignIn from './page';
import { signIn } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

const replaceMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('SignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<SignIn />);

    expect(
      screen.getByRole('heading', { name: /Welcome back/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText(/remember me/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Welcome back! Please enter your details to log into your account./i
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Forgot password\?/i)).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
  });

  it('handles remember me checkbox toggle', () => {
    render(<SignIn />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('renders the "Forgot password?" link with correct href', () => {
    render(<SignIn />);
    const forgotPasswordLink = screen.getByRole('link', {
      name: /forgot password\?/i,
    });
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute('href', '/auth/forgot-password');
  });

  it('submits form and navigates to products on successful login', async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: true, error: null });

    render(<SignIn />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith(
        'credentials',
        expect.objectContaining({
          identifier: 'test@example.com',
          password: 'password123',
          redirect: false,
        })
      );
    });

    expect(replaceMock).toHaveBeenCalledWith('/profile/products');
  });

  it('shows error message on failed login', async () => {
    (signIn as jest.Mock).mockResolvedValue({
      ok: false,
      error: 'Invalid credentials',
    });

    render(<SignIn />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });

    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('clears error message when form inputs change', async () => {
    (signIn as jest.Mock).mockResolvedValue({
      ok: false,
      error: 'Invalid credentials',
    });

    render(<SignIn />);

    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'new@example.com' },
    });

    expect(screen.queryByText(/Invalid credentials/i)).not.toBeInTheDocument();
  });
});
