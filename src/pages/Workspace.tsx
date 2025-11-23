import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Plus,
  CheckCircle,
  ArrowUp,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Brain,
  Calendar,
  ChevronDown,
  Target
} from 'lucide-react';
import Sidebar from '@/components/workspace/Sidebar';
import FlowerDoodle from '@/components/workspace/FlowerDoodle';
import ProjectCard from '@/components/workspace/ProjectCard';
import AddProjectModal from '@/components/workspace/AddProjectModal';
import ChatInterface from '@/components/workspace/ChatInterface';
import { Project } from '@/types/workspace';
import { cn } from '@/lib/utils';

const Workspace: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(() => {
    const saved = localStorage.getItem('activeTab');
    return saved && ['dashboard', 'projects', 'analytics'].includes(saved) ? saved : 'dashboard';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [chatInput, setChatInput] = useState<string>('');
  
  // Novo estado para controlar a interface de chat
  const [isChatActive, setIsChatActive] = useState<boolean>(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState<string>('');

  // Estados de interação (Menus)
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isPersonalityOpen, setIsPersonalityOpen] = useState(false);
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'Advisor' | 'Planner'>('Advisor');
  const [selectedPersonality, setSelectedPersonality] = useState<string>('Empathetic');

  // Refs para fechar menus ao clicar fora
  const fileMenuRef = useRef<HTMLDivElement>(null);
  const personalityRef = useRef<HTMLDivElement>(null);
  const modeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(event.target as Node)) {
        setIsFileMenuOpen(false);
      }
      if (personalityRef.current && !personalityRef.current.contains(event.target as Node)) {
        setIsPersonalityOpen(false);
      }
      if (modeMenuRef.current && !modeMenuRef.current.contains(event.target as Node)) {
        setIsModeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Garante que ao entrar no Workspace, se não houver activeTab válido, usa 'dashboard'
    if (!['dashboard', 'projects', 'analytics'].includes(activeTab)) {
      setActiveTab('dashboard');
      localStorage.setItem('activeTab', 'dashboard');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // Dados iniciais simulados
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "Diário de Gratidão",
      category: "Pessoal",
      progress: 100,
      dueDate: "22 Nov",
      members: [1],
      status: "Ativo"
    },
    {
      id: 2,
      title: "Anotações de Terapia",
      category: "Saúde",
      progress: 45,
      dueDate: "18 Nov",
      members: [1],
      status: "Recorrente"
    },
    {
      id: 3,
      title: "Ideias para o Livro",
      category: "Criativo",
      progress: 20,
      dueDate: "10 Nov",
      members: [1, 2],
      status: "Em Rascunho"
    },
    {
      id: 4,
      title: "Estudos de Filosofia",
      category: "Estudo",
      progress: 60,
      dueDate: "05 Nov",
      members: [1],
      status: "Ativo"
    }
  ]);

  const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;

    if (!title) return;

    const newProject: Project = {
      id: projects.length + 1,
      title: title,
      category: category || "Geral",
      progress: 0,
      dueDate: new Date().toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      members: [1],
      status: "Novo"
    };

    setProjects([newProject, ...projects]);
    setIsModalOpen(false);
  };

  const handleStartChat = () => {
    if (!chatInput.trim()) return;
    setInitialChatPrompt(chatInput);
    setIsChatActive(true);
    setChatInput(''); // Limpa o input
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleStartChat();
    }
  };

  const getModeTranslation = (mode: string) => {
    return mode === 'Advisor' ? 'Conselheiro' : 'Planejador';
  };

  // Renderiza a interface de chat se estiver ativa
  if (isChatActive) {
    return (
      <div className="h-screen bg-[#FFFBF7] font-sans text-zinc-900 selection:bg-orange-200 overflow-hidden flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className={cn(
          "h-full w-full transition-all duration-300 ease-in-out relative",
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        )}>
          <ChatInterface 
            initialPrompt={initialChatPrompt}
            mode={selectedMode}
            personality={selectedPersonality}
            onClose={() => setIsChatActive(false)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#FFFBF7] font-sans text-zinc-900 selection:bg-orange-200 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Conteúdo Principal */}
      <main 
        className={cn(
          "h-screen overflow-y-auto snap-y snap-proximity scroll-smooth transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        )}
      >

        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#FFFBF7]/90 backdrop-blur-md px-8 py-6">
          <div className="max-w-[1600px] mx-auto flex justify-end items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-full bg-white border border-orange-100 focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100/50 w-64 transition-all placeholder:text-zinc-300 text-sm"
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-white border border-orange-100 flex items-center justify-center text-zinc-600 hover:text-orange-500 hover:border-orange-200 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Container do Conteúdo */}
        <div className="p-8 max-w-[1600px] mx-auto">

          {/* Hero / Mensagem Central */}
          <div className="flex flex-col items-center justify-start pt-6 min-h-[85vh] mb-12 animate-in slide-in-from-bottom-4 duration-700 snap-start scroll-mt-28">
            <FlowerDoodle />
            <h1 className="text-4xl md:text-6xl font-serif text-zinc-800 mt-8 mb-4 tracking-tight text-center">
              Olá, o que tem em mente?
            </h1>
            
            {/* Input de Chat IA */}
            <div className="w-full max-w-2xl mt-8 relative group animate-in fade-in zoom-in-95 duration-700 delay-150">
              <div className="relative bg-white rounded-[2rem] shadow-2xl shadow-orange-500/10 border border-orange-200 p-2 focus-within:ring-2 focus-within:ring-orange-200 transition-all duration-300">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Digite para perguntar ao seu ${getModeTranslation(selectedMode).toLowerCase()}...`}
                  aria-label="Campo de entrada para conversa com assistente"
                  className="w-full min-h-[120px] p-4 pr-4 bg-transparent border-none resize-none focus:outline-none text-zinc-700 placeholder:text-zinc-300 text-lg leading-relaxed rounded-2xl pb-16"
                />
                
                {/* Barra de Ferramentas Inferior */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  
                  {/* Ações à Esquerda (Anexos e Personalidade) */}
                  <div className="flex items-center gap-2">
                    
                    {/* Menu de Upload */}
                    <div className="relative" ref={fileMenuRef}>
                      {isFileMenuOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-40 bg-white rounded-xl shadow-lg border border-orange-100 p-1.5 flex flex-col gap-1 animate-in slide-in-from-bottom-2 duration-200 z-20">
                          <button className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 rounded-lg text-sm text-zinc-600 hover:text-zinc-900 transition-colors w-full text-left">
                            <FileText size={16} />
                            <span>Documento</span>
                          </button>
                          <button className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 rounded-lg text-sm text-zinc-600 hover:text-zinc-900 transition-colors w-full text-left">
                            <ImageIcon size={16} />
                            <span>Imagem</span>
                          </button>
                        </div>
                      )}
                      <button 
                        onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
                        className="p-2.5 rounded-full text-zinc-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                        title="Adicionar anexo"
                      >
                        <Plus size={20} className={cn("transition-transform duration-300", isFileMenuOpen && "rotate-45")} />
                      </button>
                    </div>

                    {/* Menu de Personalidade */}
                    <div className="relative" ref={personalityRef}>
                      {isPersonalityOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-lg border border-orange-100 p-1.5 flex flex-col gap-1 animate-in slide-in-from-bottom-2 duration-200 z-20">
                          <div className="px-2 py-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Personalidade</div>
                          {[
                            { id: 'Empathetic', label: 'Empático' }, 
                            { id: 'Direct', label: 'Direto' }, 
                            { id: 'Creative', label: 'Criativo' }, 
                            { id: 'Analytical', label: 'Analítico' }
                          ].map((p) => (
                            <button 
                              key={p.id}
                              onClick={() => {
                                setSelectedPersonality(p.id);
                                setIsPersonalityOpen(false);
                              }}
                              className={cn(
                                "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors w-full text-left",
                                selectedPersonality === p.id ? "bg-orange-50 text-orange-600 font-medium" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                              )}
                            >
                              <span>{p.label}</span>
                              {selectedPersonality === p.id && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                            </button>
                          ))}
                        </div>
                      )}
                      <button 
                        onClick={() => setIsPersonalityOpen(!isPersonalityOpen)}
                        className={cn(
                          "p-2.5 rounded-full transition-colors flex items-center gap-2",
                          selectedPersonality !== 'Empathetic' ? "text-orange-500 bg-orange-50" : "text-zinc-400 hover:text-orange-500 hover:bg-orange-50"
                        )}
                        title="Personalidade da IA"
                      >
                        <Sparkles size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Ação à Direita (Botão de Enviar e Modos) */}
                  <div className="relative" ref={modeMenuRef}>
                    {isModeMenuOpen && (
                      <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-2xl shadow-xl border border-orange-100 p-2 flex flex-col gap-1 animate-in slide-in-from-bottom-2 duration-200 z-20">
                        <button 
                          onClick={() => {
                            setSelectedMode('Advisor');
                            setIsModeMenuOpen(false);
                          }}
                          className="group flex items-start gap-3 p-3 hover:bg-orange-50 rounded-xl text-left transition-colors"
                        >
                          <div className="p-2 bg-orange-100 rounded-lg text-orange-600 group-hover:bg-orange-200 transition-colors">
                            <Brain size={18} />
                          </div>
                          <div>
                            <div className="font-medium text-zinc-900 text-sm">Conselheiro</div>
                            <div className="text-xs text-zinc-500">Orientação empática e reflexão</div>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => {
                            setSelectedMode('Planner');
                            setIsModeMenuOpen(false);
                          }}
                          className="group flex items-start gap-3 p-3 hover:bg-orange-50 rounded-xl text-left transition-colors"
                        >
                          <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
                            <Target size={18} />
                          </div>
                          <div>
                            <div className="font-medium text-zinc-900 text-sm">Planejador</div>
                            <div className="text-xs text-zinc-500">Passos acionáveis e organização</div>
                          </div>
                        </button>
                      </div>
                    )}

                    <div className="flex items-center bg-zinc-900 rounded-2xl p-1.5 shadow-lg shadow-zinc-900/20 gap-1 transition-transform active:scale-95">
                      <button 
                        onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-orange-50 hover:text-white transition-colors"
                      >
                        <span className="tracking-wide">{getModeTranslation(selectedMode)}</span>
                        <ChevronDown size={14} className={cn("text-zinc-400 transition-transform duration-200", isModeMenuOpen && "rotate-180")} />
                      </button>
                      
                      <button 
                        onClick={handleStartChat}
                        className="p-2 bg-zinc-800 text-orange-50 rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50"
                        disabled={!chatInput.trim()}
                        title="Enviar"
                      >
                        <ArrowUp size={18} />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
              <p className="text-center text-xs text-zinc-300 mt-4 font-medium tracking-wide">
                A IA pode cometer erros. Verifique informações importantes.
              </p>
            </div>

            {/* Grid de Sugestões */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              {[
                { text: "Como posso controlar a ansiedade?", mode: 'Advisor' },
                { text: "Dicas para manter o foco nos estudos", mode: 'Advisor' },
                { text: "Me ajude a criar um plano de estudos", mode: 'Planner' },
                { text: "Como organizar melhor minha rotina?", mode: 'Planner' }
              ].map((suggestion, index) => (
                <button 
                  key={index}
                  onClick={() => {
                    setChatInput(suggestion.text);
                    setSelectedMode(suggestion.mode as 'Advisor' | 'Planner');
                  }}
                  className="p-4 text-left bg-white/40 hover:bg-white border border-orange-100/50 hover:border-orange-200 rounded-2xl transition-all duration-200 text-zinc-600 hover:text-zinc-900 text-sm font-medium hover:shadow-md hover:-translate-y-0.5 flex flex-col gap-1 group"
                >
                  <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide group-hover:text-orange-500 transition-colors">
                    {getModeTranslation(suggestion.mode)}
                  </span>
                  <span>{suggestion.text}</span>
                </button>
              ))}
            </div>

            {/* Indicador de Scroll (Seta) */}
            <div className="mt-12 animate-bounce duration-2000">
              <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-400 opacity-90">
                <path 
                  d="M22 5C32 10 38 25 28 32C18 39 8 22 20 45L20 55" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M12 48L20 55L28 48" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </div>
          </div>

          {/* Seções de Conteúdo Principal (Cadernos e Foco) */}
          <div className="grid grid-cols-1 gap-12 items-start w-full snap-start scroll-mt-28">

            {/* Seção Superior: Cadernos */}
            <div className="w-full space-y-8 min-w-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-serif font-semibold text-zinc-900 mb-2">Cadernos Recentes</h3>
                  <div className="flex gap-2">
                    {[
                      { id: 'All', label: 'Todos' },
                      { id: 'Personal', label: 'Pessoal' },
                      { id: 'Health', label: 'Saúde' },
                      { id: 'Work', label: 'Trabalho' },
                      { id: 'Study', label: 'Estudo' }
                    ].map((filter) => (
                      <button key={filter.id} className="px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-orange-100 text-zinc-500 hover:text-zinc-900 hover:border-orange-200 transition-colors">
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group flex items-center gap-2 px-6 py-3 bg-zinc-900 text-orange-50 rounded-full hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20 hover:shadow-xl hover:shadow-zinc-900/30 hover:-translate-y-0.5"
                >
                  <Plus size={18} />
                  <span className="font-medium">Novo Caderno</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                {projects
                  .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(project => (
                  <div key={project.id} className="h-full">
                    <ProjectCard project={project} />
                  </div>
                ))}

                {/* Empty State / Placeholder de Adicionar Novo */}
                <div className="h-full">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full h-full min-h-[250px] rounded-3xl border-2 border-dashed border-orange-200 flex flex-col items-center justify-center gap-4 hover:bg-orange-50/50 transition-all"
                  >
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Plus size={32} className="text-orange-400" />
                    </div>
                    <p className="font-medium text-zinc-400 group-hover:text-orange-400 transition-colors">Criar novo caderno</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Seção Inferior: Foco de Hoje */}
            <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
              <div className="flex items-center justify-between mb-8 h-[52px]">
                <h3 className="text-2xl font-serif font-semibold text-zinc-900">Foco de Hoje</h3>
                <button className="text-orange-400 text-sm font-medium hover:underline">Calendário</button>
              </div>

              <div className="bg-zinc-900 rounded-3xl p-8 text-orange-50 relative overflow-hidden min-h-[300px] flex flex-col md:flex-row gap-8">
                {/* Elementos decorativos de fundo */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-300/10 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-6 flex-1 max-w-2xl">
                  <div>
                    <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Prioridade</span>
                    <h4 className="text-3xl font-bold mb-4 leading-snug">Estudar para a Prova de História</h4>
                    <p className="text-zinc-400 text-base mb-6 leading-relaxed">Revisar os capítulos sobre a Revolução Industrial e fazer os exercícios práticos do final do livro. Focar nos principais eventos e datas.</p>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                        <div className="w-10 h-10 rounded-full bg-orange-200 border-2 border-zinc-900 flex items-center justify-center text-zinc-900 font-bold text-xs">EU</div>
                        <div className="w-10 h-10 rounded-full bg-orange-300 border-2 border-zinc-900 flex items-center justify-center text-zinc-900 font-bold text-xs">IA</div>
                      </div>
                      <span className="text-sm text-zinc-400">+1 assistente virtual</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 md:w-1/3 min-w-[300px]">
                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-medium text-base">Etapas de Estudo</h5>
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-lg text-zinc-300">1/3 Concluído</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-zinc-300 group cursor-pointer">
                        <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-zinc-900 shrink-0 transition-transform group-hover:scale-110"><CheckCircle size={12} /></div>
                        <span className="line-through text-zinc-500 truncate group-hover:text-zinc-300 transition-colors">Ler Capítulo 4</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-300 group cursor-pointer">
                        <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-zinc-900 shrink-0 transition-transform group-hover:scale-110"><CheckCircle size={12} /></div>
                        <span className="line-through text-zinc-500 truncate group-hover:text-zinc-300 transition-colors">Fazer resumo dos tópicos</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm group cursor-pointer">
                        <div className="w-5 h-5 rounded-full border-2 border-orange-500/50 shrink-0 transition-colors group-hover:border-orange-500"></div>
                        <span className="truncate text-orange-100 group-hover:text-white transition-colors">Resolver 10 questões</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <AddProjectModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleAddProject={handleAddProject}
      />
    </div>
  );
};

export default Workspace;