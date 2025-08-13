export type mockLocalStorageReturn<T> = {
  value: T | undefined;
  setValue: jest.Mock<void, [T | ((prev: T) => T)]>;
  isLoading: boolean;
};
