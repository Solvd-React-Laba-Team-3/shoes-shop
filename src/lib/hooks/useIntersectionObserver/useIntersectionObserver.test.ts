import { renderHook, act } from '@testing-library/react';
import { useIntersectionObserver } from './useIntersectionObserver';

interface FakeIOInstance {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  observe: jest.Mock;
  unobserve: jest.Mock;
  disconnect: jest.Mock;
}

describe('useIntersectionObserver', () => {
  const originalIO = global.IntersectionObserver;
  const instances: FakeIOInstance[] = [];
  let IOConstructor: jest.Mock;

  const makeEntry = (
    target: Element,
    isIntersecting: boolean
  ): IntersectionObserverEntry =>
    ({
      target,
      isIntersecting,
      time: 0,
      rootBounds: null,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
    }) as unknown as IntersectionObserverEntry;

  const trigger = (idx: number, entries: IntersectionObserverEntry[]) => {
    const inst = instances[idx];
    inst.callback(entries, inst as unknown as IntersectionObserver);
  };

  beforeEach(() => {
    instances.length = 0;
    IOConstructor = jest.fn(
      (
        cb: IntersectionObserverCallback,
        options?: IntersectionObserverInit
      ) => {
        const inst: FakeIOInstance = {
          callback: cb,
          options,
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
        instances.push(inst);
        return inst as unknown as IntersectionObserver;
      }
    );
    global.IntersectionObserver = IOConstructor;
  });

  afterEach(() => {
    global.IntersectionObserver = originalIO;
    jest.clearAllMocks();
  });

  it('does nothing until a node is provided', () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ threshold: 0.25, rootMargin: '10px' })
    );
    expect(IOConstructor).not.toHaveBeenCalled();
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBeUndefined();
  });

  it('creates an observer with options and observes the node', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useIntersectionObserver({
        threshold: [0, 0.5, 1],
        rootMargin: '8px 0px',
        onChange,
      })
    );

    const node = document.createElement('div');
    act(() => result.current.ref(node));

    expect(IOConstructor).toHaveBeenCalledTimes(1);
    expect(instances[0].options).toEqual({
      threshold: [0, 0.5, 1],
      rootMargin: '8px 0px',
    });
    expect(instances[0].observe).toHaveBeenCalledWith(node);
  });

  it('updates state and calls onChange when entries report intersection changes', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useIntersectionObserver({ onChange }));

    const node = document.createElement('div');
    act(() => result.current.ref(node));

    act(() => trigger(0, [makeEntry(node, true)]));
    expect(result.current.isIntersecting).toBe(true);
    expect(result.current.entry?.target).toBe(node);
    expect(onChange).toHaveBeenLastCalledWith(
      true,
      expect.objectContaining({ target: node })
    );

    act(() => trigger(0, [makeEntry(node, false)]));
    expect(result.current.isIntersecting).toBe(false);
    expect(onChange).toHaveBeenLastCalledWith(false, expect.any(Object));
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('uses the latest onChange across re-renders', () => {
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();

    const { result, rerender } = renderHook(
      (p: { onChange?: (i: boolean, e: IntersectionObserverEntry) => void }) =>
        useIntersectionObserver({ onChange: p.onChange }),
      { initialProps: { onChange: onChange1 } }
    );

    const node = document.createElement('div');
    act(() => result.current.ref(node));

    rerender({ onChange: onChange2 });
    act(() => trigger(0, [makeEntry(node, true)]));

    expect(onChange1).not.toHaveBeenCalled();
    expect(onChange2).toHaveBeenCalledTimes(1);
  });

  it('disconnects on unmount', () => {
    const { result, unmount } = renderHook(() =>
      useIntersectionObserver({ threshold: 0.2 })
    );
    const node = document.createElement('div');
    act(() => result.current.ref(node));

    unmount();
    expect(instances[0].disconnect).toHaveBeenCalledTimes(1);
  });

  it('recreates the observer when the ref node changes', () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ threshold: 0 })
    );

    const a = document.createElement('div');
    const b = document.createElement('div');

    act(() => result.current.ref(a));
    expect(IOConstructor).toHaveBeenCalledTimes(1);
    expect(instances[0].observe).toHaveBeenCalledWith(a);

    act(() => result.current.ref(b));
    expect(instances[0].disconnect).toHaveBeenCalledTimes(1);
    expect(IOConstructor).toHaveBeenCalledTimes(2);
    expect(instances[1].observe).toHaveBeenCalledWith(b);
  });

  it('is a no-op if IntersectionObserver is not available', () => {
    Reflect.deleteProperty(globalThis, 'IntersectionObserver');
    Reflect.deleteProperty(window, 'IntersectionObserver');

    const { result } = renderHook(() =>
      useIntersectionObserver({ threshold: 0.3, rootMargin: '5px' })
    );
    const node = document.createElement('div');
    act(() => result.current.ref(node));

    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBeUndefined();
  });

  it('omits onChange safely and still updates state (multiple entries in one callback)', () => {
    const { result } = renderHook(() => useIntersectionObserver({}));
    const node = document.createElement('div');
    act(() => result.current.ref(node));

    act(() => trigger(0, [makeEntry(node, false), makeEntry(node, true)]));
    expect(result.current.isIntersecting).toBe(true);
    expect(result.current.entry?.target).toBe(node);
  });

  it('recreates observer when options change (threshold/rootMargin)', () => {
    const { result, rerender } = renderHook(
      (p: { threshold: number | number[]; rootMargin: string }) =>
        useIntersectionObserver({
          threshold: p.threshold,
          rootMargin: p.rootMargin,
        }),
      { initialProps: { threshold: 0, rootMargin: '0%' } }
    );

    const node = document.createElement('div');
    act(() => result.current.ref(node));

    expect(IOConstructor).toHaveBeenCalledTimes(1);
    expect(instances[0].options).toEqual({ threshold: 0, rootMargin: '0%' });

    rerender({ threshold: 0.5, rootMargin: '10px 0' });
    expect(instances[0].disconnect).toHaveBeenCalledTimes(1);
    expect(IOConstructor).toHaveBeenCalledTimes(2);
    expect(instances[1].options).toEqual({
      threshold: 0.5,
      rootMargin: '10px 0',
    });
  });

  it('uses default options and handles ref(null/undefined) cleanly', () => {
    const { result } = renderHook(() => useIntersectionObserver({}));
    const node = document.createElement('div');

    act(() => result.current.ref(node));
    expect(instances[0].options).toEqual({ threshold: 0, rootMargin: '0%' });
    expect(instances[0].observe).toHaveBeenCalledWith(node);

    act(() => result.current.ref(undefined));
    expect(instances[0].disconnect).toHaveBeenCalledTimes(1);
    expect(IOConstructor).toHaveBeenCalledTimes(1);
  });
});
