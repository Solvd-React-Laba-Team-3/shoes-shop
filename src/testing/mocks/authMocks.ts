type RegisterData = {
  email: string;
  password: string;
};

type OnSuccessFn = (response: { message: string }) => void;

type MutateOptions = {
  onSuccess: OnSuccessFn;
};

export const mockUseRegister = () => ({
  useRegister: () => ({
    mutate: jest.fn((_: RegisterData, { onSuccess }: MutateOptions) => {
      onSuccess({ message: 'Registered' });
    }),
    error: { message: 'Registration failed' },
  }),
});

export const mockPush = jest.fn();

export const mockNextRouter = {
  useRouter: () => ({
    push: mockPush,
  }),
};
