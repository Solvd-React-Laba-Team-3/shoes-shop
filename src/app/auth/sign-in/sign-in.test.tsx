import { render, screen, fireEvent } from '@testing-library/react';
import SignIn from './page';
import '@testing-library/jest-dom';

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
});
