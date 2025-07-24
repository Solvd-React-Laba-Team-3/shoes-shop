export const mockPush = jest.fn();
export const mockSearchParams = new Map<string, string>();

export const createMockSearchParams = (params: Record<string, string> = {}) => {
  mockSearchParams.clear();
  Object.entries(params).forEach(([key, value]) => {
    mockSearchParams.set(key, value);
  });
};
