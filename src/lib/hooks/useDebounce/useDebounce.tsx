'use client';

import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number) {
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    setIsDebouncing(true);

    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return { debouncedValue, isDebouncing };
}
