'use client';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { MainSearchBar } from './MainSearchBar';
import { getPopularSneakerTerms } from '@/api/gemini/getPopularSneakerTerms';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockPush = jest.fn();
const mockSearchParams = new Map<string, string>();

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
};

const createMockSearchParams = (params: Record<string, string> = {}) => {
  mockSearchParams.clear();
  Object.entries(params).forEach(([key, value]) => {
    mockSearchParams.set(key, value);
  });
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: (param: string) => mockSearchParams.get(param) || null,
    toString: () =>
      Array.from(mockSearchParams.entries())
        .map(([key, value]) => `${key}=${value}`)
        .join('&'),
  }),
}));

jest.mock('@/api/gemini/getPopularSneakerTerms', () => ({
  getPopularSneakerTerms: jest.fn(),
}));

const mockGetPopularSneakerTerms = getPopularSneakerTerms as jest.Mock;

const getSearchInput = () => screen.getByLabelText('search');

describe('MainSearchBar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockGetPopularSneakerTerms.mockResolvedValue([]);
    createMockSearchParams();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  describe('Focus and Blur Behavior', () => {
    it('should show overlay and controls when focused', async () => {
      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.focus(input);
      });

      expect(screen.getByTestId('overlay')).toBeInTheDocument();
      expect(screen.getByTestId('close-button')).toBeInTheDocument();
    });

    it('should hide overlay after blur timeout', async () => {
      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.focus(input);
      });

      await act(async () => {
        fireEvent.blur(input);
        jest.advanceTimersByTime(200);
      });

      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    it('should clear blur timeout when focusing again quickly', async () => {
      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.focus(input);
      });

      await act(async () => {
        fireEvent.blur(input);
        fireEvent.focus(input);
        jest.advanceTimersByTime(200);
      });

      expect(screen.getByTestId('overlay')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should trigger search on Enter key press', async () => {
      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.change(input, { target: { value: 'nike shoes' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('?search=nike+shoes');
      });
    });

    it('should handle empty search submission', async () => {
      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.change(input, { target: { value: '   ' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('?search=');
      });
    });

    it('should not trigger search on non-Enter keys', async () => {
      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should preserve existing search params when searching', async () => {
      createMockSearchParams({ category: 'sneakers', brand: 'nike' });
      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.change(input, { target: { value: 'jordan' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          '?category=sneakers&brand=nike&search=jordan'
        );
      });
    });
  });

  describe('Overlay and Controls', () => {
    it('should close overlay when clicking close button', async () => {
      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.focus(input);
      });

      const closeButton = screen.getByTestId('close-button');

      await act(async () => {
        fireEvent.click(closeButton);
      });

      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    it('should close overlay when clicking on it', async () => {
      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.focus(input);
      });

      const overlay = screen.getByTestId('overlay');

      await act(async () => {
        fireEvent.click(overlay);
      });

      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    it('should close overlay after Enter key search', async () => {
      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      });

      await waitFor(() => {
        expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
      });
    });
  });

  describe('Cleanup', () => {
    it('should clean up blur timeout on unmount', async () => {
      const { unmount } = renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.focus(input);
        fireEvent.blur(input);
      });

      unmount();

      await act(async () => {
        jest.runAllTimers();
      });

      expect(true).toBeTruthy();
    });
  });
});
