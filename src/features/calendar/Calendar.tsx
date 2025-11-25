import React, { useState } from 'react';
import { 
  Search, Bell, Plus, Calendar as CalendarIcon, MoreHorizontal, CheckCircle2, Circle, Clock,
  Sun, Moon
} from 'lucide-react';
import { Calendar } from "@/shared/components/ui/calendar";
import { Sidebar, AddTaskModal } from '@/features/workspace';
import { cn } from '@/shared/utils/utils';
import { ptBR } from 'date-fns/locale';
import { useTheme } from 'next-themes';

// ... (Interfaces e Estados de Task mantidos iguais)
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
  
  // Hook de tema
  const { setTheme, theme } = useTheme();

  // ... (Estado tasks e funções handlers mantidas iguais)
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
    setActiveTab('calendar');
    localStorage.setItem('activeTab', 'calendar');
  }, []);

  React.useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const handleNavigate = (tab: string) => setActiveTab(tab);
  
  const handleAddTask = (newTask: any) => {
    setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const filteredTasks = tasks.filter(task => {
    const isSameDate = task.date.toDateString() === date?.toDateString();
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return isSameDate && matchesSearch;
  }).sort((a, b) => a.time.localeCompare(b.time));

  const getCategoryColor = (category: string) => {
    // Ajustados para melhor visibilidade no dark mode
    switch(category) {
      case 'work': return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'personal': return 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'health': return 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'study': return 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
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
    <div className="h-screen bg-background font-sans text-foreground selection:bg-orange-200 overflow-hidden flex">
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
        <header className="bg-background/80 backdrop-blur-md px-8 py-6 border-b border-border/40 flex-none z-10">
          <div className="max-w-[1600px] mx-auto flex justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-serif font-medium text-foreground">Calendário</h1>
              <p className="text-sm text-muted-foreground mt-1">Organize seu tempo, cultive sua paz.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Buscar tarefas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 rounded-full bg-card border border-border focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100/50 w-64 transition-all placeholder:text-muted-foreground text-sm"
                />
              </div>

              {/* Botão Tema */}
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-orange-200 transition-colors"
              >
                <Sun size={18} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon size={18} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </button>

              <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-orange-500 hover:border-orange-200 transition-colors relative">
                <Bell size={18} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
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
              <div className="bg-card p-6 rounded-[2.5rem] shadow-xl shadow-orange-900/5 border border-border">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md w-full"
                  classNames={{
                    head_cell: "text-muted-foreground font-normal text-[0.8rem] uppercase tracking-widest w-10",
                    cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-10 w-10 p-0 font-medium text-foreground aria-selected:opacity-100 hover:bg-accent hover:text-foreground rounded-full transition-colors",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full shadow-lg",
                    day_today: "bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 font-bold",
                  }}
                  locale={ptBR}
                />
              </div>

              {/* Daily Summary Card */}
              <div className="bg-orange-50/50 dark:bg-card p-8 rounded-[2.5rem] border border-border flex-1 min-h-[200px] flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-sm text-orange-400 mb-2">
                  <CalendarIcon size={32} />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-foreground">
                    {date?.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    {filteredTasks.length} tarefas agendadas para hoje.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Tasks Timeline */}
            <div className="flex-1 bg-card rounded-[2.5rem] border border-border shadow-xl shadow-orange-900/5 p-8 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">Agenda</h2>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mt-1">
                    {date?.toLocaleDateString('pt-BR', { weekday: 'long' })}
                  </p>
                </div>
                <button 
                  onClick={() => setIsTaskModalOpen(true)}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all shadow-lg flex items-center gap-2 hover:-translate-y-0.5"
                >
                  <Plus size={18} />
                  Nova Tarefa
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {filteredTasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 opacity-60">
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
                          ? "bg-muted/50 border-border opacity-70" 
                          : "bg-card border-border hover:border-orange-200 dark:hover:border-orange-800 hover:shadow-md"
                      )}
                    >
                      <button 
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={cn(
                          "mt-1 shrink-0 transition-colors",
                          task.completed ? "text-green-500" : "text-muted-foreground group-hover:text-orange-400"
                        )}
                      >
                        {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </button>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className={cn(
                            "font-medium text-lg transition-all",
                            task.completed ? "text-muted-foreground line-through" : "text-foreground"
                          )}>
                            {task.title}
                          </h4>
                          <button className="text-muted-foreground hover:text-foreground p-1">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
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
                          <p className="mt-3 text-sm text-muted-foreground leading-relaxed border-t border-dashed border-border pt-3">
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