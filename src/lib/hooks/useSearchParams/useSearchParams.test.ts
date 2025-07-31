import { renderHook, act } from '@testing-library/react';
import { useSearchParams } from './useSearchParams';
import {
  usePathname,
  useSearchParams as useNextSearchParams,
} from 'next/navigation';

const mockSearchParams = new URLSearchParams(
  'search=Shoes&filters=%7B%22size%22%3A13%7D'
);

const replaceState = jest.fn();

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

beforeEach(() => {
  (useNextSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  (usePathname as jest.Mock).mockReturnValue('/products');

  Object.defineProperty(window, 'history', {
    writable: true,
    value: {
      replaceState,
    },
  });

  replaceState.mockClear();
});

describe('useSearchParams', () => {
  it('should return decoded value from get()', () => {
    const { result } = renderHook(() => useSearchParams());
    expect(result.current.get('search')).toBe('Shoes');
  });

  it('should return undefined if key not found in get()', () => {
    const { result } = renderHook(() => useSearchParams());
    expect(result.current.get('nonexistent')).toBeUndefined();
  });

  it('should set param and call replaceState', () => {
    const { result } = renderHook(() => useSearchParams());

    act(() => {
      result.current.set('page', 2);
    });

    expect(replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/products?search=Shoes&filters=%7B%22size%22%3A13%7D&page=2'
    );
  });

  it('should delete param if value is undefined in set()', () => {
    const { result } = renderHook(() => useSearchParams());

    act(() => {
      result.current.set('search', undefined);
    });

    expect(replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/products?filters=%7B%22size%22%3A13%7D'
    );
  });

  it('should delete param using delete()', () => {
    const { result } = renderHook(() => useSearchParams());

    act(() => {
      result.current.delete('filters');
    });

    expect(replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/products?search=Shoes'
    );
  });
});
