import { useCallback, useEffect, useRef, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialRef = useRef(initialValue);
  const read = useCallback((): T => {
    if (typeof window === 'undefined') return initialRef.current;
    try {
      const raw = window.localStorage.getItem(key);
      return raw == null ? initialRef.current : (JSON.parse(raw) as T);
    } catch {
      return initialRef.current;
    }
  }, [key]);

  const [value, setValueState] = useState<T>(read);

  const setValue = (next: T) => {
    setValueState(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(next));
    }
  };

  useEffect(() => {
    setValueState(read());
  }, [read]);

  return { value, setValue };
}
