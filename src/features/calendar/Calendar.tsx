import React, { useState } from 'react';
import { 
  Search, Bell, Plus, Calendar as CalendarIcon, MoreHorizontal, CheckCircle2, Circle, Clock,
  Sun, Moon
} from 'lucide-react';
import { Calendar } from "@/shared/components/ui/calendar";
import { Sidebar, AddTaskModal } from '@/features/workspace';
import { cn } from '@/shared/utils/utils';
import { ptBR } from 'date-fns/locale';
// import { useTheme } from 'next-themes';
import { useCalendarTasks, Task } from './hooks/useCalendarTasks';
import TaskEditModal from './components/TaskEditModal';
import CalendarStats from './components/CalendarStats';
import TaskFilters from './components/TaskFilters';
import TaskNotifications from './components/TaskNotifications';
import StatsModal from './components/StatsModal';

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeTab, setActiveTab] = useState<string>('calendar');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  
  // Hook de tema (simulado)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  // Hook personalizado para gerenciar tarefas
  const { 
    tasks,
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTaskCompletion, 
    getTasksForDate, 
    searchTasks 
  } = useCalendarTasks();

  React.useEffect(() => {
    setActiveTab('calendar');
    localStorage.setItem('activeTab', 'calendar');
  }, []);

  React.useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const handleNavigate = (tab: string) => setActiveTab(tab);
  
  const handleAddTask = (newTask: any) => {
    addTask(newTask);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  // Listener para ações rápidas
  React.useEffect(() => {
    const handleQuickAdd = (event: CustomEvent) => {
      addTask(event.detail);
    };

    window.addEventListener('quickAddTask', handleQuickAdd as EventListener);
    return () => {
      window.removeEventListener('quickAddTask', handleQuickAdd as EventListener);
    };
  }, [addTask]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setShowCompleted(true);
    setSearchQuery('');
  };

  const filteredTasks = React.useMemo(() => {
    let tasks = searchQuery 
      ? searchTasks(searchQuery, date) 
      : date 
      ? getTasksForDate(date) 
      : [];

    // Filtrar por categorias
    if (selectedCategories.length > 0) {
      tasks = tasks.filter(task => selectedCategories.includes(task.category));
    }

    // Filtrar por status
    if (!showCompleted) {
      tasks = tasks.filter(task => !task.completed);
    }

    return tasks;
  }, [searchQuery, date, selectedCategories, showCompleted, searchTasks, getTasksForDate]);

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
    <div className="h-screen bg-background font-sans text-foreground selection:bg-orange-200 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleNavigate} 
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className={cn(
        "flex-1 h-full flex flex-col transition-all duration-300 ease-in-out",
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
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-orange-200 transition-colors"
              >
                {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
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
          <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8 min-h-full">
            
            {/* Left Column: Calendar & Summary */}
            <div className="lg:w-[400px] xl:w-[450px] flex-none flex flex-col gap-8">
              {/* Calendar Card */}
              <div className="bg-card p-6 rounded-[2.5rem] shadow-xl shadow-orange-900/5 border border-border">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
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
              </div>


              
              {/* Statistics Card - Clicável */}
              {date && (
                <button
                  onClick={() => setIsStatsModalOpen(true)}
                  className="bg-orange-50/50 dark:bg-card p-8 rounded-[2.5rem] border border-border flex-1 min-h-[200px] flex flex-col justify-center items-center text-center space-y-4 hover:bg-orange-100/50 dark:hover:bg-card/80 transition-colors cursor-pointer"
                >
                  <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-sm text-orange-400 mb-2">
                    <CalendarIcon size={32} />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-foreground">
                      {date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      {filteredTasks.length} tarefas agendadas para hoje.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 opacity-70">
                      Clique para ver estatísticas
                    </p>
                  </div>
                </button>
              )}
              

              

            </div>

            {/* Right Column: Tasks Timeline */}
            <div className="flex-1 bg-card rounded-[2.5rem] border border-border shadow-xl shadow-orange-900/5 p-8 flex flex-col min-h-[600px]">
              <div className="flex justify-between items-center mb-6">
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
              
              {/* Filtros na Agenda */}
              <div className="mb-6">
                <TaskFilters
                  selectedCategories={selectedCategories}
                  onCategoryToggle={handleCategoryToggle}
                  showCompleted={showCompleted}
                  onToggleCompleted={() => setShowCompleted(!showCompleted)}
                  onClearFilters={handleClearFilters}
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {filteredTasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 opacity-60">
                    <CalendarIcon size={48} strokeWidth={1.5} />
                    <div className="text-center">
                      <p className="font-medium mb-2">Nenhuma tarefa para este dia.</p>
                      <p className="text-sm">
                        {selectedCategories.length > 0 || !showCompleted 
                          ? 'Tente ajustar os filtros ou' 
                          : 'Que tal'} adicionar uma nova tarefa?
                      </p>
                    </div>
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
                          <button 
                            onClick={() => handleEditTask(task)}
                            className="text-muted-foreground hover:text-foreground p-1"
                          >
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
                
                {filteredTasks.length > 0 && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-xl">
                    <p className="text-xs text-muted-foreground text-center">
                      Mostrando {filteredTasks.length} de {date ? getTasksForDate(date).length : 0} tarefas
                      {selectedCategories.length > 0 && ` • Filtros: ${selectedCategories.length} categoria(s)`}
                      {!showCompleted && ' • Apenas pendentes'}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Sistema de Notificações */}
      <TaskNotifications tasks={tasks} />

      <AddTaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAddTask={handleAddTask}
        selectedDate={date}
      />
      
      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        task={selectedTask}
      />
      
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        tasks={tasks}
        selectedDate={date || new Date()}
      />
    </div>
  );
};

export default CalendarPage;