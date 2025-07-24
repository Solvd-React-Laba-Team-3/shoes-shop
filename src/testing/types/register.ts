export type RegisterData = {
  email: string;
  password: string;
};

export type OnSuccessFn = (response: { message: string }) => void;

export type MutateOptions = {
  onSuccess: OnSuccessFn;
};
