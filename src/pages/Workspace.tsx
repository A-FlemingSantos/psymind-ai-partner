import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  CheckCircle
} from 'lucide-react';
import Sidebar from '@/components/workspace/Sidebar';
import FlowerDoodle from '@/components/workspace/FlowerDoodle';
import ProjectCard from '@/components/workspace/ProjectCard';
import AddProjectModal from '@/components/workspace/AddProjectModal';
import { Project } from '@/types/workspace';

const Workspace: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initial Mock Data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "Brand Identity Refresh",
      category: "Design",
      progress: 75,
      dueDate: "Oct 24",
      members: [1, 2, 3],
      status: "In Progress"
    },
    {
      id: 2,
      title: "Q4 Marketing Campaign",
      category: "Marketing",
      progress: 30,
      dueDate: "Nov 01",
      members: [2, 4],
      status: "Planning"
    },
    {
      id: 3,
      title: "Mobile App Redesign",
      category: "Development",
      progress: 90,
      dueDate: "Oct 15",
      members: [1, 3, 5],
      status: "Review"
    },
    {
      id: 4,
      title: "Sustainability Report",
      category: "Research",
      progress: 15,
      dueDate: "Dec 10",
      members: [4],
      status: "In Progress"
    }
  ]);

  const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Melhoria: Usando FormData para extração de dados mais segura e limpa
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;

    if (!title) return; // Guard clause simples

    const newProject: Project = {
      id: projects.length + 1,
      title: title,
      category: category || "General",
      progress: 0,
      dueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      members: [1],
      status: "Started"
    };

    setProjects([newProject, ...projects]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7] font-sans text-zinc-900 selection:bg-orange-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen transition-all duration-300">

        {/* Header - Simplified to focus on tools */}
        <header className="sticky top-0 z-10 bg-[#FFFBF7]/90 backdrop-blur-md px-8 py-6">
          <div className="max-w-[1600px] mx-auto flex justify-end items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
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

        {/* Content Container */}
        <div className="p-8 max-w-[1600px] mx-auto">

          {/* Hero / Center Message */}
          <div className="flex flex-col items-center justify-center min-h-[40vh] mb-12 animate-in slide-in-from-bottom-4 duration-700">
            <FlowerDoodle />
            <h1 className="text-4xl md:text-6xl font-serif text-zinc-800 mt-8 mb-4 tracking-tight text-center">
              Hello, what's on your mind?
            </h1>
            <div className="w-full max-w-lg h-1 bg-gradient-to-r from-transparent via-orange-200 to-transparent rounded-full opacity-50"></div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">

            {/* Left Column: Projects */}
            <div className="xl:col-span-3 space-y-8 min-w-0">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-serif font-semibold text-zinc-900 mb-2">Recent Projects</h3>
                  <div className="flex gap-2">
                    {['All', 'Design', 'Marketing', 'Dev'].map((filter) => (
                      <button key={filter} className="px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-orange-100 text-zinc-500 hover:text-zinc-900 hover:border-orange-200 transition-colors">
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group flex items-center gap-2 px-6 py-3 bg-zinc-900 text-orange-50 rounded-full hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20 hover:shadow-xl hover:shadow-zinc-900/30 hover:-translate-y-0.5"
                >
                  <Plus size={18} />
                  <span className="font-medium">New Project</span>
                </button>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scrollbar-thin scrollbar-thumb-orange-100 scrollbar-track-transparent">
                {projects
                  .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(project => (
                  <div key={project.id} className="min-w-[320px] md:min-w-[360px] snap-start">
                    <ProjectCard project={project} />
                  </div>
                ))}

                {/* Empty State / Add New Placeholder */}
                <div className="min-w-[320px] md:min-w-[360px] snap-start">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full h-full min-h-[280px] rounded-3xl border-2 border-dashed border-orange-200 flex flex-col items-center justify-center gap-4 hover:bg-orange-50/50 transition-all"
                  >
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Plus size={32} className="text-orange-400" />
                    </div>
                    <p className="font-medium text-zinc-400 group-hover:text-orange-400 transition-colors">Create new workspace</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Today's Focus */}
            <div className="xl:col-span-1 h-full">
              <div className="flex items-center justify-between mb-8 h-[52px]">
                <h3 className="text-2xl font-serif font-semibold text-zinc-900">Today's Focus</h3>
                <button className="text-orange-400 text-sm font-medium hover:underline">Calendar</button>
              </div>

              <div className="bg-zinc-900 rounded-3xl p-6 text-orange-50 relative overflow-hidden min-h-[400px] flex flex-col">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-300/10 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-6 flex-1">
                  <div>
                    <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Priority</span>
                    <h4 className="text-2xl font-bold mb-3 leading-snug">Review Q3 Analytics</h4>
                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed">Prepare the presentation deck for tomorrow's board meeting. Focus on user retention metrics.</p>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-orange-200 border-2 border-zinc-900"></div>
                        <div className="w-8 h-8 rounded-full bg-orange-300 border-2 border-zinc-900"></div>
                      </div>
                      <span className="text-xs text-zinc-400">+2 others</span>
                    </div>
                  </div>

                  <div className="mt-auto bg-white/5 rounded-2xl p-5 backdrop-blur-sm border border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium text-sm">Subtasks</h5>
                      <span className="text-xs text-zinc-400">2/3 Done</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-zinc-300">
                        <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-zinc-900 shrink-0"><CheckCircle size={12} /></div>
                        <span className="line-through text-zinc-500 truncate">Export raw data</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-300">
                        <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-zinc-900 shrink-0"><CheckCircle size={12} /></div>
                        <span className="line-through text-zinc-500 truncate">Generate visual graphs</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full border-2 border-orange-500/50 shrink-0"></div>
                        <span className="truncate">Write summary</span>
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
