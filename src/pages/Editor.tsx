import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  Share, 
  Trash2, 
  Type, 
  X, 
  Bold, 
  Italic, 
  List, 
  Code, 
  Plus, 
  FilePlus,
  MoreHorizontal,
  Bot,
  CornerDownLeft,
  Loader2,
  Copy,
  ThumbsUp,
  ArrowLeft,
  Eye,
  PenLine
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// Importação atualizada para usar o serviço específico do Editor
import { sendMessageToEditor, ChatMessage } from '@/lib/gemini-editor';

const Editor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Título do Documento
  const [title, setTitle] = useState("Página sem título");
  
  useEffect(() => {
    if (location.state?.initialTitle) {
      setTitle(location.state.initialTitle);
    }
  }, [location.state]);

  // Conteúdo do Editor
  const [content, setContent] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false); // Estado para alternar visualização
  
  // Estados do Sidebar e Chat
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (isSidebarOpen && hasStartedChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isSidebarOpen, hasStartedChat]);

  const handleToolbarAction = (e: React.MouseEvent, action: string) => {
    e.preventDefault();
    
    // Função simples para inserir formatação markdown no textarea
    const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText = content;
    let insertion = '';

    switch (action) {
      case 'bold':
        insertion = `**${selectedText || 'texto em negrito'}**`;
        break;
      case 'italic':
        insertion = `*${selectedText || 'texto em itálico'}*`;
        break;
      case 'list':
        insertion = `\n- ${selectedText || 'item da lista'}`;
        break;
      case 'code':
        insertion = `\`${selectedText || 'código'}\``;
        break;
    }

    if (insertion) {
      newText = content.substring(0, start) + insertion + content.substring(end);
      setContent(newText);
      // Opcional: Restaurar foco e posição do cursor (pode ser complexo com React state updates assíncronos)
    }
  };

  // Função para aplicar o texto da IA ao editor
  const handleApplyToEditor = (text: string) => {
    setContent(text);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: chatInput };
    
    // Atualiza estado imediato
    setMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setHasStartedChat(true);
    setIsTyping(true);

    try {
      // Chama a API específica do Editor, PASSANDO O CONTEÚDO DO DOCUMENTO
      const responseText = await sendMessageToEditor(messages, userMessage.content, content);
      
      const aiMessage: ChatMessage = { role: 'ai', content: responseText };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: ChatMessage = { role: 'ai', content: "Desculpe, ocorreu um erro ao processar sua solicitação." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-background font-sans text-foreground overflow-hidden">
      
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300 relative">
        
        {/* Top Navigation / Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border/40">
          <div className="flex items-center gap-3 flex-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/workspace')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft size={20} />
            </Button>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-serif font-semibold bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-auto w-full max-w-md placeholder:text-muted-foreground/50"
              placeholder="Página sem título"
            />
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <Button variant="ghost" size="sm" className="gap-2 h-9 px-3 text-xs font-medium hidden sm:flex">
              <FilePlus size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 h-9 px-3 text-xs font-medium">
              <Share size={16} />
              <span className="hidden sm:inline">Compartilhar</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive/80 hover:text-destructive">
              <Trash2 size={16} />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <Button variant="ghost" size="sm" className="gap-2 h-9 px-3 text-xs font-medium">
              <Type size={16} />
              <span className="hidden sm:inline">Fontes</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-9 w-9 ml-2 transition-colors", isSidebarOpen && "bg-accent text-accent-foreground")}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <MoreHorizontal size={18} /> : <Bot size={18} />}
            </Button>
          </div>
        </header>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-border/40 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <Select defaultValue="paragraph">
              <SelectTrigger className="w-[120px] h-8 border-none bg-transparent focus:ring-0 text-xs font-medium text-muted-foreground hover:bg-accent/50">
                <SelectValue placeholder="Estilo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paragraph">Parágrafo</SelectItem>
                <SelectItem value="h1">Título 1</SelectItem>
                <SelectItem value="h2">Título 2</SelectItem>
                <SelectItem value="h3">Título 3</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-5" />

            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleToolbarAction(e, 'bold')} title="Negrito (**texto**)">
                <Bold size={14} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleToolbarAction(e, 'italic')} title="Itálico (*texto*)">
                <Italic size={14} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleToolbarAction(e, 'list')} title="Lista (- item)">
                <List size={14} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleToolbarAction(e, 'code')} title="Código (`código`)">
                <Code size={14} />
              </Button>
            </div>
          </div>

          {/* Botão de Alternar Visualização */}
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("gap-2 h-8 text-xs font-medium", isPreviewMode && "bg-accent text-accent-foreground")}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? (
              <>
                <PenLine size={14} />
                Editar
              </>
            ) : (
              <>
                <Eye size={14} />
                Visualizar
              </>
            )}
          </Button>
        </div>

        {/* Document Canvas */}
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-3xl mx-auto py-12 px-8 min-h-full">
            {isPreviewMode ? (
              // Modo Visualização (Markdown Renderizado)
              <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none prose-headings:font-serif prose-p:leading-relaxed cursor-text min-h-[60vh]" onClick={() => setIsPreviewMode(false)}>
                {content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <span className="text-muted-foreground/40">Nada para visualizar...</span>
                )}
              </div>
            ) : (
              // Modo Edição (Textarea)
              <textarea
                id="editor-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Começar a digitar... (Use Markdown para formatar)"
                className="w-full h-full min-h-[60vh] bg-transparent resize-none border-none outline-none text-base leading-relaxed placeholder:text-muted-foreground/40 focus:ring-0 font-mono text-sm md:text-base"
              />
            )}
          </div>
        </div>
      </div>

      {/* Right Chat Sidebar */}
      {isSidebarOpen && (
        <div className="w-[400px] border-l border-border bg-card/50 backdrop-blur-sm flex flex-col h-full animate-in slide-in-from-right-10 duration-300 shadow-xl z-10">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border/40 bg-background/50">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(false)}
              className="text-muted-foreground hover:text-foreground h-8 w-8"
            >
              <X size={18} />
            </Button>
            <span className="text-sm font-medium text-muted-foreground">Conversa</span>
            <div className="w-8" />
          </div>

          {/* Sidebar Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-background/30">
            {!hasStartedChat ? (
              // Estado Inicial (Onboarding)
              <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2">Sua página está pronta</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Esse é seu espaço para debate, rascunho e iteração. Estou aqui para ajudar ao longo do caminho.
                  </p>
                </div>

                {/* Illustration Placeholder */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border p-8 flex flex-col items-center justify-center text-center shadow-sm py-12">
                  <div className="relative mb-4">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded">I think I can contribute</span>
                    <div className="absolute -bottom-4 right-0 transform translate-y-1/2 translate-x-1/2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black dark:text-white drop-shadow-md">
                        <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="currentColor" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Trabalhe em um espaço focado</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Não é mais necessário colar em outro documento, podemos trabalhar juntos aqui mesmo.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Aqui quando você precisar</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Faça perguntas ou obtenha comentários sobre seções específicas quando estiver com dificuldades.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Traga suas fontes</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Carregue PDFs e documentos para me ajudar a entender seu tópico e fazer edições melhores.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Estado de Chat Ativo
              <div className="space-y-6">
                {messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "flex animate-in slide-in-from-bottom-2 duration-300 w-full",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {/* Balão de Mensagem */}
                    <div className={cn(
                      "text-sm leading-relaxed group relative",
                      msg.role === 'user' 
                        ? "bg-peach-200 text-zinc-900 font-medium rounded-2xl px-4 py-2 shadow-sm max-w-[85%]" // ALTERADO: text-zinc-900 forçado
                        : "w-full text-foreground px-1 text-justify" // Assistente justificado
                    )}>
                      {msg.role === 'ai' ? (
                        <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-muted prose-pre:rounded-lg prose-a:text-orange-500 break-words">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <span className="whitespace-pre-wrap break-words">{msg.content}</span>
                      )}

                      {/* Ações da Mensagem (apenas para IA) */}
                      {msg.role === 'ai' && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 mt-2 items-center">
                          <button 
                            className="p-1.5 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
                            onClick={() => navigator.clipboard.writeText(msg.content)}
                            title="Copiar"
                          >
                            <Copy size={14} />
                          </button>
                          <button 
                            className="p-1.5 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
                            title="Útil"
                          >
                            <ThumbsUp size={14} />
                          </button>
                          {/* Botão de Aplicar ao Editor */}
                          <button
                            className="flex items-center gap-1.5 px-2 py-1 ml-1 text-xs font-medium bg-peach-100 dark:bg-peach-900/30 text-orange-700 dark:text-orange-300 rounded-md hover:bg-peach-200 dark:hover:bg-peach-900/50 transition-colors"
                            onClick={() => handleApplyToEditor(msg.content)}
                            title="Substituir conteúdo do editor"
                          >
                            <ArrowLeft size={12} />
                            Aplicar ao Editor
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center animate-in fade-in px-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                      <span className="text-xs">PsyMind está digitando...</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} className="h-1" />
              </div>
            )}
          </div>

          {/* Sidebar Footer (Input) */}
          <div className="p-4 pt-2 bg-background/80 backdrop-blur-sm border-t border-border/40">
            <div className="flex flex-col gap-2">
              {!hasStartedChat && (
                <div className="flex justify-center animate-out fade-out duration-200">
                  <span className="text-[10px] text-muted-foreground/70">O PsyMind pode cometer erros.</span>
                </div>
              )}
              <div className="relative flex items-center">
                <Button variant="ghost" size="icon" className="absolute left-1 h-8 w-8 text-muted-foreground hover:text-foreground shrink-0">
                  <Plus size={18} />
                </Button>
                <Input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Mensagem para o PsyMind" 
                  disabled={isTyping}
                  className="pl-10 pr-10 py-5 rounded-xl border-border/60 bg-background shadow-sm focus-visible:ring-1 focus-visible:ring-orange-200 transition-all"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                  disabled={!chatInput.trim() || isTyping}
                  onClick={handleSendMessage}
                >
                  {isTyping ? <Loader2 size={16} className="animate-spin" /> : <CornerDownLeft size={16} />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;