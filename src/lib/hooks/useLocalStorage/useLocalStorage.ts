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

  const setValue = (next: T | ((prev: T) => T)) => {
    setValueState((prev) => {
      const newValue =
        typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
      return newValue;
    });
  };

  useEffect(() => {
    setValueState(read());
  }, [read]);

  useEffect(() => {
    const syncValue = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === localStorage) {
        try {
          const newValue = event.newValue
            ? (JSON.parse(event.newValue) as T)
            : initialRef.current;
          setValueState(newValue);
        } catch {
          setValueState(initialRef.current);
        }
      }
    };

    window.addEventListener('storage', syncValue);

    return () => {
      window.removeEventListener('storage', syncValue);
    };
  }, [key]);

  return { value, setValue };
}
