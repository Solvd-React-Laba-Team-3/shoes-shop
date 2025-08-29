import { renderHook, act } from '@testing-library/react';
import { useAIHelperChat } from './useAIHelperChat';
import { geminiModel } from '@/constants/geminiConfig';
import { AI_HELPER_PROMPT } from '@/constants/aihelperPrompt';

jest.mock('../useLocalStorage/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}));
import { useLocalStorage } from '../useLocalStorage/useLocalStorage';
const mockUseLocalStorage = useLocalStorage as jest.Mock;

const mockSendMessage = jest.fn();
jest.mock('@/constants/geminiConfig', () => ({
  geminiModel: {
    startChat: jest.fn(() => ({
      sendMessage: mockSendMessage,
    })),
  },
}));

describe('useAIHelperChat', () => {
  const initialChat = [
    { content: 'Hello, how can I help you today?', sender: 'model' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseLocalStorage.mockReturnValue({
      value: initialChat,
      setValue: jest.fn(),
      isLoading: false,
    });
  });

  it('initializes with chat from localStorage', () => {
    const { result } = renderHook(() => useAIHelperChat());
    expect(result.current.chat).toEqual(initialChat);
    expect(result.current.isPending).toBe(false);
  });

  it('sets up chat client with correct history', () => {
    renderHook(() => useAIHelperChat());
    expect(geminiModel.startChat).toHaveBeenCalledWith(
      expect.objectContaining({
        history: expect.arrayContaining([
          {
            role: 'user',
            parts: [{ text: AI_HELPER_PROMPT }],
          },
        ]),
        generationConfig: { temperature: 0.7 },
      })
    );
  });

  it('sends a message and updates chat with AI response', async () => {
    const aiResponseText = 'This is AI response';
    const sendResponse = {
      response: Promise.resolve({
        text: () => aiResponseText,
      }),
    };
    mockSendMessage.mockResolvedValue(sendResponse);

    const setChatMock = jest.fn();
    mockUseLocalStorage.mockReturnValue({
      value: initialChat,
      setValue: setChatMock,
      isLoading: false,
    });

    const { result } = renderHook(() => useAIHelperChat());

    await act(async () => {
      await result.current.sendMessage('Hello AI');
    });

    expect(setChatMock).toHaveBeenCalledWith([
      ...initialChat,
      { content: 'Hello AI', sender: 'user' },
    ]);
    expect(setChatMock).toHaveBeenCalledWith([
      ...initialChat,
      { content: 'Hello AI', sender: 'user' },
      { content: aiResponseText, sender: 'model' },
    ]);
  });

  it('sets isPending correctly during sendMessage', async () => {
    let resolveSend:
      | ((value: { response: Promise<{ text: () => string }> }) => void)
      | undefined;

    mockSendMessage.mockReturnValue(
      new Promise((resolve) => {
        resolveSend = resolve;
      })
    );

    const { result } = renderHook(() => useAIHelperChat());

    act(() => {
      result.current.sendMessage('Wait for AI');
    });

    expect(result.current.isPending).toBe(true);

    await act(async () => {
      resolveSend!({ response: Promise.resolve({ text: () => 'Done' }) });
    });

    expect(result.current.isPending).toBe(false);
  });

  it('handles errors gracefully', async () => {
    mockSendMessage.mockRejectedValue(new Error('AI error'));

    const setChatMock = jest.fn();
    mockUseLocalStorage.mockReturnValue({
      value: initialChat,
      setValue: setChatMock,
      isLoading: false,
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useAIHelperChat());

    await act(async () => {
      await result.current.sendMessage('Trigger error');
    });

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(result.current.isPending).toBe(false);

    consoleSpy.mockRestore();
  });
});
