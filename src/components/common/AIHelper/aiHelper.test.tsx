import { render, screen, act } from '@testing-library/react';
import { AIHelper } from './';
import { useAIHelperChat } from '@/lib/hooks';

jest.mock('@/lib/hooks', () => ({
  useAIHelperChat: jest.fn(),
}));

jest.mock('../MessageFallback', () => ({
  MessageFallback: ({ align }: { align: string }) => (
    <div data-testid={`fallback-${align}`} />
  ),
}));

jest.mock('@/components/ui', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('react-markdown', () => {
  const MockReactMarkdown = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="react-markdown">{children}</div>
  );
  MockReactMarkdown.displayName = 'MockReactMarkdown';
  return MockReactMarkdown;
});

describe('AIHelper', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (useAIHelperChat as jest.Mock).mockReturnValue({
      chat: [],
      sendMessage: jest.fn(),
      isPending: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders initial loading state with fallbacks', () => {
    render(<AIHelper />);
    expect(screen.getAllByTestId(/fallback-/)).toHaveLength(3);
  });

  it('renders chat messages after loading', () => {
    (useAIHelperChat as jest.Mock).mockReturnValue({
      chat: [{ content: 'Hello **world**', sender: 'user' }],
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
      chat: [],
      sendMessage: jest.fn(),
      isPending: true,
    });
    render(<AIHelper />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('fallback-left')).toBeInTheDocument();
  });

  it('shows CircularProgress instead of SendIcon when isPending is true', () => {
    (useAIHelperChat as jest.Mock).mockReturnValue({
      chat: [],
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
      chat: [{ content: '[OpenAI](https://openai.com)', sender: 'assistant' }],
      sendMessage: jest.fn(),
      isPending: false,
    });
    render(<AIHelper />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(
      screen.getByText('[OpenAI](https://openai.com)')
    ).toBeInTheDocument();
  });
});
