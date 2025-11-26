import React, { useState } from 'react';
import { X, Clock, Tag, AlignLeft, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Task } from '../hooks/useCalendarTasks';

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  task: Task | null;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpdateTask, 
  onDeleteTask, 
  task 
}) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    time: task?.time || '',
    category: task?.category || 'work',
    description: task?.description || ''
  });

  React.useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        time: task.time,
        category: task.category,
        description: task.description || ''
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    
    onUpdateTask(task.id, formData);
    onClose();
  };

  const handleDelete = () => {
    if (!task) return;
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      onDeleteTask(task.id);
      onClose();
    }
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-card rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="p-6 bg-orange-50/50 dark:bg-card border-b border-orange-100 dark:border-border">
          <div className="flex items-center justify-between mb-2">
            <DialogTitle className="text-2xl font-serif text-foreground">Editar Tarefa</DialogTitle>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleDelete}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors text-red-500 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            {task.date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Reunião de Planejamento"
              className="bg-muted/50 border-border focus:ring-orange-200 rounded-xl py-6 text-base"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time" className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Clock size={12} /> Horário
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="bg-muted/50 border-border focus:ring-orange-200 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Tag size={12} /> Categoria
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as Task['category'] }))}
              >
                <SelectTrigger className="bg-muted/50 border-border focus:ring-orange-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Trabalho</SelectItem>
                  <SelectItem value="personal">Pessoal</SelectItem>
                  <SelectItem value="health">Saúde</SelectItem>
                  <SelectItem value="study">Estudos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <AlignLeft size={12} /> Detalhes
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Adicione notas ou links importantes..."
              className="bg-muted/50 border-border focus:ring-orange-200 rounded-xl resize-none min-h-[100px]"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1 rounded-xl py-6 text-base font-medium"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 text-base font-medium shadow-lg"
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditModal;