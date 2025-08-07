import { geminiModel } from '@/constants/geminiConfig';
import { AI_HELPER_PROMPT } from '@/constants/aihelperPrompt';
import { useLocalStorage } from '../useLocalStorage/useLocalStorage';
import { useState } from 'react';

interface Message {
  content: string;
  sender: 'user' | 'model';
}

export const useAIHelperChat = () => {
  const [isPending, setIsPending] = useState(false);

  const { value: chat, setValue: setChat } = useLocalStorage<Message[]>(
    'chat-history',
    [
      {
        content: 'Hello, how can I help you today?',
        sender: 'model',
      },
    ]
  );

  const chatClient = geminiModel.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: AI_HELPER_PROMPT }],
      },
      ...chat.map((message) => ({
        role: message.sender,
        parts: [{ text: message.content }],
      })),
    ],
    generationConfig: {
      temperature: 0.7,
    },
  });

  const sendMessage = async (prompt: string) => {
    const updatedChat = [...chat, { content: prompt, sender: 'user' as const }];
    setChat(updatedChat);
    setIsPending(true);

    try {
      const result = await chatClient.sendMessage(prompt);
      const response = await result.response;
      const message = response.text();

      setChat([...updatedChat, { content: message, sender: 'model' }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return { chat, setChat, sendMessage, isPending };
};
