import { renderHook, act } from '@testing-library/react';
import { useAIHelperChat } from './useAIHelperChat';
import { geminiModel } from '@/constants/geminiConfig';
import { AI_HELPER_PROMPT } from '@/constants/aihelperPrompt';

jest.mock('../useLocalStorage/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}));

import { useLocalStorage } from '../useLocalStorage/useLocalStorage';

const useLocalStorageMock = useLocalStorage as jest.Mock;

const sendMessageMock = jest.fn();
jest.mock('@/constants/geminiConfig', () => ({
  geminiModel: {
    startChat: jest.fn(() => ({
      sendMessage: sendMessageMock,
    })),
  },
}));

describe('useAIHelperChat', () => {
  const initialChat = {
    history: [
      {
        content: 'Hello, how can I help you today?',
        sender: 'model',
      },
    ],
    isCollapsed: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useLocalStorageMock.mockReturnValue({
      value: initialChat,
      setValue: jest.fn(),
      isLoading: false,
    });
  });

  it('initializes with chat from localStorage', () => {
    const { result } = renderHook(() => useAIHelperChat());
    expect(result.current.history).toEqual(initialChat.history);
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

  it('toggles isCollapsed and calls setChat in toggleCollapsed', () => {
    const setChatMock = jest.fn();
    useLocalStorageMock.mockReturnValue({
      value: initialChat,
      setValue: setChatMock,
      isLoading: false,
    });

    const { result } = renderHook(() => useAIHelperChat());

    act(() => {
      result.current.toggleCollapsed();
    });

    expect(setChatMock).toHaveBeenCalledWith({
      ...initialChat,
      isCollapsed: !initialChat.isCollapsed,
    });
  });

  it('sends a message and updates chat with AI response', async () => {
    const aiResponseText = 'This is AI response';
    const sendResponse = {
      response: Promise.resolve({
        text: () => aiResponseText,
      }),
    };
    sendMessageMock.mockResolvedValue(sendResponse);

    const setChatMock = jest.fn();
    useLocalStorageMock.mockReturnValue({
      value: initialChat,
      setValue: setChatMock,
      isLoading: false,
    });

    const { result } = renderHook(() => useAIHelperChat());

    await act(async () => {
      await result.current.sendMessage('Hello AI');
    });

    expect(setChatMock).toHaveBeenCalledWith({
      ...initialChat,
      history: [
        ...initialChat.history,
        { content: 'Hello AI', sender: 'user' },
      ],
    });
    expect(setChatMock).toHaveBeenCalledWith({
      ...initialChat,
      history: [
        ...initialChat.history,
        { content: 'Hello AI', sender: 'user' },
        { content: aiResponseText, sender: 'model' },
      ],
    });
  });

  it('sets isPending correctly during sendMessage', async () => {
    let resolveSend:
      | ((value: { response: Promise<{ text: () => string }> }) => void)
      | undefined;

    sendMessageMock.mockReturnValue(
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
    sendMessageMock.mockRejectedValue(new Error('AI error'));

    const setChatMock = jest.fn();
    useLocalStorageMock.mockReturnValue({
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
