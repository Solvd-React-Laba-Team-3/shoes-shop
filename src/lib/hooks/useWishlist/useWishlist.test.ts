import { renderHook, act } from '@testing-library/react';
import { useWishlist } from './useWishlist';
import { LocalStorageValues } from '@/testing/types/LocalStorageValues';
import { useLocalStorage } from '../useLocalStorage/useLocalStorage';

jest.mock('../useLocalStorage/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}));

describe('useWishlist', () => {
  const setValue = jest.fn();

  const setMock = (opts: Partial<LocalStorageValues<number[]>> = {}) => {
    (useLocalStorage as jest.Mock).mockReturnValue({
      value: [],
      setValue,
      isLoading: false,
      ...opts,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls useLocalStorage with the correct key and default', () => {
    setMock();
    renderHook(() => useWishlist());
    expect(useLocalStorage).toHaveBeenCalledTimes(1);
    expect(useLocalStorage).toHaveBeenCalledWith('wishlist', []);
  });

  it('returns items and isLoading from useLocalStorage', () => {
    setMock({ value: [1, 2], isLoading: true });
    const { result } = renderHook(() => useWishlist());
    expect(result.current.items).toEqual([1, 2]);
    expect(result.current.isLoading).toBe(true);
  });

  it('addItem adds a new id when not present', () => {
    setMock({ value: [1, 3] });
    const { result, rerender } = renderHook(() => useWishlist());

    act(() => result.current.addItem(2));
    expect(setValue).toHaveBeenCalledWith([1, 3, 2]);

    jest.clearAllMocks();
    setMock({ value: [1, 2, 3] });
    rerender();

    act(() => result.current.addItem(2));
    expect(setValue).toHaveBeenCalledWith([1, 2, 3]);
  });

  it('removeItem removes an existing id', () => {
    setMock({ value: [10, 20, 30] });
    const { result } = renderHook(() => useWishlist());

    act(() => result.current.removeItem(20));
    expect(setValue).toHaveBeenCalledWith([10, 30]);
  });

  it('removeItem still calls setter when id not present (no-op content)', () => {
    setMock({ value: [5, 6] });
    const { result } = renderHook(() => useWishlist());

    act(() => result.current.removeItem(999));
    expect(setValue).toHaveBeenCalledWith([5, 6]);
  });

  it('handles undefined items from useLocalStorage', () => {
    setMock({ value: undefined });
    const { result } = renderHook(() => useWishlist());
    expect(result.current.items).toEqual([]);
  });
});
