import { renderHook, act } from '@testing-library/react';
import { useSearchsParams } from './useSearchParams';
import { useRouter, useSearchParams } from 'next/navigation';

const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams(
  'search=Shoes&filters=%7B%22size%22%3A13%7D'
);

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  mockPush.mockReset();
});

describe('useSearchsParams', () => {
  it('should return decoded value from get()', () => {
    const { result } = renderHook(() => useSearchsParams());
    expect(result.current.get('search')).toBe('Shoes');
  });

  it('should return undefined if key not found in get()', () => {
    const { result } = renderHook(() => useSearchsParams());
    expect(result.current.get('nonexistent')).toBeUndefined();
  });

  it('should set param and push to router', () => {
    const { result } = renderHook(() => useSearchsParams());

    act(() => {
      result.current.set('page', 2);
    });

    expect(mockPush).toHaveBeenCalledWith(
      '?search=Shoes&filters=%7B%22size%22%3A13%7D&page=2'
    );
  });

  it('should delete param if value is undefined in set()', () => {
    const { result } = renderHook(() => useSearchsParams());

    act(() => {
      result.current.set('search', undefined);
    });

    expect(mockPush).toHaveBeenCalledWith('?filters=%7B%22size%22%3A13%7D');
  });

  it('should delete param using delete()', () => {
    const { result } = renderHook(() => useSearchsParams());

    act(() => {
      result.current.delete('filters');
    });

    expect(mockPush).toHaveBeenCalledWith('?search=Shoes');
  });
});
