import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Calendar as CalendarIcon,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Clock
} from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import Sidebar from '@/components/workspace/Sidebar';
import AddTaskModal from '@/components/workspace/AddTaskModal';
import { cn } from '@/lib/utils';
import { ptBR } from 'date-fns/locale';

// Mock Data Types
interface Task {
  id: string;
  title: string;
  time: string;
  category: 'work' | 'personal' | 'health' | 'study';
  description?: string;
  completed: boolean;
  date: Date;
}

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeTab, setActiveTab] = useState<string>('calendar');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Tasks State
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Reunião de Kickoff',
      time: '09:00',
      category: 'work',
      description: 'Alinhamento do novo projeto PsyMind.',
      completed: true,
      date: new Date()
    },
    {
      id: '2',
      title: 'Yoga & Meditação',
      time: '18:30',
      category: 'health',
      completed: false,
      date: new Date()
    }
  ]);

  React.useEffect(() => {
    // Sempre define como 'calendar' ao montar a página
    setActiveTab('calendar');
    localStorage.setItem('activeTab', 'calendar');
  }, []);

  React.useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  const handleAddTask = (newTask: any) => {
    setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const filteredTasks = tasks.filter(task => {
    const isSameDate = task.date.toDateString() === date?.toDateString();
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return isSameDate && matchesSearch;
  }).sort((a, b) => a.time.localeCompare(b.time));

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'work': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'personal': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'health': return 'bg-green-100 text-green-700 border-green-200';
      case 'study': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'work': return 'Trabalho';
      case 'personal': return 'Pessoal';
      case 'health': return 'Saúde';
      case 'study': return 'Estudo';
      default: return 'Geral';
    }
  };

  return (
    <div className="h-screen bg-[#FFFBF7] font-sans text-zinc-900 selection:bg-orange-200 overflow-hidden flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleNavigate} 
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className={cn(
        "flex-1 h-full flex flex-col transition-all duration-300 ease-in-out overflow-hidden",
        isSidebarOpen ? "md:ml-64" : "md:ml-20"
      )}>
        {/* Header */}
        <header className="bg-[#FFFBF7]/90 backdrop-blur-md px-8 py-6 border-b border-orange-100/50 flex-none z-10">
          <div className="max-w-[1600px] mx-auto flex justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-serif font-medium text-zinc-900">Calendário</h1>
              <p className="text-sm text-zinc-500 mt-1">Organize seu tempo, cultive sua paz.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar tarefas..."
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
          </div>
        </header>

        {/* Main Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1600px] mx-auto h-full flex flex-col lg:flex-row gap-8">
            
            {/* Left Column: Calendar & Summary */}
            <div className="lg:w-[400px] xl:w-[450px] flex-none flex flex-col gap-8">
              {/* Calendar Card */}
              <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-orange-900/5 border border-orange-100">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md w-full"
                  classNames={{
                    head_cell: "text-zinc-400 font-normal text-[0.8rem] uppercase tracking-widest w-10",
                    cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-orange-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-10 w-10 p-0 font-medium text-zinc-700 aria-selected:opacity-100 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-colors",
                    day_selected: "bg-zinc-900 text-orange-50 hover:bg-zinc-800 hover:text-orange-50 focus:bg-zinc-900 focus:text-orange-50 rounded-full shadow-lg shadow-zinc-900/20",
                    day_today: "bg-orange-100 text-orange-900 font-bold",
                  }}
                  locale={ptBR}
                />
              </div>

              {/* Daily Summary Card */}
              <div className="bg-orange-50/50 p-8 rounded-[2.5rem] border border-orange-100 flex-1 min-h-[200px] flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-orange-400 mb-2">
                  <CalendarIcon size={32} />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-zinc-900">
                    {date?.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                  </h3>
                  <p className="text-zinc-500 mt-2">
                    {filteredTasks.length} tarefas agendadas para hoje.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Tasks Timeline */}
            <div className="flex-1 bg-white rounded-[2.5rem] border border-orange-100 shadow-xl shadow-orange-900/5 p-8 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-zinc-900">Agenda</h2>
                  <p className="text-sm text-zinc-400 font-medium uppercase tracking-wider mt-1">
                    {date?.toLocaleDateString('pt-BR', { weekday: 'long' })}
                  </p>
                </div>
                <button 
                  onClick={() => setIsTaskModalOpen(true)}
                  className="bg-zinc-900 text-orange-50 px-6 py-3 rounded-full font-medium hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20 flex items-center gap-2 hover:-translate-y-0.5"
                >
                  <Plus size={18} />
                  Nova Tarefa
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {filteredTasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-4 opacity-60">
                    <CalendarIcon size={48} strokeWidth={1.5} />
                    <p className="font-medium">Nenhuma tarefa para este dia.</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={cn(
                        "group p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4",
                        task.completed 
                          ? "bg-zinc-50 border-zinc-100 opacity-70" 
                          : "bg-white border-orange-100 hover:border-orange-200 hover:shadow-md"
                      )}
                    >
                      <button 
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={cn(
                          "mt-1 shrink-0 transition-colors",
                          task.completed ? "text-green-500" : "text-zinc-300 group-hover:text-orange-400"
                        )}
                      >
                        {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </button>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className={cn(
                            "font-medium text-lg transition-all",
                            task.completed ? "text-zinc-500 line-through decoration-zinc-300" : "text-zinc-900"
                          )}>
                            {task.title}
                          </h4>
                          <button className="text-zinc-300 hover:text-zinc-600 p-1">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-500">
                            <Clock size={14} />
                            {task.time}
                          </div>
                          <span className={cn(
                            "text-xs px-2.5 py-0.5 rounded-full font-semibold border",
                            getCategoryColor(task.category)
                          )}>
                            {getCategoryLabel(task.category)}
                          </span>
                        </div>

                        {task.description && (
                          <p className="mt-3 text-sm text-zinc-500 leading-relaxed border-t border-dashed border-zinc-100 pt-3">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <AddTaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAddTask={handleAddTask}
        selectedDate={date}
      />
    </div>
  );
};

export default CalendarPage;