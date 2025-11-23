import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUp, 
  Paperclip, 
  Image as ImageIcon, 
  X, 
  MoreHorizontal, 
  Copy, 
  ThumbsUp, 
  RotateCcw, 
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendMessageToGemini } from '@/lib/gemini';
import { useChat, Message } from '@/context/ChatContext';

interface ChatInterfaceProps {
  initialPrompt: string;
  mode: 'Advisor' | 'Planner';
  personality: string;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  initialPrompt, 
  mode, 
  personality,
  onClose 
}) => {
  // Integração com o Contexto
  const { 
    currentConversationId, 
    conversations, 
    createConversation, 
    addMessage,
    selectConversation 
  } = useChat();

  // Encontra a conversa atual para exibir as mensagens
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Ref para garantir que a criação inicial só aconteça uma vez
  const initialized = useRef(false);

  // Função para chamar a API do Gemini
  const handleGeminiResponse = async (chatId: string, currentHistory: Message[], prompt: string) => {
    setIsTyping(true);
    
    try {
      // Prepara histórico para a API
      const historyForService = currentHistory.map(m => ({
        role: m.role,
        content: m.content
      }));

      const responseText = await sendMessageToGemini(
        historyForService, 
        prompt, 
        mode, 
        personality
      );

      const newAiMessage: Message = {
        id: Date.now().toString(),
        role: 'ai',
        content: responseText,
        timestamp: new Date()
      };

      // Salva resposta da IA no contexto
      addMessage(chatId, newAiMessage);

    } catch (error) {
      console.error("Erro na comunicação com a IA:", error);
      // Opcional: Adicionar mensagem de erro visual para o usuário
    } finally {
      setIsTyping(false);
    }
  };

  // Efeito de Inicialização: Cria o chat se vier do Dashboard (Input Principal)
  useEffect(() => {
    // Se temos um prompt inicial E não estamos visualizando um chat existente
    if (initialPrompt && !initialized.current) {
      initialized.current = true;
      
      // 1. Se já existe um ID selecionado, deseleciona para criar um novo (opcional, depende da UX)
      // Aqui assumimos que digitar no dashboard SEMPRE cria um novo tópico se não houver ID
      // Mas se o usuário clicou no histórico e depois digitou no dashboard, pode ser confuso.
      // Vamos assumir criação de nova conversa para o prompt inicial.
      
      const newId = createConversation(initialPrompt);
      
      // 2. Cria a mensagem do usuário
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: initialPrompt,
        timestamp: new Date()
      };
      
      // 3. Adiciona ao contexto
      addMessage(newId, userMsg);

      // 4. Dispara a IA
      handleGeminiResponse(newId, [userMsg], initialPrompt);
    }
  }, [initialPrompt]); // Executa apenas quando o componente monta ou initialPrompt muda

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-resize do textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Se por acaso não houver ID (erro de estado), cria agora
    let chatId = currentConversationId;
    if (!chatId) {
      chatId = createConversation(input);
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    // Atualiza estado global
    addMessage(chatId, newUserMessage);
    setInput('');
    
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    
    // Dispara IA com o histórico atualizado (incluindo a nova mensagem)
    const updatedHistory = [...messages, newUserMessage];
    handleGeminiResponse(chatId, updatedHistory, input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Título dinâmico baseado na conversa ou prompt
  const chatTitle = currentConversation?.title || initialPrompt.split(' ').slice(0, 5).join(' ') + '...';

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#FFFBF7] animate-in fade-in duration-500 font-sans">
      {/* Header */}
      <header className="flex-none px-8 py-6 border-b border-orange-100/50 bg-[#FFFBF7]/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              selectConversation(''); // Limpa seleção ao sair
              onClose();
            }}
            className="p-2 hover:bg-orange-100 rounded-full transition-colors text-zinc-500 hover:text-black-soft"
            title="Fechar chat"
          >
            <X size={20} />
          </button>
          <div>
            <div className="flex flex-col">
              <h2 className="font-serif text-xl text-black-soft font-medium truncate max-w-md" title={chatTitle}>
                {chatTitle}
              </h2>
              
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-medium text-zinc-500">
                  Modo {mode === 'Advisor' ? 'Conselheiro' : 'Planejador'}
                </span>
                <span className="text-zinc-300">•</span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full border border-orange-100">
                  {personality}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-orange-50 rounded-full text-zinc-400 hover:text-zinc-600 transition-colors" title="Reiniciar conversa">
            <RotateCcw size={18} />
          </button>
          <button className="p-2 hover:bg-orange-50 rounded-full text-zinc-400 hover:text-zinc-600 transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>

      {/* Área do Chat */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-8 pt-8">
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex gap-4 animate-in slide-in-from-bottom-4 duration-500",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "flex flex-col gap-2 max-w-[85%] md:max-w-[75%]",
                msg.role === 'user' ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "text-base leading-relaxed relative group text-left transition-all font-sans",
                  msg.role === 'ai' 
                    ? "text-zinc-700 py-2 px-1" 
                    : "px-5 py-3 rounded-2xl shadow-sm bg-orange-100/50 text-black-soft rounded-tr-none border border-orange-100"
                )}>
                  {msg.role === 'ai' ? (
                    <div className="prose prose-sm prose-zinc max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-100 prose-pre:rounded-xl prose-headings:font-serif prose-headings:text-black-soft prose-a:text-orange-600 prose-strong:text-black-soft">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  )}
                  
                  <div className={cn(
                    "flex gap-1 transition-opacity",
                    msg.role === 'user' 
                      ? "absolute top-1 left-1 opacity-0 group-hover:opacity-100"
                      : "mt-2 opacity-0 group-hover:opacity-100"
                  )}>
                    <button 
                      className="p-1 hover:bg-black/5 rounded text-zinc-400" 
                      title="Copiar"
                      onClick={() => navigator.clipboard.writeText(msg.content)}
                    >
                      <Copy size={14} />
                    </button>
                    {msg.role === 'ai' && (
                      <button className="p-1 hover:bg-black/5 rounded text-zinc-400" title="Gostei">
                        <ThumbsUp size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 animate-in fade-in duration-300">
              <div className="py-3 px-1 flex items-center gap-2 text-orange-400/80">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs font-medium font-sans">Gerando resposta...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Área de Input */}
      <div className="flex-none p-6 bg-gradient-to-t from-[#FFFBF7] via-[#FFFBF7] to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-white rounded-[2rem] shadow-xl shadow-orange-900/5 border border-orange-100 focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-orange-300 transition-all duration-300">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Continue a conversa..."
              rows={1}
              disabled={isTyping}
              className="w-full py-4 pl-6 pr-32 bg-transparent border-none resize-none focus:outline-none text-black-soft placeholder:text-zinc-300 text-lg leading-relaxed max-h-40 rounded-[2rem] disabled:opacity-50 font-sans"
              style={{ minHeight: '60px' }}
            />
            
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <button className="p-2.5 text-zinc-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors" title="Anexar arquivo">
                <Paperclip size={18} />
              </button>
              <button className="p-2.5 text-zinc-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors" title="Anexar imagem">
                <ImageIcon size={18} />
              </button>
              <button 
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                className="p-2.5 bg-black-soft text-orange-50 rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:hover:bg-black-soft ml-1"
                title="Enviar mensagem"
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-zinc-300 mt-3 font-medium tracking-wide font-sans">
            PsyMind pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;