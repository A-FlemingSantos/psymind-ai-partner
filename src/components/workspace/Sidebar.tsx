import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Folder, Calendar, PieChart, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import NavItem from './NavItem';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, toggle }) => {
  const navigate = useNavigate();

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
    
    if (tab === 'calendar') {
      navigate('/calendar');
    } else if (tab === 'dashboard') {
      navigate('/workspace');
    }
    // 'projects' e 'analytics' não têm página ainda, apenas atualizam o estado visual
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

      {/* Toggle Button - Absolute position on the border */}
      <button 
        onClick={toggle}
        className="absolute -right-3 top-9 bg-zinc-800 text-zinc-400 hover:text-orange-200 border border-zinc-700 rounded-full p-1 shadow-md transition-colors z-30"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        <NavItem 
          icon={<Layout size={20} />} 
          label="Dashboard" 
          active={activeTab === 'dashboard'} 
          onClick={() => handleNavigation('dashboard')} 
          isCollapsed={!isOpen}
        />
        <NavItem 
          icon={<Folder size={20} />} 
          label="Projetos" 
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
        <NavItem 
          icon={<PieChart size={20} />} 
          label="Análises" 
          active={activeTab === 'analytics'} 
          onClick={() => handleNavigation('analytics')} 
          isCollapsed={!isOpen}
        />
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
            <Settings size={16} className="ml-auto text-zinc-400 cursor-pointer hover:text-orange-300 transition-colors shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;