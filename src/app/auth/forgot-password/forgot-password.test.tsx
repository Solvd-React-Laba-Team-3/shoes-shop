import { fireEvent, render, screen } from '@testing-library/react';
import ForgotPassword from './page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
    renderComponent();
  });

  it('renders title and description', () => {
    expect(
      screen.getByRole('heading', { name: /forgot password\?/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/we’ll send you reset instructions/i)
    ).toBeInTheDocument();
  });

  it('renders email input with correct attributes', () => {
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter your email');
  });

  it('renders reset password button', () => {
    const button = screen.getByRole('button', { name: /reset password/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders "Back to log in" link', () => {
    expect(screen.getByText(/back to/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /log in/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/auth/sign-in');
  });

  it('allows typing in email field', () => {
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input).toHaveValue('test@example.com');
  });

  it('submits form when reset button clicked (no actual logic yet)', () => {
    const input = screen.getByLabelText(/email/i);
    const button = screen.getByRole('button', { name: /reset password/i });

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    expect(input).toHaveValue('test@example.com');
  });
});
