import { useState, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  time: string;
  category: 'work' | 'personal' | 'health' | 'study';
  description?: string;
  completed: boolean;
  date: Date;
}

const STORAGE_KEY = 'calendar-tasks';

export const useCalendarTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((task: any) => ({
          ...task,
          date: new Date(task.date)
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
    
    // Tarefas padrão se não houver dados salvos
    return [
      {
        id: '1',
        title: 'Reunião de Kickoff',
        time: '09:00',
        category: 'work' as const,
        description: 'Alinhamento do novo projeto PsyMind.',
        completed: true,
        date: new Date()
      },
      {
        id: '2',
        title: 'Yoga & Meditação',
        time: '18:30',
        category: 'health' as const,
        completed: false,
        date: new Date()
      }
    ];
  });

  // Salvar no localStorage sempre que as tarefas mudarem
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  }, [tasks]);

  const addTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString()
    };
    setTasks(prev => [...prev, task]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.date.toDateString() === date.toDateString()
    ).sort((a, b) => a.time.localeCompare(b.time));
  };

  const searchTasks = (query: string, date?: Date) => {
    let filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(query.toLowerCase()))
    );

    if (date) {
      filtered = filtered.filter(task => 
        task.date.toDateString() === date.toDateString()
      );
    }

    return filtered.sort((a, b) => a.time.localeCompare(b.time));
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    getTasksForDate,
    searchTasks
  };
};