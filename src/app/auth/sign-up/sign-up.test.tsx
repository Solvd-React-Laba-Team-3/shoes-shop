import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SignUp from './page';

const mutateMock = jest.fn();

jest.mock('@/api/auth/useRegister', () => ({
  useRegister: jest.fn(() => ({
    mutate: mutateMock,
    error: null,
    isPending: false,
  })),
}));

const routerMock = {
  push: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => routerMock,
}));

describe('SignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all expected form fields and text', () => {
    render(<SignUp />);

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
    render(<SignUp />);
    const nameInput = screen.getByLabelText(/name/i);

    fireEvent.change(nameInput, { target: { value: 'Olha Kucheruk' } });
    expect(nameInput).toHaveValue('Olha Kucheruk');
  });

  test('submits form with valid data', async () => {
    render(<SignUp />);

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
      expect(mutateMock).toHaveBeenCalledWith(
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
    render(<SignUp />);

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
    render(<SignUp />);

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

  test('redirects to sign in on successful registration', async () => {
    render(<SignUp />);

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

    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
    });

    const [, options] = mutateMock.mock.calls[0];
    options.onSuccess();

    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith('/auth/sign-in');
    });
  });
});
