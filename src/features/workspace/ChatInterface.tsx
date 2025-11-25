import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUp, 
  Paperclip, 
  X, 
  MoreHorizontal, 
  Copy, 
  ThumbsUp, 
  RotateCcw, 
  Loader2,
  Check,
  FileText,
  File,
  Trash2,
  Volume2,
  VolumeX,
  Pause,
  Play
} from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { sendMessageToGemini } from '@/shared/utils/gemini';
import { useChat, Message } from '@/features/chat';

interface ChatInterfaceProps {
  initialPrompt: string;
  mode: 'Advisor' | 'Planner';
  personality: string;
  onClose: () => void;
}

interface AttachedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
  previewUrl?: string;
}

// Componente para blocos de código com botão de copiar
const CodeBlock: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  // Extrai a linguagem da className (formato: language-javascript ou hljs language-javascript)
  const language = className?.replace(/^(hljs\s+)?language-/, '') || 'text';
  const displayLanguage = language === 'text' ? 'código' : language;

  const handleCopy = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(codeRef.current.textContent || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group">
      <div className="bg-zinc-800 text-zinc-400 text-xs font-medium px-3 py-2 rounded-t-xl border-b border-zinc-700 flex justify-between items-center">
        <span>{displayLanguage}</span>
      </div>
      <pre className="bg-zinc-900 text-zinc-100 rounded-b-xl p-4 overflow-x-auto border border-zinc-700 border-t-0 m-0">
        <code ref={codeRef} className={className}>
          {children}
        </code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-3 p-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-white rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1 text-xs"
        title="Copiar código"
      >
        {copied ? (
          <>
            <Check size={12} />
            <span className="hidden sm:inline">Copiado!</span>
          </>
        ) : (
          <>
            <Copy size={12} />
            <span className="hidden sm:inline">Copiar</span>
          </>
        )}
      </button>
    </div>
  );
};

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
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSpeakingMessageId, setCurrentSpeakingMessageId] = useState<string | null>(null);
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
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

  // Limpar preview URLs ao desmontar
  useEffect(() => {
    return () => {
      attachedFiles.forEach(file => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles: AttachedFile[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        file,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }));
      
      setAttachedFiles(prev => [...prev, ...newFiles]);
      event.target.value = '';
    }
  };

  const handleRemoveFile = (id: string) => {
    setAttachedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <FileText size={14} />;
    if (type === 'application/pdf') return <FileText size={14} />;
    if (type.startsWith('text/')) return <FileText size={14} />;
    return <File size={14} />;
  };

  const handleSendMessage = () => {
    if (!input.trim() && attachedFiles.length === 0) return;

    // Se por acaso não houver ID (erro de estado), cria agora
    let chatId = currentConversationId;
    if (!chatId) {
      chatId = createConversation(input || `Anexo: ${attachedFiles.map(f => f.name).join(', ')}`);
    }

    // Prepara conteúdo da mensagem incluindo referência aos arquivos
    let messageContent = input;
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map(f => f.name).join(', ');
      messageContent = messageContent 
        ? `${messageContent}\n\n[Anexos: ${fileNames}]`
        : `[Anexos: ${fileNames}]`;
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    // Atualiza estado global
    addMessage(chatId, newUserMessage);
    setInput('');
    setAttachedFiles([]);
    
    // Limpa preview URLs
    attachedFiles.forEach(file => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
    
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    
    // Dispara IA com o histórico atualizado (incluindo a nova mensagem)
    const updatedHistory = [...messages, newUserMessage];
    handleGeminiResponse(chatId, updatedHistory, messageContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Função para extrair texto puro do markdown
  const extractTextFromMarkdown = (markdown: string): string => {
    // Remove blocos de código
    let text = markdown.replace(/```[\s\S]*?```/g, '');
    // Remove código inline
    text = text.replace(/`[^`]+`/g, '');
    // Remove links [text](url) -> text
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    // Remove imagens ![alt](url)
    text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '');
    // Remove headers (# ## ###)
    text = text.replace(/^#{1,6}\s+/gm, '');
    // Remove bold/italic
    text = text.replace(/\*\*([^\*]+)\*\*/g, '$1');
    text = text.replace(/\*([^\*]+)\*/g, '$1');
    // Remove list markers
    text = text.replace(/^[\s]*[-*+]\s+/gm, '');
    text = text.replace(/^[\s]*\d+\.\s+/gm, '');
    // Remove múltiplas quebras de linha
    text = text.replace(/\n{3,}/g, '\n\n');
    // Remove espaços extras
    text = text.trim();
    return text;
  };

  // Função para ler uma mensagem
  const speakMessage = (messageId: string, content: string) => {
    // Para qualquer leitura anterior
    stopSpeaking();

    const text = extractTextFromMarkdown(content);
    if (!text || text.length === 0) return;

    // Verifica se o navegador suporta speechSynthesis
    if (!('speechSynthesis' in window)) {
      console.warn('Seu navegador não suporta síntese de voz');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setCurrentSpeakingMessageId(messageId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSpeakingMessageId(null);
      speechSynthesisRef.current = null;
    };

    utterance.onerror = (error) => {
      console.error('Erro na síntese de voz:', error);
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSpeakingMessageId(null);
      speechSynthesisRef.current = null;
    };

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Função para pausar/retomar leitura
  const togglePauseSpeaking = () => {
    if (!window.speechSynthesis) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Função para parar leitura
  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentSpeakingMessageId(null);
    speechSynthesisRef.current = null;
  };

  // Efeito para leitura automática de novas mensagens da IA
  useEffect(() => {
    if (autoReadEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'ai' && !isTyping && !isSpeaking) {
        // Pequeno delay para garantir que a mensagem foi renderizada
        const timer = setTimeout(() => {
          const text = extractTextFromMarkdown(lastMessage.content);
          if (text && text.length > 0 && 'speechSynthesis' in window) {
            stopSpeaking();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onstart = () => {
              setIsSpeaking(true);
              setIsPaused(false);
              setCurrentSpeakingMessageId(lastMessage.id);
            };

            utterance.onend = () => {
              setIsSpeaking(false);
              setIsPaused(false);
              setCurrentSpeakingMessageId(null);
              speechSynthesisRef.current = null;
            };

            utterance.onerror = () => {
              setIsSpeaking(false);
              setIsPaused(false);
              setCurrentSpeakingMessageId(null);
              speechSynthesisRef.current = null;
            };

            speechSynthesisRef.current = utterance;
            window.speechSynthesis.speak(utterance);
          }
        }, 500);
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, autoReadEnabled, isTyping, isSpeaking]);

  // Limpa síntese de voz ao desmontar
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

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
          {/* Controles de áudio globais */}
          {isSpeaking && (
            <>
              <button
                onClick={togglePauseSpeaking}
                className="p-2 hover:bg-orange-50 rounded-full text-orange-500 hover:text-orange-600 transition-colors"
                title={isPaused ? "Retomar leitura" : "Pausar leitura"}
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
              </button>
              <button
                onClick={stopSpeaking}
                className="p-2 hover:bg-orange-50 rounded-full text-orange-500 hover:text-orange-600 transition-colors"
                title="Parar leitura"
              >
                <VolumeX size={18} />
              </button>
            </>
          )}
          <button
            onClick={() => setAutoReadEnabled(!autoReadEnabled)}
            className={cn(
              "p-2 rounded-full transition-colors",
              autoReadEnabled
                ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                : "hover:bg-orange-50 text-zinc-400 hover:text-zinc-600"
            )}
            title={autoReadEnabled ? "Desativar leitura automática" : "Ativar leitura automática"}
          >
            <Volume2 size={18} />
          </button>
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
                    <div className="prose prose-sm prose-zinc max-w-none prose-p:leading-relaxed prose-code:bg-zinc-200 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-headings:font-serif prose-headings:text-black-soft prose-a:text-orange-600 prose-strong:text-black-soft">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          pre: ({ children, ...props }) => {
                            const child = React.Children.toArray(children)[0] as React.ReactElement;
                            const className = child?.props?.className || '';
                            return <CodeBlock className={className}>{children}</CodeBlock>;
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content.includes('```') || msg.content.includes('`') ? (
                      <div className="prose prose-sm max-w-none prose-code:bg-zinc-200 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            pre: ({ children, ...props }) => {
                              const child = React.Children.toArray(children)[0] as React.ReactElement;
                              const className = child?.props?.className || '';
                              return <CodeBlock className={className}>{children}</CodeBlock>;
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    )
                  )}
                  
                  <div className={cn(
                    "flex gap-1 transition-opacity",
                    msg.role === 'user' 
                      ? "absolute top-1 left-1 opacity-0 group-hover:opacity-100"
                      : "mt-2 opacity-0 group-hover:opacity-100"
                  )}>
                    <button 
                      className="p-1 hover:bg-black/5 rounded text-zinc-400 hover:text-zinc-600 transition-colors" 
                      title="Copiar"
                      onClick={() => navigator.clipboard.writeText(msg.content)}
                    >
                      <Copy size={14} />
                    </button>
                    {msg.role === 'ai' && (
                      <>
                        {currentSpeakingMessageId === msg.id ? (
                          <>
                            <button
                              onClick={togglePauseSpeaking}
                              className="p-1 hover:bg-black/5 rounded text-orange-500 hover:text-orange-600 transition-colors"
                              title={isPaused ? "Retomar leitura" : "Pausar leitura"}
                            >
                              {isPaused ? <Play size={14} /> : <Pause size={14} />}
                            </button>
                            <button
                              onClick={stopSpeaking}
                              className="p-1 hover:bg-black/5 rounded text-orange-500 hover:text-orange-600 transition-colors"
                              title="Parar leitura"
                            >
                              <VolumeX size={14} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => speakMessage(msg.id, msg.content)}
                            className="p-1 hover:bg-black/5 rounded text-zinc-400 hover:text-orange-500 transition-colors"
                            title="Escutar mensagem"
                          >
                            <Volume2 size={14} />
                          </button>
                        )}
                        <button className="p-1 hover:bg-black/5 rounded text-zinc-400 hover:text-zinc-600 transition-colors" title="Gostei">
                          <ThumbsUp size={14} />
                        </button>
                      </>
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
          {/* Arquivos Anexados */}
          {attachedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2 animate-fade-in">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="group flex items-center gap-2 bg-white border border-orange-200 rounded-xl px-3 py-2 shadow-sm hover:shadow-md transition-all"
                >
                  {file.previewUrl ? (
                    <img
                      src={file.previewUrl}
                      alt={file.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center text-orange-600">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black-soft truncate max-w-[150px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="p-1 hover:bg-red-50 rounded-full text-zinc-400 hover:text-red-500 transition-colors"
                    title="Remover arquivo"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative bg-white rounded-[2rem] shadow-xl shadow-orange-900/5 border border-orange-100 focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-orange-300 transition-all duration-300">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={attachedFiles.length > 0 ? "Adicione uma mensagem (opcional)..." : "Continue a conversa..."}
              rows={1}
              disabled={isTyping}
              className="w-full py-4 pl-6 pr-28 bg-transparent border-none resize-none focus:outline-none text-black-soft placeholder:text-zinc-300 text-lg leading-relaxed max-h-40 rounded-[2rem] disabled:opacity-50 font-sans"
              style={{ minHeight: '60px' }}
            />
            
            {/* Input de arquivo oculto */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.txt,.md,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.mp3,.wav,.mp4,.mov"
            />
            
            <div className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center gap-1">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-zinc-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors hover-lift"
                title="Anexar arquivo"
                disabled={isTyping}
              >
                <Paperclip size={18} />
              </button>
              <button 
                onClick={handleSendMessage}
                disabled={(!input.trim() && attachedFiles.length === 0) || isTyping}
                className="p-2.5 bg-black-soft text-orange-50 rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:hover:bg-black-soft disabled:cursor-not-allowed ml-1 hover-lift"
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