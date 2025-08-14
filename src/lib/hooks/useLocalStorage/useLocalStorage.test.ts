import { renderHook, act, waitFor } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage (browser paths)', () => {
  const KEY = 'test-key';
  let qmSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
    qmSpy = jest
      .spyOn(global, 'queueMicrotask')
      .mockImplementation((cb: () => void) => cb());
  });

  afterEach(() => {
    qmSpy.mockRestore();
  });

  it('initializes from localStorage when value exists (JSON parses)', async () => {
    localStorage.setItem(KEY, JSON.stringify([1, 2]));
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');

    const { result } = renderHook(() => useLocalStorage<number[]>(KEY, [9]));
    expect(result.current.value).toEqual([1, 2]);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getItemSpy).toHaveBeenCalledWith(KEY);
  });

  it('falls back to initial value when localStorage has null', async () => {
    const { result } = renderHook(() => useLocalStorage<number[]>(KEY, [9]));
    expect(result.current.value).toEqual([9]);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('falls back to initial value when JSON.parse throws', async () => {
    localStorage.setItem(KEY, '{not-json}');
    const { result } = renderHook(() => useLocalStorage<number[]>(KEY, [5]));
    expect(result.current.value).toEqual([5]);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('setValue with direct value persists, dispatches event, and toggles isLoading', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');

    const { result } = renderHook(() => useLocalStorage<number[]>(KEY, []));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setValue([7, 8]);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.value).toEqual([7, 8]);
    expect(setItemSpy).toHaveBeenCalledWith(KEY, JSON.stringify([7, 8]));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const evt = dispatchSpy.mock.calls[0][0] as CustomEvent;
    expect(evt.type).toBe('local-storage-update');
    expect(evt.detail).toEqual({ key: KEY, value: [7, 8] });
  });

  it('setValue with functional updater uses prev, persists, and updates', async () => {
    localStorage.setItem(KEY, JSON.stringify([1]));
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useLocalStorage<number[]>(KEY, []));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.value).toEqual([1]);

    act(() => {
      result.current.setValue((prev) => prev.concat(2));
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.value).toEqual([1, 2]);
    expect(setItemSpy).toHaveBeenCalledWith(KEY, JSON.stringify([1, 2]));
  });

  it('handles localStorage.setItem throwing (logs error but still updates state)', async () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage<number[]>(KEY, []));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setValue([42]);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(errorSpy).toHaveBeenCalled();
    expect(result.current.value).toEqual([42]);
  });

  it('reacts to "storage" events for same key & storageArea', async () => {
    const { result } = renderHook(() => useLocalStorage<number[]>(KEY, []));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.value).toEqual([]);

    act(() => {
      const e = new StorageEvent('storage', {
        key: 'other',
        newValue: JSON.stringify([1]),
      });
      Object.defineProperty(e, 'storageArea', { value: localStorage });
      window.dispatchEvent(e);
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.value).toEqual([]);

    act(() => {
      const e = new StorageEvent('storage', {
        key: KEY,
        newValue: JSON.stringify([9, 9]),
      });
      Object.defineProperty(e, 'storageArea', { value: localStorage });
      window.dispatchEvent(e);
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.value).toEqual([9, 9]);

    act(() => {
      const e = new StorageEvent('storage', {
        key: KEY,
        newValue: '{bad-json}',
      });
      Object.defineProperty(e, 'storageArea', { value: localStorage });
      window.dispatchEvent(e);
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.value).toEqual([]);
  });

  it('handles custom "local-storage-update" events (self-sync)', async () => {
    const { result } = renderHook(() => useLocalStorage<number[]>(KEY, []));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      window.dispatchEvent(
        new CustomEvent('local-storage-update', {
          detail: { key: KEY, value: [3, 4, 5] },
        })
      );
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.value).toEqual([3, 4, 5]);
  });

  it('cleans up event listeners on unmount', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useLocalStorage<number[]>(KEY, []));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('storage', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith(
      'local-storage-update',
      expect.any(Function)
    );
  });
});
