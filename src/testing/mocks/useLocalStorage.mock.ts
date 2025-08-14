import { LocalStorageValues } from '../types/LocalStorageValues';

export const { useLocalStorage } = jest.requireMock(
  '@/lib/hooks/useLocalStorage'
) as {
  useLocalStorage: jest.Mock<
    LocalStorageValues<number[]>,
    [key: string, initial: number[]]
  >;
};
