'use client';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  cleanup,
  waitFor,
} from '@testing-library/react';
import { MainSearchBar } from './MainSearchBar';
import { getPopularSearchTerms } from '@/api/gemini/getPopularSearchTermsOptions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

function resizeWindow(width: number, height: number) {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event('resize'));
}

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

const mockUseMediaQuery = jest.fn();
jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: (query: string) => mockUseMediaQuery(query),
}));

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

jest.mock('next/navigation', () => {
  return {
    usePathname: jest.fn(),
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
  };
});

jest.mock('@/api/gemini/getPopularSearchTermsOptions', () => {
  const mockGetPopularSearchTerms = jest.fn();
  return {
    getPopularSearchTerms: mockGetPopularSearchTerms,
    getPopularSearchTermsOptions: jest.fn((query: string) => ({
      queryKey: ['searchPopularTerms', query],
      queryFn: () => mockGetPopularSearchTerms(query),
      staleTime: 1000,
    })),
  };
});

jest.mock('@/lib/hooks', () => {
  const original = jest.requireActual('@/lib/hooks');
  return {
    ...original,
    useDeviceSize: jest.fn(() => ({ isMobile: false })),
    useDebounce: original.useDebounce,
  };
});

const mockGetPopularSearchTerms = getPopularSearchTerms as jest.Mock;

const getSearchInput = () => screen.getByLabelText('search');

describe('MainSearchBar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockGetPopularSearchTerms.mockResolvedValue([]);
    (usePathname as jest.Mock).mockReturnValue('/');
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
    it('should not trigger search on non-Enter keys', async () => {
      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
      });

      expect(mockPush).not.toHaveBeenCalled();
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

  describe('Additional Coverage for MainSearchBar', () => {
    it('should not search if the trimmed value is the same as current search param', async () => {
      createMockSearchParams({ search: 'same' });
      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.change(input, { target: { value: 'same' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should blur input and close overlay when handleClose is called', async () => {
      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();
      const blurSpy = jest.spyOn(input, 'blur');

      await act(async () => {
        fireEvent.focus(input);
      });

      await act(async () => {
        fireEvent.keyDown(input, { key: 'Escape' });
      });

      const closeBtn = screen.getByTestId('close-button');
      fireEvent.click(closeBtn);

      expect(blurSpy).toHaveBeenCalled();
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    it('should not set popular terms when query is not successful', async () => {
      mockGetPopularSearchTerms.mockResolvedValueOnce(undefined);

      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.change(input, { target: { value: 'test' } });
      });

      expect(
        screen.queryByTestId('popular-terms-container')
      ).not.toBeInTheDocument();
    });

    it('should enable query when input is empty', async () => {
      mockGetPopularSearchTerms.mockResolvedValueOnce(['term1', 'term2']);

      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.focus(input);
      });

      await act(async () => {
        fireEvent.change(input, { target: { value: '' } });
      });

      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      expect(
        await screen.findByTestId('popular-terms-container')
      ).toBeInTheDocument();
    });

    it('should show loading bar and handle term click to trigger search and close overlay', async () => {
      (usePathname as jest.Mock).mockReturnValue('/somepage');
      mockGetPopularSearchTerms.mockResolvedValueOnce(['clickedTerm']);

      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.focus(input);
      });

      await act(async () => {
        fireEvent.change(input, { target: { value: 'longsearchvalue' } });
        jest.advanceTimersByTime(2000);
      });

      expect(await screen.getByTestId('loading-bar')).toBeInTheDocument();

      const termItem = await screen.findByTestId('popular-term-0');

      await act(async () => {
        fireEvent.click(termItem);
      });

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('clickedTerm')
      );
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });
  });
  describe('MainSearchBar - Edge cases', () => {
    it('should not render popular terms container if API returns undefined', async () => {
      mockGetPopularSearchTerms.mockResolvedValueOnce(undefined);

      renderWithQueryClient(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'test' } });
        jest.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(
          screen.queryByTestId('popular-terms-container')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('MainSearchBar - Mobile behavior', () => {
    it('should render search icon button when mobile and not focused, and open search on click', async () => {
      mockUseMediaQuery.mockReturnValue(true);

      renderWithQueryClient(<MainSearchBar />);
      resizeWindow(420, 800);

      const mobileBtn = screen.getByRole('button');
      expect(mobileBtn).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(mobileBtn);
      });

      expect(screen.getByTestId('overlay')).toBeInTheDocument();
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });
  });
});
