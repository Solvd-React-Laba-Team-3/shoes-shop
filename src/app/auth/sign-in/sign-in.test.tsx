import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import SignIn from './page';
import { signIn } from 'next-auth/react';

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

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('SignIn', () => {
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
    expect(screen.getByText(/don’t have an account\?/i)).toBeInTheDocument();
  });

  it('renders the checkbox and it is checked by default, can be toggled', () => {
    render(<SignIn />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('renders the "Forgot password?" link with correct href', () => {
    render(<SignIn />);
    const forgotPasswordLink = screen.getByRole('link', {
      name: /forgot password\?/i,
    });
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute('href', '/auth/forgot-password');
  });

  it('submits form and navigates to a user profile on sucessful login', async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: true });

    render(<SignIn />);

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await screen.findByRole('button', { name: /sign in/i });

    expect(signIn).toHaveBeenCalledWith(
      'credentials',
      expect.objectContaining({
        identifier: 'test@example.com',
        password: '123456',
      })
    );
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('notifies about failed login', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    (signIn as jest.Mock).mockResolvedValue({
      ok: false,
      error: 'Invalid credentials',
    });

    render(<SignIn />);

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'fail@example.com' },
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'wrong1password' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await screen.findByRole('button', { name: /sign in/i });

    expect(alertMock).toHaveBeenCalledWith('Login failed: Invalid credentials');
  });
});
