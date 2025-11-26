import { useEffect } from 'react';
import { useChat } from './ChatContext';
import { generateConversationSummary } from '@/shared/utils/chat-summary';

export const useChatSummary = () => {
  const { conversations, updateConversationTitle } = useChat();

  useEffect(() => {
    const generateTitles = async () => {
      for (const conversation of conversations) {
        // Gera título se a conversa tem pelo menos 2 mensagens (user + ai) e ainda tem título genérico
        if (conversation.messages.length >= 2 && conversation.title === 'Nova conversa') {
          try {
            const title = await generateConversationSummary(conversation.messages);
            updateConversationTitle(conversation.id, title);
          } catch (error) {
            console.error('Erro ao gerar título:', error);
          }
        }
      }
    };

    generateTitles();
  }, [conversations, updateConversationTitle]);
};