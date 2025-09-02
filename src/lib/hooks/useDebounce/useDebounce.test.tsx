import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  it('should initialize with the correct debouncedValue and isDebouncing true', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));

    expect(result.current.debouncedValue).toBe('initial');
    expect(result.current.isDebouncing).toBe(true);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.debouncedValue).toBe('initial');
    expect(result.current.isDebouncing).toBe(false);
  });

  it('should set isDebouncing to true immediately after value change', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    rerender({ value: 'changed', delay: 500 });

    expect(result.current.isDebouncing).toBe(true);
    expect(result.current.debouncedValue).toBe('initial');
  });

  it('should update debouncedValue after the delay and set isDebouncing to false', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'changed', delay: 500 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.debouncedValue).toBe('changed');
    expect(result.current.isDebouncing).toBe(false);
  });

  it('should clear previous timeout when value changes before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    );

    rerender({ value: 'second', delay: 500 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.debouncedValue).toBe('first');

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current.debouncedValue).toBe('second');
    expect(result.current.isDebouncing).toBe(false);
  });
});
