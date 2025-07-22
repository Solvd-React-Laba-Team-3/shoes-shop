import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ResetPassword from './page';

// Create a new QueryClient instance for each test run
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
};

describe('ResetPassword', () => {
  beforeEach(() => {
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
    const inputs = screen.getAllByPlaceholderText('at least 8 characters');
    expect(inputs.length).toBe(2);

    const passwordInput = inputs.find((input) => input.id === 'password');
    const confirmInput = inputs.find(
      (input) => input.id === 'Confirm password'
    );

    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute(
      'placeholder',
      'at least 8 characters'
    );

    expect(confirmInput).toBeInTheDocument();
    expect(confirmInput).toHaveAttribute('type', 'password');
    expect(confirmInput).toHaveAttribute(
      'placeholder',
      'at least 8 characters'
    );
  });

  it('renders submit button with correct text and attributes', () => {
    const button = screen.getByRole('button', { name: /reset password/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveStyle('margin: 37px 0 20px');
  });

  it('renders "Back to log in" link with correct href', () => {
    expect(screen.getByText(/back to/i)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /log in/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/auth/sign-in');
  });

  it('renders labels for password fields', () => {
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm password')).toBeInTheDocument();
  });
});
