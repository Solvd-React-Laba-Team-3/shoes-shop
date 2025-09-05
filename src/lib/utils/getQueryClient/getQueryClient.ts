import { QUERIES_STALE_TIME } from '@/constants/queriesStaleTime';
import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from '@tanstack/react-query';

const initQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERIES_STALE_TIME,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  });
};

let browserQueryClient: QueryClient | undefined = undefined;
/**
 * Returns a singleton instance of `QueryClient` for browser environments,
 * or a new instance for server environments.
 *
 * On the server, a new `QueryClient` is created for each invocation to avoid
 * sharing state between requests. On the browser, a single instance is reused
 * for the lifetime of the application.
 *
 * @returns {QueryClient} The appropriate `QueryClient` instance for the current environment.
 */
export const getQueryClient = () => {
  if (isServer) {
    return initQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = initQueryClient();
    return browserQueryClient;
  }
};
