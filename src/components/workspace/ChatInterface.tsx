import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUp, 
  Paperclip, 
  Image as ImageIcon, 
  X, 
  MoreHorizontal, 
  User,
  Sparkles,
  Copy,
  ThumbsUp,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Garante que initialPrompt seja uma string segura antes de usar
  const safeInitialPrompt = initialPrompt || "";

  // Inicializa o chat com o prompt da tela anterior
  useEffect(() => {
    if (safeInitialPrompt && messages.length === 0) {
      const initialUserMessage: Message = {
        id: '1',
        role: 'user',
        content: safeInitialPrompt,
        timestamp: new Date()
      };
      setMessages([initialUserMessage]);
      simulateAIResponse(initialUserMessage.content);
    }
  }, [safeInitialPrompt, messages.length]);

  // Auto-scroll para o final
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

  const simulateAIResponse = (userText: string) => {
    setIsTyping(true);
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const aiResponses = [
          "Essa é uma questão interessante. Considerando seu contexto atual, sugiro começarmos organizando os pontos principais.",
          "Entendo como você se sente. Vamos respirar fundo e analisar isso com calma. O que você acha que é a raiz desse sentimento?",
          "Aqui está um plano preliminar que podemos seguir. Dividi em etapas menores para não parecer tão avassalador.",
          "Essa perspectiva é válida. Você já considerou olhar por outro ângulo? Talvez focando no que você pode controlar agora.",
        ];
        
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        
        const newAiMessage: Message = {
          id: Date.now().toString(),
          role: 'ai',
          content: randomResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, newAiMessage]);
        setIsTyping(false);
        resolve();
      }, 2000);
    });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    
    simulateAIResponse(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Gera título seguro
  const chatTitle = safeInitialPrompt.split(' ').slice(0, 5).join(' ') + (safeInitialPrompt.split(' ').length > 5 ? '...' : '');

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#FFFBF7] animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex-none px-8 py-6 border-b border-orange-100/50 bg-[#FFFBF7]/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-orange-100 rounded-full transition-colors text-zinc-500 hover:text-zinc-900"
            title="Fechar chat"
          >
            <X size={20} />
          </button>
          <div>
            <div className="flex flex-col">
              {/* Título Principal */}
              <h2 className="font-serif text-xl text-zinc-900 font-medium truncate max-w-md" title={safeInitialPrompt}>
                {chatTitle || "Nova Conversa"}
              </h2>
              
              {/* Subtítulo */}
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
              {/* Conteúdo da Mensagem */}
              <div className={cn(
                "flex flex-col gap-2 max-w-[80%]",
                msg.role === 'user' ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "text-base leading-relaxed relative group",
                  msg.role === 'ai' 
                    ? "text-zinc-700 py-2 px-1" // IA: Texto plano
                    : "px-4 py-3 rounded-2xl shadow-sm bg-orange-100/50 text-zinc-800 rounded-tr-none border border-orange-100" // User: Balão Compacto
                )}>
                  {msg.content}
                  
                  {/* Ações da Mensagem */}
                  <div className={cn(
                    "flex gap-1 transition-opacity",
                    msg.role === 'user' 
                      ? "absolute top-1 left-1 opacity-0 group-hover:opacity-100"
                      : "mt-2 opacity-0 group-hover:opacity-100"
                  )}>
                    <button className="p-1 hover:bg-black/5 rounded text-zinc-400" title="Copiar"><Copy size={14} /></button>
                    {msg.role === 'ai' && <button className="p-1 hover:bg-black/5 rounded text-zinc-400" title="Gostei"><ThumbsUp size={14} /></button>}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 animate-in fade-in duration-300">
              {/* Spinner de carregamento */}
              <div className="py-3 px-1 flex items-center gap-2 text-orange-400/80">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs font-medium">Gerando resposta...</span>
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
              className="w-full py-4 pl-6 pr-32 bg-transparent border-none resize-none focus:outline-none text-zinc-700 placeholder:text-zinc-300 max-h-40 rounded-[2rem]"
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
                disabled={!input.trim()}
                className="p-2.5 bg-zinc-900 text-orange-50 rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:hover:bg-zinc-900 ml-1"
                title="Enviar mensagem"
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-zinc-300 mt-3 font-medium tracking-wide">
            PsyMind pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;