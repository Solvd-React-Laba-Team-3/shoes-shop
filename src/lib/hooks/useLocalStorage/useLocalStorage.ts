import { useCallback, useEffect, useRef, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialRef = useRef(initialValue);
  const [isLoading, setIsLoading] = useState(true);

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

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      queueMicrotask(() => {
        setIsLoading(true);
        const computeNext = (prev: T): T => {
          const nextValue =
            typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(key, JSON.stringify(nextValue));
              window.dispatchEvent(
                new CustomEvent('local-storage-update', {
                  detail: { key, value: nextValue },
                })
              );
            } catch (error) {
              console.error('Failed to save to localStorage:', error);
            }
          }
          return nextValue;
        };

        setValueState(computeNext);
        queueMicrotask(() => {
          setIsLoading(false);
        });
      });
    },
    [key]
  );

  useEffect(() => {
    queueMicrotask(() => {
      setValueState(read());
      setIsLoading(false);
    });
  }, [read]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === localStorage) {
        queueMicrotask(() => {
          setIsLoading(true);
          try {
            const newValue = event.newValue
              ? (JSON.parse(event.newValue) as T)
              : initialRef.current;
            queueMicrotask(() => {
              setValueState(newValue);
              setIsLoading(false);
            });
          } catch {
            queueMicrotask(() => {
              setValueState(initialRef.current);
              setIsLoading(false);
            });
          }
        });
      }
    };

    const handleCustomEvent = (
      event: CustomEvent<{ key: string; value: T }>
    ) => {
      if (event.detail.key === key) {
        queueMicrotask(() => {
          setIsLoading(true);
          queueMicrotask(() => {
            setValueState(event.detail.value);
            setIsLoading(false);
          });
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(
      'local-storage-update',
      handleCustomEvent as EventListener
    );

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'local-storage-update',
        handleCustomEvent as EventListener
      );
    };
  }, [key]);

  return { value, setValue, isLoading };
}
