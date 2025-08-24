import { useCallback, useEffect, useRef, useState } from 'react';

interface IntersectionObserverArgs {
  rootMargin?: string;
  threshold?: number | number[];
  onChange?: (
    isIntersecting: boolean,
    entry: IntersectionObserverEntry
  ) => void;
}

interface IntersectionReturn {
  ref: (node?: Element | null) => void;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
}

export function useIntersectionObserver({
  threshold = 0,
  rootMargin = '0%',
  onChange,
}: IntersectionObserverArgs): IntersectionReturn {
  const [ref, setRef] = useState<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>();

  const callbackRef = useRef(onChange);
  callbackRef.current = onChange;

  useEffect(() => {
    if (!ref || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((observerEntry) => {
          const intersecting = observerEntry.isIntersecting;

          setIsIntersecting(intersecting);
          setEntry(observerEntry);

          callbackRef.current?.(intersecting, observerEntry);
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);

  const refCallback = useCallback((node?: Element | null) => {
    setRef(node || null);
  }, []);

  return {
    ref: refCallback,
    isIntersecting,
    entry,
  };
}
