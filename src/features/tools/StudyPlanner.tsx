import React, { useState } from 'react';
import { Calendar, Clock, Target, Plus, X, Sparkles } from 'lucide-react';
import { generateStudyTip } from '@/shared/services';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  duration: number;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

const StudyPlanner: React.FC = () => {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [newTask, setNewTask] = useState({
    subject: '',
    topic: '',
    duration: 25,
    priority: 'medium' as 'high' | 'medium' | 'low'
  });
  const [tip, setTip] = useState('');
  const [loadingTip, setLoadingTip] = useState(false);

  const addTask = () => {
    if (!newTask.subject || !newTask.topic) return;
    
    const task: StudyTask = {
      id: Date.now().toString(),
      ...newTask,
      completed: false
    };
    
    setTasks([...tasks, task]);
    setNewTask({ subject: '', topic: '', duration: 25, priority: 'medium' });
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const totalTime = tasks.reduce((acc, task) => acc + (task.completed ? 0 : task.duration), 0);

  const getTip = async () => {
    setLoadingTip(true);
    try {
      const result = await generateStudyTip();
      setTip(result);
    } catch (error) {
      setTip('Mantenha o foco e faça pausas regulares.');
    } finally {
      setLoadingTip(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="text-blue-500" size={24} />
          Planejador de Estudos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Task Form */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-muted rounded-lg">
          <Input
            placeholder="Matéria"
            value={newTask.subject}
            onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
          />
          <Input
            placeholder="Tópico"
            value={newTask.topic}
            onChange={(e) => setNewTask({ ...newTask, topic: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Minutos"
            value={newTask.duration}
            onChange={(e) => setNewTask({ ...newTask, duration: parseInt(e.target.value) || 25 })}
          />
          <Select value={newTask.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewTask({ ...newTask, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addTask} className="flex items-center gap-2">
            <Plus size={16} />
            Adicionar
          </Button>
        </div>

        {/* Study Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-blue-500" size={20} />
              <span className="font-medium">Tempo Total</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalTime} min</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-green-500" size={20} />
              <span className="font-medium">Concluídas</span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {tasks.filter(t => t.completed).length}/{tasks.length}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-purple-500" size={20} />
              <span className="font-medium">Sessões</span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.ceil(totalTime / 25)}
            </p>
          </div>
        </div>

        {/* AI Study Tip */}
        <div className="flex flex-col items-center">
          <Button
            onClick={getTip}
            disabled={loadingTip}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Sparkles size={16} />
            {loadingTip ? 'Gerando...' : 'Dica de Estudo IA'}
          </Button>
          
          {tip && (
            <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-purple-800 dark:text-purple-200" dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
            </div>
          )}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target size={48} className="mx-auto mb-4 opacity-50" />
              <p>Adicione suas primeiras tarefas de estudo</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  task.completed 
                    ? 'bg-muted opacity-60' 
                    : 'bg-card hover:shadow-md'
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded border-2 border-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                      {task.subject}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                  <p className={`text-sm text-muted-foreground ${task.completed ? 'line-through' : ''}`}>
                    {task.topic}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock size={14} />
                    {task.duration}min
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTask(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyPlanner;