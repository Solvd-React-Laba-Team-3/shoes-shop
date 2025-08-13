import { mockLocalStorageReturn } from '../types/mockLocalStorageReturn';

export const { useLocalStorage } = jest.requireMock(
  '@/lib/hooks/useLocalStorage'
) as {
  useLocalStorage: jest.Mock<
    mockLocalStorageReturn<number[]>,
    [key: string, initial: number[]]
  >;
};
