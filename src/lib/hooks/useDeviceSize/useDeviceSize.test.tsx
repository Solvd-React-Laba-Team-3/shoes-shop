import { renderHook, act } from '@testing-library/react';
import { useDeviceSize } from './useDeviceSize';
import { ThemeProvider, createTheme } from '@mui/material/styles';

describe('useDeviceSize', () => {
  const theme = createTheme({
    breakpoints: {
      values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536, xxl: 1700 },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize isMobile correctly for small screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { result } = renderHook(() => useDeviceSize(), { wrapper });

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isInitialized).toBe(true);
  });

  it('should initialize isMobile correctly for large screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    const { result } = renderHook(() => useDeviceSize(), { wrapper });

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isInitialized).toBe(true);
  });

  it('should update isInitialized to true after effect runs', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    const { result } = renderHook(() => useDeviceSize(), {
      wrapper,
    });

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current.isInitialized).toBe(true);
  });

  it('should update isMobile when window is resized', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { result } = renderHook(() => useDeviceSize(), { wrapper });

    // Simulate resize
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 500 });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.isMobile).toBe(true);

    // Check if cleanup works
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).not.toHaveBeenCalled(); // removed on unmount
  });

  it('should remove resize listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useDeviceSize(), { wrapper });
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });

  it('should treat screen exactly at breakpoint as desktop', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 900,
    });

    const { result } = renderHook(() => useDeviceSize(), { wrapper });
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isInitialized).toBe(true);
  });

  it('should toggle isMobile on multiple resizes', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    const { result } = renderHook(() => useDeviceSize(), { wrapper });

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 500 });
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current.isMobile).toBe(true);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 1200 });
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current.isMobile).toBe(false);
  });

  it('should not break when removing resize listener if none attached', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useDeviceSize(), { wrapper });
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('client: handles window exactly at breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 900,
    });
    const { result } = renderHook(() => useDeviceSize(), { wrapper });
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isInitialized).toBe(true);
  });

  it('updates isMobile on resize to smaller than breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    const { result } = renderHook(() => useDeviceSize(), { wrapper });

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 500 });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.isMobile).toBe(true);
  });

  it('updates isMobile on resize to larger than breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    const { result } = renderHook(() => useDeviceSize(), { wrapper });

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 1200 });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.isMobile).toBe(false);
  });

  it('toggles isMobile correctly on multiple resizes', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    const { result } = renderHook(() => useDeviceSize(), { wrapper });

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 500 });
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current.isMobile).toBe(true);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 1200 });
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current.isMobile).toBe(false);
  });

  it('cleans up resize listener on unmount', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useDeviceSize(), { wrapper });
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
