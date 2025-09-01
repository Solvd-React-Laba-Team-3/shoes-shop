import { renderHook, act } from '@testing-library/react';
import { useFilters } from './useFilters';

jest.mock('@/lib/utils', () => ({
  normalizeToUniqueArray: jest.fn((arr) => Array.from(new Set(arr || []))),
  parseQueryString: jest.fn(() => ({ filters: {} })),
  toQueryString: jest.fn((filters) => JSON.stringify(filters)),
}));

const getMock = jest.fn();
const setMock = jest.fn();
const deleteMock = jest.fn();

jest.mock('../useSearchParams/useSearchParams', () => ({
  useSearchParams: () => ({
    get: getMock,
    set: setMock,
    delete: deleteMock,
  }),
}));

describe('useFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty filters if query is empty', () => {
    getMock.mockReturnValue(undefined);

    const { result } = renderHook(() => useFilters());

    expect(result.current.currentFilters).toEqual({});
  });

  it('should parse filters from query string', () => {
    getMock.mockReturnValue('mock-query');
    const { parseQueryString } = jest.requireMock('@/lib/utils');
    (parseQueryString as jest.Mock).mockReturnValue({ filters: { foo: 1 } });

    const { result } = renderHook(() => useFilters());

    expect(result.current.currentFilters).toEqual({ foo: 1 });
    expect(parseQueryString).toHaveBeenCalledWith('mock-query');
  });

  it('should update filters correctly', () => {
    getMock.mockReturnValue(undefined);

    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.updateFilters('foo', 123);
    });

    expect(setMock).toHaveBeenCalledWith(
      'filters',
      JSON.stringify({ foo: 123 })
    );
  });

  it('should remove filter when value is undefined', () => {
    getMock.mockReturnValue(undefined);

    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.updateFilters('foo', undefined);
    });

    expect(setMock).toHaveBeenCalledWith('filters', JSON.stringify({}));
  });

  it('should clear filters', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.clearFilters();
    });

    expect(deleteMock).toHaveBeenCalledWith('filters');
  });

  it('should return default priceInput if no filters', () => {
    getMock.mockReturnValue(undefined);

    const { result } = renderHook(() => useFilters());

    expect(result.current.priceInput).toEqual([1, 10000]);
  });

  it('should use priceInput from filters', () => {
    getMock.mockReturnValue('query');
    const { parseQueryString } = jest.requireMock('@/lib/utils');
    (parseQueryString as jest.Mock).mockReturnValue({
      filters: { price: { $gte: 10, $lte: 500 } },
    });

    const { result } = renderHook(() => useFilters());

    expect(result.current.priceInput).toEqual([10, 500]);
  });

  it('should toggleSelection add value', () => {
    const { normalizeToUniqueArray } = jest.requireMock('@/lib/utils');
    (normalizeToUniqueArray as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.toggleSelection('foo', true, 42);
    });

    expect(setMock).toHaveBeenCalledWith(
      'filters',
      JSON.stringify({ foo: { id: { $in: [42] } } })
    );
  });

  it('should toggleSelection remove value', () => {
    const { normalizeToUniqueArray } = jest.requireMock('@/lib/utils');
    (normalizeToUniqueArray as jest.Mock).mockReturnValue([42]);

    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.toggleSelection('foo', false, 42);
    });

    expect(setMock).toHaveBeenCalledWith('filters', JSON.stringify({}));
  });
});
