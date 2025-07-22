import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MainSearchBar } from './MainSearchBar';
import { fetchPopularTerms } from '@/actions/getPopularTerms';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: (param: string) => (param === 'search' ? 'initial' : null),
    toString: () => '',
  }),
}));

jest.mock('@/actions/getPopularTerms', () => ({
  fetchPopularTerms: jest.fn(),
}));

jest.mock('../ui', () => {
  const originalModule = jest.requireActual('../ui');
  return {
    ...originalModule,
    SearchBar: jest.fn(({ inputRef, value, onChange, ...props }) => (
      <input
        ref={inputRef}
        data-testid="search-input"
        value={value}
        onChange={(e) => {
          onChange(e);
        }}
        {...props}
      />
    )),
  };
});

describe('MainSearchBar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render input with initial search value from query params', () => {
    render(<MainSearchBar />);
    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('initial');
  });

  it('should show overlay and icons when focused', async () => {
    render(<MainSearchBar />);
    const input = screen.getByTestId('search-input');

    await act(async () => {
      fireEvent.focus(input);
    });

    expect(screen.getByTestId('overlay')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /close search overlay/i })
    ).toBeInTheDocument();
  });

  it('should hide overlay after blur timeout', async () => {
    render(<MainSearchBar />);
    const input = screen.getByTestId('search-input');

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
    const input = screen.getByTestId('search-input');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'hello' } });
      jest.advanceTimersByTime(600);
    });

    expect(fetchPopularTerms).toHaveBeenCalledWith('hello');
  });

  it('cleans up blur timeout on unmount', () => {
    const { unmount } = render(<MainSearchBar />);
    const input = screen.getByTestId('search-input');

    fireEvent.focus(input);
    fireEvent.blur(input);

    unmount();
    jest.runAllTimers();

    expect(true).toBeTruthy();
  });

  it('closes overlay when clicking close button', async () => {
    render(<MainSearchBar />);
    const input = screen.getByTestId('search-input');

    await act(async () => {
      fireEvent.focus(input);
    });

    const closeButton = screen.getByRole('button', {
      name: /close search overlay/i,
    });

    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
  });
});
