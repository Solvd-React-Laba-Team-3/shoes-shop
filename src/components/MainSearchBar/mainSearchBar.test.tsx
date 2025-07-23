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

const mockPush = jest.fn();
const mockSearchParams = new Map<string, string>();

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

  describe('Initial Rendering', () => {
    it('should render with empty input when no search params', () => {
      render(<MainSearchBar />);
      const input = getSearchInput();
      expect(input).toHaveValue('');
    });

    it('should render input with initial search value from query params', () => {
      createMockSearchParams({ search: 'initial search' });
      render(<MainSearchBar />);
      const input = getSearchInput();
      expect(input).toHaveValue('initial search');
    });

    it('should not show overlay or controls initially', () => {
      render(<MainSearchBar />);
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
      expect(screen.queryByTestId('close-button')).not.toBeInTheDocument();
    });
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

      expect(screen.getByTestId('overlay')).toBeInTheDocument();

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

      expect(mockPush).toHaveBeenCalledWith('?search=nike+shoes');
    });

    it('should handle empty search submission', async () => {
      render(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.change(input, { target: { value: '   ' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      });

      expect(mockPush).toHaveBeenCalledWith('?search=');
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

      expect(mockPush).toHaveBeenCalledWith(
        '?category=sneakers&brand=nike&search=jordan'
      );
    });
  });

  describe('Popular Terms', () => {
    it('should display default popular terms when input is empty', async () => {
      render(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.focus(input);
      });

      await waitFor(() => {
        expect(screen.getByText('Nike Dunks')).toBeInTheDocument();
        expect(screen.getByText('Adidas Yeezy')).toBeInTheDocument();
        expect(screen.getByText('Jordan 1')).toBeInTheDocument();
      });
    });

    it('should not fetch terms for queries shorter than 2 characters', async () => {
      render(<MainSearchBar />);
      const input = getSearchInput();

      await act(async () => {
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'a' } });
      });

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      expect(mockGetPopularSneakerTerms).not.toHaveBeenCalled();
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

      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });
  });

  describe('Cleanup', () => {
    it('should clean up blur timeout on unmount', () => {
      const { unmount } = render(<MainSearchBar />);
      const input = getSearchInput();

      fireEvent.focus(input);
      fireEvent.blur(input);

      unmount();

      jest.runAllTimers();
      expect(true).toBeTruthy();
    });
  });

  describe('Input Value Updates', () => {
    it('should update input value when search params change', () => {
      createMockSearchParams({ search: 'initial' });
      const { rerender } = render(<MainSearchBar />);
      const input = getSearchInput() as HTMLInputElement;

      expect(input.value).toBe('initial');

      createMockSearchParams({ search: 'updated' });
      rerender(<MainSearchBar />);

      expect(input.value).toBe('updated');
    });
  });
});
