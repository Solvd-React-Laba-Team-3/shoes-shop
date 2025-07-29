import { getPopularSearchTerms } from './getPopularSearchTerms';
import { AI_REQUEST_STALE_TIME } from '@/constants/queriesStaleTime';

export const searchPopularTermsOptions = (debouncedInput: string) => ({
  queryKey: ['searchPopularTerms', debouncedInput],
  queryFn: () => getPopularSearchTerms(debouncedInput),
  staleTime: AI_REQUEST_STALE_TIME,
});
