import React from 'react';
import { CheckCircle2, Clock, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { Task } from '../hooks/useCalendarTasks';

interface CalendarStatsProps {
  tasks: Task[];
  selectedDate: Date;
}

const CalendarStats: React.FC<CalendarStatsProps> = ({ tasks, selectedDate }) => {
  const todayTasks = tasks.filter(task => 
    task.date.toDateString() === selectedDate.toDateString()
  );
  
  const completedTasks = todayTasks.filter(task => task.completed);
  const pendingTasks = todayTasks.filter(task => !task.completed);
  
  const completionRate = todayTasks.length > 0 
    ? Math.round((completedTasks.length / todayTasks.length) * 100) 
    : 0;

  const stats = [
    {
      icon: CalendarIcon,
      label: 'Total',
      value: todayTasks.length,
      color: 'text-blue-500'
    },
    {
      icon: CheckCircle2,
      label: 'Concluídas',
      value: completedTasks.length,
      color: 'text-green-500'
    },
    {
      icon: Clock,
      label: 'Pendentes',
      value: pendingTasks.length,
      color: 'text-orange-500'
    },
    {
      icon: TrendingUp,
      label: 'Taxa',
      value: `${completionRate}%`,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
      <h3 className="font-serif text-lg font-semibold text-foreground">Estatísticas do Dia</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
            <div className={`p-2 rounded-lg bg-background ${stat.color}`}>
              <stat.icon size={16} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-lg font-bold text-foreground">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {completionRate > 0 && (
        <div className="pt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Progresso</span>
            <span className="text-sm font-semibold text-foreground">{completionRate}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarStats;