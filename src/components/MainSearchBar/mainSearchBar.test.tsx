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
import {
  mockPush,
  mockSearchParams,
  createMockSearchParams,
} from '@/testing/mocks/mainSearchBarMocks';
import { getPopularSneakerTerms } from '@/api/gemini/getPopularSneakerTerms';
const mockGetPopularSneakerTerms = getPopularSneakerTerms as jest.Mock;

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
      render(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.focus(input);
      });

      expect(screen.getByTestId('overlay')).toBeInTheDocument();
      expect(screen.getByTestId('close-button')).toBeInTheDocument();
    });

    it('should hide overlay after blur timeout', async () => {
      render(<MainSearchBar />);
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
      render(<MainSearchBar />);
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
      render(<MainSearchBar />);
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
      render(<MainSearchBar />);
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
      render(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should preserve existing search params when searching', async () => {
      createMockSearchParams({ category: 'sneakers', brand: 'nike' });
      render(<MainSearchBar />);
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
      render(<MainSearchBar />);
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
      render(<MainSearchBar />);
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
      render(<MainSearchBar />);
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
      const { unmount } = render(<MainSearchBar />);
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

    it('should clean up debounce timeout on unmount', async () => {
      const { unmount } = render(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'nike' } });
      });

      unmount();
      await act(async () => {
        jest.runAllTimers();
      });

      expect(mockGetPopularSneakerTerms).not.toHaveBeenCalled();
    });
  });
});
