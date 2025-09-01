import { geminiModel } from '@/constants/geminiConfig';
import { AI_HELPER_PROMPT } from '@/constants/aihelperPrompt';
import { useLocalStorage } from '../useLocalStorage/useLocalStorage';
import { useState } from 'react';

interface Message {
  content: string;
  sender: 'user' | 'model';
}

interface ChatState {
  history: Message[];
  isCollapsed: boolean;
}

export const useAIHelperChat = () => {
  const [isPending, setIsPending] = useState(false);

  const { value: chat, setValue: setChat } = useLocalStorage<ChatState>(
    'chat',
    {
      history: [
        {
          content: 'Hello, how can I help you today?',
          sender: 'model',
        },
      ],
      isCollapsed: false,
    }
  );

  const chatClient = geminiModel.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: AI_HELPER_PROMPT }],
      },
      ...chat.history.map((message) => ({
        role: message.sender,
        parts: [{ text: message.content }],
      })),
    ],
    generationConfig: {
      temperature: 0.7,
    },
  });

  const sendMessage = async (prompt: string) => {
    const updatedChat = {
      ...chat,
      history: [...chat.history, { content: prompt, sender: 'user' as const }],
    };
    setChat(updatedChat);
    setIsPending(true);

    try {
      const result = await chatClient.sendMessage(prompt);
      const response = await result.response;
      const message = response.text();

      setChat({
        ...updatedChat,
        history: [
          ...updatedChat.history,
          { content: message, sender: 'model' },
        ],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  const toggleCollapsed = () => {
    setChat({
      ...chat,
      isCollapsed: !chat.isCollapsed,
    });
  };

  return {
    history: chat.history,
    isCollapsed: chat.isCollapsed,
    setChat,
    sendMessage,
    isPending,
    toggleCollapsed,
  };
};
