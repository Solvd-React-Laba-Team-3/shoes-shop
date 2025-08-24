import { renderHook, act } from '@testing-library/react';
import { useRecentlyViewed } from './useRecentlyViewed';
import { LocalStorageValues } from '@/testing/types/LocalStorageValues';
import { useLocalStorage } from '@/testing/mocks/useLocalStorage.mock';

jest.mock('@/constants/recentlyViewedLimit', () => ({
  RECENTLY_VIEWED_LIMIT: 5,
}));

jest.mock('../useLocalStorage/useLocalStorage', () => {
  const { useLocalStorage } = jest.requireActual(
    '@/testing/mocks/useLocalStorage.mock'
  );
  return { useLocalStorage };
});

describe('useRecentlyViewed', () => {
  const setValue = jest.fn();

  const setMock = (opts: Partial<LocalStorageValues<number[]>> = {}) => {
    useLocalStorage.mockReturnValue({
      value: [],
      setValue,
      isLoading: false,
      ...opts,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls useLocalStorage with correct key and default', () => {
    setMock();
    renderHook(() => useRecentlyViewed());
    expect(useLocalStorage).toHaveBeenCalledTimes(1);
    expect(useLocalStorage).toHaveBeenCalledWith('recently-viewed', []);
  });

  it('returns items and isLoading from useLocalStorage', () => {
    setMock({ value: [10, 20, 30], isLoading: true });
    const { result } = renderHook(() => useRecentlyViewed());
    expect(result.current.items).toEqual([10, 20, 30]);
    expect(result.current.isLoading).toBe(true);
  });

  it('addItem uses functional updater that moves id to front and dedupes', () => {
    setMock({ value: [2, 3, 4] });
    const { result } = renderHook(() => useRecentlyViewed());

    act(() => result.current.addItem(3));
    expect(setValue).toHaveBeenCalledTimes(1);
    const updater = setValue.mock.calls[0][0];
    expect(typeof updater).toBe('function');

    const prev = [2, 3, 4, 3, 2];
    const next = updater(prev);
    expect(next).toEqual([3, 2, 4, 2]);
  });

  it('addItem adds a new id at front and respects limit when under limit', () => {
    setMock({ value: [10, 11] });
    const { result } = renderHook(() => useRecentlyViewed());

    act(() => result.current.addItem(99));
    const updater = setValue.mock.calls[0][0];
    const prev = [10, 11];
    const next = updater(prev);
    expect(next).toEqual([99, 10, 11]);
    expect(next.length).toBeLessThanOrEqual(5);
  });

  it('enforces RECENTLY_VIEWED_LIMIT when exceeding limit', () => {
    setMock({ value: [1, 2, 3, 4, 5] });
    const { result } = renderHook(() => useRecentlyViewed());

    act(() => result.current.addItem(99));
    const updater = setValue.mock.calls[0][0];
    const prev = [1, 2, 3, 4, 5];
    const next = updater(prev);
    expect(next).toEqual([99, 1, 2, 3, 4]);
    expect(next).toHaveLength(5);
  });

  it('works with empty previous list', () => {
    setMock({ value: [] });
    const { result } = renderHook(() => useRecentlyViewed());

    act(() => result.current.addItem(7));
    const updater = setValue.mock.calls[0][0];
    const next = updater([]);
    expect(next).toEqual([7]);
  });
});
