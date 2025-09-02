import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useHideOnScroll } from './useHideOnScroll';

describe('useHideOnScroll', () => {
  let rafSpy: jest.SpyInstance;

  beforeAll(() => {
    rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb) => {
        cb(0);
        return 0;
      });
  });

  afterAll(() => {
    rafSpy.mockRestore();
  });

  beforeEach(() => {
    window.scrollY = 0;
  });

  it('should return false initially', () => {
    const { result } = renderHook(() => useHideOnScroll());
    expect(result.current).toBe(false);
  });

  it('should hide when scrolling down more than HIDE_OFFSET', () => {
    const { result } = renderHook(() => useHideOnScroll());

    act(() => {
      window.scrollY = 300;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(true);
  });

  it('should show when scrolling up more than HIDE_OFFSET', () => {
    const { result } = renderHook(() => useHideOnScroll());

    act(() => {
      window.scrollY = 400;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe(true);

    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(false);
  });

  it('should not hide if scroll difference is less than HIDE_OFFSET', () => {
    const { result } = renderHook(() => useHideOnScroll());

    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(false);
  });

  it('should always show if scrollY < 200', () => {
    const { result } = renderHook(() => useHideOnScroll());

    act(() => {
      window.scrollY = 150;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(false);
  });
});
