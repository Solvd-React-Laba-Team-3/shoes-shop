'use client';
import {
  useSearchParams as useNextSearchParams,
  useRouter,
} from 'next/navigation';

export const useSearchsParams = () => {
  const searchParams = useNextSearchParams();
  const router = useRouter();

  const set = (key: string, value: string | number | boolean | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === undefined) {
      params.delete(key);
      router.push(`?${params.toString()}`);
      return;
    }

    params.set(key, String(value));
    router.push(`?${params.toString()}`);
  };
  const get = (key: string) => {
    const value = searchParams.get(key);
    return value ? decodeURIComponent(value) : undefined;
  };

  const remove = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    console.log('Removing key:', key, 'New params:', params.get('filters'));
    router.push(`?${params.toString()}`);
  };

  return {
    set,
    get,
    delete: remove,
    searchParams,
  };
};
