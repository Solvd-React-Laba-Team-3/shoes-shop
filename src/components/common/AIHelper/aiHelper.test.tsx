import { screen, act } from '@testing-library/react';
import { AIHelper } from './';
import { useAIHelperChat } from '@/lib/hooks';
import { render } from '@/testing/utils';

jest.mock('@/lib/hooks', () => ({
  useAIHelperChat: jest.fn(),
}));

jest.mock('react-markdown', () => {
  return function ReactMarkdown({ children }: { children: string }) {
    return <div data-testid="react-markdown">{children}</div>;
  };
});

describe('AIHelper', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (useAIHelperChat as jest.Mock).mockReturnValue({
      history: [],
      sendMessage: jest.fn(),
      isPending: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders initial loading state with fallbacks', () => {
    (useAIHelperChat as jest.Mock).mockReturnValue({
      history: [],
      sendMessage: jest.fn(),
      isPending: true,
    });
    render(<AIHelper />);
    expect(screen.getByTestId('message-skeleton')).toBeInTheDocument();
  });

  it('renders chat messages after loading', () => {
    (useAIHelperChat as jest.Mock).mockReturnValue({
      history: [{ content: 'Hello **world**', sender: 'user' }],
      sendMessage: jest.fn(),
      isPending: false,
    });
    render(<AIHelper />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Hello **world**')).toBeInTheDocument();
  });

  it('renders pending fallback when isPending is true', () => {
    (useAIHelperChat as jest.Mock).mockReturnValue({
      history: [],
      sendMessage: jest.fn(),
      isPending: true,
    });
    render(<AIHelper />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('message-skeleton')).toBeInTheDocument();
  });

  it('shows CircularProgress instead of SendIcon when isPending is true', () => {
    (useAIHelperChat as jest.Mock).mockReturnValue({
      history: [],
      sendMessage: jest.fn(),
      isPending: true,
    });
    render(<AIHelper />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders markdown link correctly', () => {
    (useAIHelperChat as jest.Mock).mockReturnValue({
      history: [{ content: '[OpenAI](https://openai.com)', sender: 'model' }],
      sendMessage: jest.fn(),
      isPending: false,
    });
    render(<AIHelper />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('react-markdown')).toBeInTheDocument();
    expect(
      screen.getByText('[OpenAI](https://openai.com)')
    ).toBeInTheDocument();
  });
});
