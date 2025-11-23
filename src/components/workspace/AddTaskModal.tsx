import React from 'react';
import { X, Clock, Tag, AlignLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: any) => void;
  selectedDate?: Date;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask, selectedDate }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onAddTask({
      title: formData.get('title'),
      time: formData.get('time'),
      category: formData.get('category'),
      description: formData.get('description'),
      date: selectedDate,
      completed: false
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="p-6 bg-[#FFFBF7] border-b border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <DialogTitle className="text-2xl font-serif text-zinc-900">Nova Tarefa</DialogTitle>
            <button onClick={onClose} className="p-2 hover:bg-orange-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-600">
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Para {selectedDate?.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Título</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ex: Reunião de Planejamento"
              className="bg-zinc-50 border-orange-100 focus:ring-orange-200 rounded-xl py-6 text-base"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time" className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Clock size={12} /> Horário
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                className="bg-zinc-50 border-orange-100 focus:ring-orange-200 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Tag size={12} /> Categoria
              </Label>
              <Select name="category" defaultValue="work">
                <SelectTrigger className="bg-zinc-50 border-orange-100 focus:ring-orange-200 rounded-xl">
                  <SelectValue placeholder="Selecione" />
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
            <Label htmlFor="description" className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <AlignLeft size={12} /> Detalhes
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Adicione notas ou links importantes..."
              className="bg-zinc-50 border-orange-100 focus:ring-orange-200 rounded-xl resize-none min-h-[100px]"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-orange-50 rounded-xl py-6 text-base font-medium shadow-lg shadow-zinc-900/10">
              Agendar Tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;