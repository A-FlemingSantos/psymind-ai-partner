import React from 'react';
import { Layout, Folder, Calendar, PieChart, Settings } from 'lucide-react';
import NavItem from './NavItem';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => (
  <div className="hidden md:flex w-64 flex-col bg-zinc-900 text-orange-50 h-full fixed left-0 top-0 shadow-2xl z-20">
    <div className="p-8 flex items-center gap-3">
      <div className="w-8 h-8 bg-orange-300 rounded-lg flex items-center justify-center">
        <Layout size={18} className="text-zinc-900" />
      </div>
      <h1 className="text-xl font-serif tracking-wide text-orange-100">Atelier.</h1>
    </div>

    <nav className="flex-1 px-4 py-4 space-y-2">
      <NavItem icon={<Layout size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
      <NavItem icon={<Folder size={20} />} label="Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
      <NavItem icon={<Calendar size={20} />} label="Calendar" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
      <NavItem icon={<PieChart size={20} />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
    </nav>

    <div className="p-4 mt-auto">
      <div className="bg-zinc-800/50 rounded-xl p-4 flex items-center gap-3 border border-zinc-700/50">
        <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-zinc-900 font-bold">
          JD
        </div>
        <div>
          <p className="text-sm font-medium text-orange-50">Jane Doe</p>
          <p className="text-xs text-zinc-400">Pro Workspace</p>
        </div>
        <Settings size={16} className="ml-auto text-zinc-400 cursor-pointer hover:text-orange-300 transition-colors" />
      </div>
    </div>
  </div>
);

export default Sidebar;
