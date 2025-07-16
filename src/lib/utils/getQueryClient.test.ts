import { getQueryClient } from './getQueryClient';

jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return {
    ...actual,
    isServer: false,
    QueryClient: jest.fn().mockImplementation(() => ({
      getQueryDefaults: jest.fn(),
    })),
    defaultShouldDehydrateQuery: jest.fn(() => false),
  };
});

describe('getQueryClient', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should return a QueryClient-like instance on the browser', () => {
    const client = getQueryClient();
    expect(client).toBeDefined();
    expect(typeof client.getQueryDefaults).toBe('function');
  });

  it('should return the same QueryClient instance on subsequent calls in the browser', () => {
    const client1 = getQueryClient();
    const client2 = getQueryClient();
    expect(client1).toBe(client2);
  });

  it('should return a new QueryClient instance on the server', () => {
    jest.doMock('@tanstack/react-query', () => {
      const actual = jest.requireActual('@tanstack/react-query');
      return {
        ...actual,
        isServer: true,
        QueryClient: jest.fn().mockImplementation(() => ({})),
        defaultShouldDehydrateQuery: jest.fn(() => false),
      };
    });
    const {
      getQueryClient: getQueryClientServerDynamic,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
    } = require('./getQueryClient');
    const clientA = getQueryClientServerDynamic();
    const clientB = getQueryClientServerDynamic();
    expect(clientA).not.toBe(clientB);
  });
});
