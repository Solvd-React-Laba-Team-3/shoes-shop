import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SignUp from './page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockRouter = {
  push: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

const mockMutate = jest.fn();
jest.mock('@/api/auth/useRegister', () => ({
  useRegister: () => ({
    mutate: mockMutate,
    error: null,
    isPending: false,
  }),
}));

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

describe('SignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });

  test('value of the input is updated correctly', () => {
    render(<SignUp />, { wrapper: TestWrapper });
    const nameInput = screen.getByLabelText(/name/i);

    fireEvent.change(nameInput, { target: { value: 'Olha Kucheruk' } });
    expect(nameInput).toHaveValue('Olha Kucheruk');
  });

  test('submits form with valid data', async () => {
    render(<SignUp />, { wrapper: TestWrapper });

    const testData = {
      name: 'Olha Kucheruk',
      email: 'olha@example.com',
      password: 'password123',
    };

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: testData.name },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: testData.email },
    });
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: testData.password },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: testData.password },
    });

    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          username: testData.name,
          email: testData.email,
          password: testData.password,
        },
        expect.any(Object)
      );
    });
  });

  test('shows validation errors on empty submit', async () => {
    render(<SignUp />, { wrapper: TestWrapper });

    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/invalid email address/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/please confirm your password/i)
    ).toBeInTheDocument();
  });

  test('shows error if passwords do not match', async () => {
    render(<SignUp />, { wrapper: TestWrapper });

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Olha Kucheruk' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'olha@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password456' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
  });
});
