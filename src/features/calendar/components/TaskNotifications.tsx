import React, { useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Task } from '../hooks/useCalendarTasks';
import { toast } from '@/shared/hooks/use-toast';

interface TaskNotificationsProps {
  tasks: Task[];
}

const TaskNotifications: React.FC<TaskNotificationsProps> = ({ tasks }) => {
  useEffect(() => {
    const checkUpcomingTasks = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const todayTasks = tasks.filter(task => 
        task.date.toDateString() === now.toDateString() && 
        !task.completed
      );

      todayTasks.forEach(task => {
        const [taskHour, taskMinute] = task.time.split(':').map(Number);
        const taskTime = new Date(now);
        taskTime.setHours(taskHour, taskMinute, 0, 0);
        
        const timeDiff = taskTime.getTime() - now.getTime();
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        
        // Notificar 15 minutos antes
        if (minutesDiff === 15) {
          toast({
            title: "Tarefa em 15 minutos",
            description: `${task.title} às ${task.time}`,
            duration: 5000,
          });
        }
        
        // Notificar 5 minutos antes
        if (minutesDiff === 5) {
          toast({
            title: "Tarefa em 5 minutos",
            description: `${task.title} às ${task.time}`,
            duration: 5000,
          });
        }
        
        // Notificar na hora
        if (minutesDiff === 0) {
          toast({
            title: "Hora da tarefa!",
            description: `${task.title} agora`,
            duration: 10000,
          });
        }
      });
    };

    // Verificar a cada minuto
    const interval = setInterval(checkUpcomingTasks, 60000);
    
    // Verificar imediatamente
    checkUpcomingTasks();
    
    return () => clearInterval(interval);
  }, [tasks]);

  return null; // Este componente não renderiza nada visualmente
};

export default TaskNotifications;