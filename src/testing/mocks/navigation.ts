export const mockPush = jest.fn();
export const mockReplace = jest.fn();
export const mockPrefetch = jest.fn();
export const mockBack = jest.fn();
export const mockUsePathname = jest.fn(() => '');
export const mockUseSearchParams = jest.fn(() => new URLSearchParams());
export const mockRouter = { push: jest.fn() };

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: mockPrefetch,
    back: mockBack,
  }),
  usePathname: mockUsePathname,
  useSearchParams: mockUseSearchParams,
}));
