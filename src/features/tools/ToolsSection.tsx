import React from 'react';
import { 
  FileText, 
  Calculator, 
  Calendar, 
  Image, 
  Music, 
  Video, 
  FileSpreadsheet,
  Code,
  Palette,
  Brain,
  Zap
} from 'lucide-react';
import { cn } from '@/shared/utils';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'productivity' | 'creative' | 'analysis';
  color: string;
  onClick: () => void;
}

const ToolsSection: React.FC = () => {
  const tools: Tool[] = [
    {
      id: 'text-editor',
      name: 'Editor de Texto',
      description: 'Editor avançado com IA integrada',
      icon: <FileText size={24} />,
      category: 'productivity',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      onClick: () => window.open('/editor', '_blank')
    },
    {
      id: 'calculator',
      name: 'Calculadora',
      description: 'Cálculos matemáticos avançados',
      icon: <Calculator size={24} />,
      category: 'productivity',
      color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      onClick: () => console.log('Calculadora')
    },
    {
      id: 'calendar-tool',
      name: 'Calendário',
      description: 'Gerenciamento de tarefas e eventos',
      icon: <Calendar size={24} />,
      category: 'productivity',
      color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
      onClick: () => window.open('/calendar', '_blank')
    },
    {
      id: 'image-viewer',
      name: 'Visualizador de Imagens',
      description: 'Visualize e edite imagens',
      icon: <Image size={24} />,
      category: 'creative',
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      onClick: () => console.log('Visualizador de Imagens')
    },
    {
      id: 'audio-player',
      name: 'Player de Áudio',
      description: 'Reproduza arquivos de áudio',
      icon: <Music size={24} />,
      category: 'creative',
      color: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
      onClick: () => console.log('Player de Áudio')
    },
    {
      id: 'video-player',
      name: 'Player de Vídeo',
      description: 'Reproduza arquivos de vídeo',
      icon: <Video size={24} />,
      category: 'creative',
      color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
      onClick: () => console.log('Player de Vídeo')
    },
    {
      id: 'spreadsheet',
      name: 'Planilhas',
      description: 'Análise de dados e planilhas',
      icon: <FileSpreadsheet size={24} />,
      category: 'analysis',
      color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
      onClick: () => console.log('Planilhas')
    },
    {
      id: 'code-editor',
      name: 'Editor de Código',
      description: 'Editor para desenvolvimento',
      icon: <Code size={24} />,
      category: 'productivity',
      color: 'bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400',
      onClick: () => console.log('Editor de Código')
    },
    {
      id: 'design-tool',
      name: 'Ferramenta de Design',
      description: 'Criação e edição visual',
      icon: <Palette size={24} />,
      category: 'creative',
      color: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
      onClick: () => console.log('Ferramenta de Design')
    }
  ];

  const categories = [
    { id: 'productivity', name: 'Produtividade', icon: <Zap size={20} /> },
    { id: 'creative', name: 'Criativo', icon: <Palette size={20} /> },
    { id: 'analysis', name: 'Análise', icon: <Brain size={20} /> }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-serif font-semibold text-foreground mb-2">Ferramentas</h3>
        <p className="text-muted-foreground">Acesse suas ferramentas favoritas</p>
      </div>

      {categories.map(category => {
        const categoryTools = tools.filter(tool => tool.category === category.id);
        
        return (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground">{category.icon}</div>
              <h4 className="text-lg font-medium text-foreground">{category.name}</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTools.map(tool => (
                <button
                  key={tool.id}
                  onClick={tool.onClick}
                  className="group p-6 bg-card rounded-2xl border border-border hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-200 text-left hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-xl shrink-0", tool.color)}>
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {tool.name}
                      </h5>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToolsSection;