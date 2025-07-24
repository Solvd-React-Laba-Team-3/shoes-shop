import { RegisterData, MutateOptions } from '../types/register';

export const mockSignIn = jest.fn();
export const mockSignOut = jest.fn();
export const mockUseSession = jest.fn();

jest.mock('next-auth/react', () => ({
  signIn: mockSignIn,
  signOut: mockSignOut,
  useSession: mockUseSession,
}));

export const mockForgotPasswordMutate = jest.fn();

export const mockUseForgotPassword = jest.fn(() => ({
  mutate: mockForgotPasswordMutate,
  isSuccess: false,
  isError: false,
}));

jest.mock('@/api/auth/useForgotPassword', () => ({
  useForgotPassword: mockUseForgotPassword,
}));

export const mockSession = {
  user: {
    username: 'John Doe',
  },
};

export const loggedInSession = {
  data: {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
};

export const mockUseRegister = () => ({
  useRegister: () => ({
    mutate: jest.fn((_: RegisterData, { onSuccess }: MutateOptions) => {
      onSuccess({ message: 'Registered' });
    }),
    error: { message: 'Registration failed' },
  }),
});
