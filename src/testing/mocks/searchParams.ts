import { mockUseSearchParams } from './navigation';

export const setupSearchParams = (params: Record<string, string> = {}) => {
  mockUseSearchParams.mockReturnValue(createURLSearchParams(params));
};

const createURLSearchParams = (
  params: Record<string, string> = {}
): URLSearchParams => {
  const urlSearchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    urlSearchParams.set(key, value);
  });
  return urlSearchParams;
};

export const resetSearchParams = () => {
  mockUseSearchParams.mockReturnValue(new URLSearchParams());
};
