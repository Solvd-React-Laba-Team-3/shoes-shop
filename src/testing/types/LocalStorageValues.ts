export interface LocalStorageValues<T> {
  value: T | undefined;
  setValue: jest.Mock<void, [T | ((prev: T) => T)]>;
  isLoading: boolean;
}
