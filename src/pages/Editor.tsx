import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CornerDownLeft
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

const Editor: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Página sem título");
  const [content, setContent] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");

  // Mock functionality for toolbar to prevent default form submission behavior
  const handleToolbarAction = (e: React.MouseEvent, action: string) => {
    e.preventDefault();
    console.log(`Action triggered: ${action}`);
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
              className="h-9 w-9 ml-2"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <MoreHorizontal size={18} /> : <Bot size={18} />}
            </Button>
          </div>
        </header>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-border/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
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
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleToolbarAction(e, 'bold')}>
              <Bold size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleToolbarAction(e, 'italic')}>
              <Italic size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleToolbarAction(e, 'list')}>
              <List size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleToolbarAction(e, 'code')}>
              <Code size={14} />
            </Button>
          </div>
        </div>

        {/* Document Canvas */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto py-12 px-8 min-h-full cursor-text" onClick={() => document.getElementById('editor-textarea')?.focus()}>
            <textarea
              id="editor-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Começar a digitar..."
              className="w-full h-full min-h-[60vh] bg-transparent resize-none border-none outline-none text-base leading-relaxed placeholder:text-muted-foreground/40"
            />
          </div>
        </div>
      </div>

      {/* Right Chat Sidebar - "Conversa" */}
      {isSidebarOpen && (
        <div className="w-[400px] border-l border-border bg-card/50 backdrop-blur-sm flex flex-col h-full animate-in slide-in-from-right-10 duration-300 shadow-xl z-10">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border/40">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(false)}
              className="text-muted-foreground hover:text-foreground h-8 w-8"
            >
              <X size={18} />
            </Button>
            <span className="text-sm font-medium text-muted-foreground">Conversa</span>
            <div className="w-8" /> {/* Spacer to center title */}
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
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
          </div>

          {/* Sidebar Footer (Input) */}
          <div className="p-4 pt-2 bg-card/50">
            <div className="flex flex-col gap-2">
              <div className="flex justify-center">
                <span className="text-[10px] text-muted-foreground/70">O Copilot pode cometer erros.</span>
              </div>
              <div className="relative flex items-center">
                <Button variant="ghost" size="icon" className="absolute left-1 h-8 w-8 text-muted-foreground hover:text-foreground shrink-0">
                  <Plus size={18} />
                </Button>
                <Input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Mensagem para o Copilot" 
                  className="pl-10 pr-10 py-5 rounded-xl border-border/60 bg-background shadow-sm focus-visible:ring-1 focus-visible:ring-orange-200 transition-all"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                  disabled={!chatInput.trim()}
                >
                  <CornerDownLeft size={16} />
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