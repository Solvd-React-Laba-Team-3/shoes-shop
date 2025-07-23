import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SignUp from './page';
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

jest.mock('@/api/auth/useRegister', () => ({
  useRegister: () => ({
    mutate: jest.fn((_, { onSuccess }) => {
      onSuccess({ message: 'Registered' });
    }),
    error: { message: 'Registration failed' },
  }),
}));

describe('SignUp', () => {
  test('renders all expected form fields and text', () => {
    render(<SignUp />, { wrapper: TestWrapper });

    expect(
      screen.getByRole('heading', { name: /create an account/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm password/i)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
  });

  test('value of the input is updated correctly', () => {
    render(<SignUp />, { wrapper: TestWrapper });
    const nameInput = screen.getByLabelText(/name/i);

    fireEvent.change(nameInput, { target: { value: 'Olha Kucheruk' } });
    expect(nameInput).toHaveValue('Olha Kucheruk');
  });

  test('submits form with valid data', async () => {
    render(<SignUp />, { wrapper: TestWrapper });

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Olha' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'olha@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign up/i })
      ).toBeInTheDocument();
    });
  });

  test('test validation errors on empty submit', async () => {
    render(<SignUp />, { wrapper: TestWrapper });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    expect(
      screen.getByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Please confirm your password/i)
    ).toBeInTheDocument();
  });

  test('shows error if passwords do not match', async () => {
    render(<SignUp />, { wrapper: TestWrapper });
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(
      await screen.findByText(/Passwords do not match/i)
    ).toBeInTheDocument();
  });

  test('shows API error message', () => {
    render(<SignUp />, { wrapper: TestWrapper });
    expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
  });

  test('calls handlePrev and handleNext when ReviewPanel buttons are clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<SignUp />, { wrapper: TestWrapper });

    const buttons = screen.getAllByRole('button');
    const prevButton = buttons[1];
    const nextButton = buttons[2];

    fireEvent.click(prevButton);
    fireEvent.click(nextButton);

    expect(consoleSpy).toHaveBeenCalledWith('Previous feedback');
    expect(consoleSpy).toHaveBeenCalledWith('Next feedback');

    consoleSpy.mockRestore();
  });
});
