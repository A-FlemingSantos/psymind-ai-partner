import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Book, 
  Calendar, 
  MessageCircle, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  History
} from 'lucide-react';
import NavItem from './NavItem';
import { cn } from '@/shared/utils';
import { useChat } from '@/features/chat';
import { useGlobalSettings } from '@/features/settings';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, toggle }) => {
  const navigate = useNavigate();
  const [isHistoryOpen, setIsHistoryOpen] = useState(true); // Começa aberto para facilitar visualização
  const { conversations, selectConversation, currentConversationId } = useChat();
  const { openSettings } = useGlobalSettings();

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
    
    if (tab === 'calendar') {
      navigate('/calendar');
    } else if (tab === 'dashboard') {
      navigate('/workspace');
    }
  };

  const handleConversationClick = (id: string) => {
    selectConversation(id);
    // Força a ida para o dashboard e marca como 'conversations' visualmente
    setActiveTab('conversations'); 
    navigate('/workspace'); 
  };

  return (
    <div 
      className={cn(
        "hidden md:flex flex-col bg-zinc-900 text-orange-50 h-full fixed left-0 top-0 shadow-2xl z-20 transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Header / Logo Area */}
      <div className={cn("flex items-center gap-3 p-6", !isOpen && "justify-center p-4")}>
        <div className="w-8 h-8 bg-orange-300 rounded-lg flex items-center justify-center shrink-0">
          <Layout size={18} className="text-zinc-900" />
        </div>
        
        {isOpen && (
          <h1 className="text-xl font-serif tracking-wide text-orange-100 whitespace-nowrap overflow-hidden animate-in fade-in duration-300">
            Atelier.
          </h1>
        )}
      </div>

      {/* Toggle Button */}
      <button 
        onClick={toggle}
        className="absolute -right-3 top-9 bg-zinc-800 text-zinc-400 hover:text-orange-200 border border-zinc-700 rounded-full p-1 shadow-md transition-colors z-30"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto scrollbar-thin">
        <NavItem 
          icon={<Layout size={20} />} 
          label="Dashboard" 
          active={activeTab === 'dashboard'} 
          onClick={() => handleNavigation('dashboard')} 
          isCollapsed={!isOpen}
        />
        <NavItem 
          icon={<Book size={20} />} 
          label="Cadernos" 
          active={activeTab === 'projects'} 
          onClick={() => handleNavigation('projects')} 
          isCollapsed={!isOpen}
        />
        <NavItem 
          icon={<Calendar size={20} />} 
          label="Calendário" 
          active={activeTab === 'calendar'} 
          onClick={() => handleNavigation('calendar')} 
          isCollapsed={!isOpen}
        />

        {/* Seção Conversas (Expansível) */}
        {!isOpen ? (
          // Versão Colapsada (Apenas ícone)
          <NavItem 
            icon={<MessageCircle size={20} />} 
            label="Conversas" 
            active={activeTab === 'conversations'} 
            onClick={() => {
              setIsHistoryOpen(true);
              toggle(); // Abre a sidebar se clicar no ícone colapsado
            }} 
            isCollapsed={true}
          />
        ) : (
          // Versão Expandida (Accordion)
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className={cn(
                "flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 group",
                activeTab === 'conversations' || isHistoryOpen
                  ? "text-orange-100 bg-zinc-800/50" 
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-orange-200"
              )}
            >
              <div className="flex items-center gap-3">
                <MessageCircle size={20} className="shrink-0" />
                <span className="font-medium tracking-wide">Conversas</span>
              </div>
              
              {/* Indicador Arrow Down / Right */}
              <div className="text-zinc-500 group-hover:text-orange-200 transition-colors">
                {isHistoryOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </button>

            {/* Lista de Histórico */}
            {isHistoryOpen && (
              <div className="flex flex-col gap-1 pl-4 animate-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto scrollbar-thin">
                {conversations.length === 0 ? (
                  <p className="text-xs text-zinc-500 px-4 py-2 italic">Nenhuma conversa ainda.</p>
                ) : (
                  conversations.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => handleConversationClick(chat.id)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors text-left truncate group w-full",
                        currentConversationId === chat.id && activeTab === 'conversations'
                          ? "bg-orange-500/10 text-orange-200 border border-orange-500/20"
                          : "text-zinc-500 hover:text-orange-100 hover:bg-zinc-800/50"
                      )}
                      title={chat.title}
                    >
                      <History size={14} className="shrink-0 opacity-70 group-hover:text-orange-300" />
                      <span className="truncate">{chat.title}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* User Footer */}
      <div className="p-3 mt-auto">
        <div className={cn(
          "bg-zinc-800/50 rounded-xl p-3 flex items-center border border-zinc-700/50 transition-all",
          isOpen ? "gap-3" : "justify-center bg-transparent border-transparent"
        )}>
          <div className="w-9 h-9 bg-orange-200 rounded-full flex items-center justify-center text-zinc-900 font-bold shrink-0 text-sm">
            JS
          </div>
          
          {isOpen && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-orange-50 truncate">João Silva</p>
              <p className="text-xs text-zinc-400 truncate">Workspace Pro</p>
            </div>
          )}
          
          {isOpen && (
            <Settings 
              size={16} 
              className="ml-auto text-zinc-400 cursor-pointer hover:text-orange-300 transition-colors shrink-0" 
              onClick={() => openSettings()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;