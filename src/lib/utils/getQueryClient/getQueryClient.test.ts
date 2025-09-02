import { getQueryClient } from './getQueryClient';
import { Query, defaultShouldDehydrateQuery } from '@tanstack/react-query';

jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return {
    ...actual,
    isServer: false,
    defaultShouldDehydrateQuery: jest.fn(),
  };
});

describe('getQueryClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should call defaultShouldDehydrateQuery inside shouldDehydrateQuery', () => {
    (defaultShouldDehydrateQuery as jest.Mock).mockReturnValue(false);

    const client = getQueryClient();

    const queryMock = new Query({
      client,
      queryHash: 'test',
      queryKey: [] as readonly unknown[],
    });

    client.getDefaultOptions().dehydrate?.shouldDehydrateQuery?.(queryMock);

    expect(defaultShouldDehydrateQuery).toHaveBeenCalledWith(queryMock);
  });

  it('should return the same QueryClient instance in browser', () => {
    const client1 = getQueryClient();
    const client2 = getQueryClient();
    expect(client1).toBe(client2);
  });

  it('should return a new QueryClient instance on server', async () => {
    jest.resetModules();
    jest.doMock('@tanstack/react-query', () => {
      const actual = jest.requireActual('@tanstack/react-query');
      return {
        ...actual,
        isServer: true,
        QueryClient: jest.fn().mockImplementation((options) => ({
          id: Math.random(),
          options,
        })),
        defaultShouldDehydrateQuery: jest.fn(),
      };
    });

    const { getQueryClient: getQueryClientServer } = await import(
      './getQueryClient'
    );
    const client1 = getQueryClientServer();
    const client2 = getQueryClientServer();

    expect(client1).not.toBe(client2);
  });
});
