'use client';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { MainSearchBar } from './MainSearchBar';
import { fetchPopularTerms } from '@/actions/getPopularTerms';

const mockPush = jest.fn();
const mockSearchParams = new Map([['search', 'initial']]);

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

// Mock the fetchPopularTerms function
jest.mock('@/actions/getPopularTerms', () => ({
  fetchPopularTerms: jest.fn(),
}));

// Mock the useDebounce hook to avoid waiting in tests
jest.mock('@/lib/hooks/useDebounce', () => ({
  useDebounce: (value: string) => value, // Return value immediately without debounce
}));

// We're not mocking the SearchBar component anymore - we'll rely on the data-testid in the component

describe('MainSearchBar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    (fetchPopularTerms as jest.Mock).mockResolvedValue([]);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should render input with initial search value from query params', () => {
    render(<MainSearchBar />);

    // Use queryByTestId first to debug what's available
    const allTestIds = screen
      .queryAllByTestId(/.*/)
      .map((el) => el.getAttribute('data-testid'));
    console.log('Available test IDs:', allTestIds);

    // Try to find by role instead
    const input = screen.getByPlaceholderText('Search');
    expect(input).toHaveValue('initial');
  });

  it('should show overlay and icons when focused', async () => {
    render(<MainSearchBar />);
    const input = screen.getByPlaceholderText('Search');

    await act(async () => {
      fireEvent.focus(input);
    });

    expect(screen.getByTestId('overlay')).toBeInTheDocument();
    expect(screen.getByTestId('close-button')).toBeInTheDocument();
  });

  it('should hide overlay after blur timeout', async () => {
    render(<MainSearchBar />);
    const input = screen.getByPlaceholderText('Search');

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

  it('triggers search when typing', async () => {
    (fetchPopularTerms as jest.Mock).mockResolvedValue([]);
    render(<MainSearchBar />);
    const input = screen.getByPlaceholderText('Search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'hello' } });
    });

    expect(fetchPopularTerms).toHaveBeenCalledWith('hello');
  });

  it('cleans up blur timeout on unmount', () => {
    const { unmount } = render(<MainSearchBar />);
    const input = screen.getByPlaceholderText('Search');

    fireEvent.focus(input);
    fireEvent.blur(input);

    unmount();
    jest.runAllTimers();

    // This test is mainly to ensure no errors are thrown during cleanup
    expect(true).toBeTruthy();
  });

  it('closes overlay when clicking close button', async () => {
    render(<MainSearchBar />);
    const input = screen.getByPlaceholderText('Search');

    await act(async () => {
      fireEvent.focus(input);
    });

    const closeButton = screen.getByTestId('close-button');

    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
  });

  // New tests

  it('should display popular terms when API returns results', async () => {
    (fetchPopularTerms as jest.Mock).mockResolvedValue([
      'term1',
      'term2',
      'term3',
    ]);

    render(<MainSearchBar />);
    const input = screen.getByPlaceholderText('Search');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'test' } });
    });

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(screen.getByTestId('popular-terms-container')).toBeInTheDocument();
    });

    expect(screen.getByText('Popular Search Terms')).toBeInTheDocument();
    expect(screen.getByTestId('popular-term-0')).toBeInTheDocument();
    expect(screen.getByText('term1')).toBeInTheDocument();
    expect(screen.getByText('term2')).toBeInTheDocument();
    expect(screen.getByText('term3')).toBeInTheDocument();
  });

  it('should not display popular terms container when API returns empty array', async () => {
    (fetchPopularTerms as jest.Mock).mockResolvedValue([]);

    render(<MainSearchBar />);
    const input = screen.getByPlaceholderText('Search');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'test' } });
    });

    await waitFor(() => {
      expect(fetchPopularTerms).toHaveBeenCalledWith('test');
    });

    expect(
      screen.queryByTestId('popular-terms-container')
    ).not.toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    (fetchPopularTerms as jest.Mock).mockRejectedValue(new Error('API error'));

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<MainSearchBar />);
    const input = screen.getByPlaceholderText('Search');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'test' } });
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '[AUTOCOMPLETE_ERROR]',
        expect.any(Error)
      );
    });

    expect(
      screen.queryByTestId('popular-terms-container')
    ).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should select a popular term when clicked', async () => {
    (fetchPopularTerms as jest.Mock).mockResolvedValue([
      'suggestion1',
      'suggestion2',
    ]);

    render(<MainSearchBar />);
    const input = screen.getByPlaceholderText('Search');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'test' } });
    });

    await waitFor(() => {
      expect(screen.getByTestId('popular-terms-container')).toBeInTheDocument();
    });

    const suggestion = screen.getByText('suggestion1');

    await act(async () => {
      fireEvent.click(suggestion);
    });

    expect(mockPush).toHaveBeenCalledWith('?search=suggestion1');
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
  });

  it('should clear blur timeout when focusing again quickly', async () => {
    render(<MainSearchBar />);
    const input = screen.getByPlaceholderText('Search');

    // Focus, then blur, then focus again quickly
    await act(async () => {
      fireEvent.focus(input);
    });

    await act(async () => {
      fireEvent.blur(input);
      // Don't advance timers yet
    });

    // Focus again before the timeout completes
    await act(async () => {
      fireEvent.focus(input);
    });

    // Advance timers - the overlay should still be visible because the timeout was cleared
    jest.advanceTimersByTime(200);

    expect(screen.getByTestId('overlay')).toBeInTheDocument();
  });

  it('should close overlay when clicking on it', async () => {
    render(<MainSearchBar />);
    const input = screen.getByPlaceholderText('Search');

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
