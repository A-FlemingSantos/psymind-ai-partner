import React from 'react';
import { Plus, Calendar, Clock, Repeat } from 'lucide-react';
import { Button } from "@/shared/components/ui/button";

interface QuickActionsProps {
  onAddTask: () => void;
  selectedDate: Date;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAddTask, selectedDate }) => {
  const quickTaskTemplates = [
    {
      title: 'Reunião Rápida',
      category: 'work' as const,
      time: '14:00',
      icon: Calendar
    },
    {
      title: 'Pausa para Café',
      category: 'personal' as const,
      time: '15:30',
      icon: Clock
    },
    {
      title: 'Exercício',
      category: 'health' as const,
      time: '07:00',
      icon: Repeat
    }
  ];

  const handleQuickAdd = (template: typeof quickTaskTemplates[0]) => {
    // Simular adição rápida de tarefa
    const event = new CustomEvent('quickAddTask', {
      detail: {
        title: template.title,
        category: template.category,
        time: template.time,
        date: selectedDate,
        completed: false
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Plus size={16} className="text-muted-foreground" />
        <h3 className="font-medium text-foreground">Ações Rápidas</h3>
      </div>

      <div className="space-y-2">
        <Button
          onClick={onAddTask}
          className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus size={16} className="mr-2" />
          Nova Tarefa Personalizada
        </Button>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Templates Rápidos
          </p>
          {quickTaskTemplates.map((template, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => handleQuickAdd(template)}
              className="w-full justify-start text-sm"
            >
              <template.icon size={14} className="mr-2" />
              {template.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;