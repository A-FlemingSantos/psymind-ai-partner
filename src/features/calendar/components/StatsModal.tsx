import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import CalendarStats from './CalendarStats';
import { Task } from '../hooks/useCalendarTasks';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  selectedDate: Date;
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, tasks, selectedDate }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-card rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="p-6 bg-orange-50/50 dark:bg-card border-b border-orange-100 dark:border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif text-foreground">Estatísticas do Dia</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <div className="p-6">
          <CalendarStats tasks={tasks} selectedDate={selectedDate} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatsModal;