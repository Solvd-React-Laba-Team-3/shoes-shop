'use client';

import {
  useSearchParams as useNextSearchParams,
  usePathname,
  useRouter,
} from 'next/navigation';

export const useSearchParams = () => {
  const searchParams = useNextSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const set = (key: string, value: string | number | boolean | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === undefined) {
      params.delete(key);
      history.replaceState(null, '', `${pathname}?${params.toString()}`);
      return;
    }

    params.set(key, String(value));
    history.replaceState(null, '', `${pathname}?${params.toString()}`);
  };

  const get = (key: string) => {
    const value = searchParams.get(key);
    return value ? decodeURIComponent(value) : undefined;
  };

  const update = (params: URLSearchParams) => {
    const query = params.toString();
    const newUrl = query ? `${pathname}?${query}` : pathname;
    router.replace(newUrl);
  };

  const remove = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    history.replaceState(null, '', `${pathname}?${params.toString()}`);
  };

  return {
    set,
    get,
    update,
    delete: remove,
    searchParams,
  };
};
