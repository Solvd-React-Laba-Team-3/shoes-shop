import { LocalStorageValues } from '../types/LocalStorageValues';

export const useLocalStorage = jest.fn() as jest.Mock<
  LocalStorageValues<number[]>,
  [key: string, initial: number[]]
>;
