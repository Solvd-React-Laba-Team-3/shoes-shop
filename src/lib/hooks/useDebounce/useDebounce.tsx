'use client';

import { useEffect, useState } from 'react';

export const useDebounce = (value: string, delay: number) => {
  const [isDebouncing, setisDebouncing] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    setisDebouncing(true);

    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
      setisDebouncing(false);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return { debouncedValue, isDebouncing };
};
