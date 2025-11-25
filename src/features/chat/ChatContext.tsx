import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface ChatContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  createConversation: (initialMessage: string) => string;
  addMessage: (conversationId: string, message: Message) => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Dados iniciais para teste (para o botão não ficar vazio)
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    title: 'Gestão de Ansiedade',
    messages: [],
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Planejamento de Estudos',
    messages: [],
    createdAt: new Date()
  }
];

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Carregar do LocalStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem('psymind_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const rehydrated = parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          messages: c.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
        setConversations(rehydrated);
      } catch (e) {
        console.error("Erro ao carregar histórico", e);
      }
    } else {
      // Se não houver nada salvo, inicia com os dados de teste
      setConversations(MOCK_CONVERSATIONS);
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('psymind_chats', JSON.stringify(conversations));
    }
  }, [conversations]);

  const createConversation = (initialPrompt: string) => {
    const newId = Date.now().toString();
    const title = initialPrompt.split(' ').slice(0, 4).join(' ') + (initialPrompt.length > 20 ? '...' : '');
    
    const newConversation: Conversation = {
      id: newId,
      title,
      messages: [],
      createdAt: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newId);
    return newId;
  };

  const addMessage = (conversationId: string, message: Message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, messages: [...conv.messages, message] };
      }
      return conv;
    }));
  };

  const selectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      currentConversationId,
      createConversation,
      addMessage,
      selectConversation,
      deleteConversation
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};