import React, { useState } from 'react';
import { 
  FileText, 
  Calculator, 
  Brain,
  Zap,
  Heart,
  Clock,
  Quote,
  X,
  Languages,
  HelpCircle,
  CheckCircle,
  Medal,
  Smile,
  Trophy,
  GraduationCap
} from 'lucide-react';
import { usePomodoro } from './PomodoroContext';
import { cn } from '@/shared/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import MoodTracker from './MoodTracker';
import PomodoroTimer from './PomodoroTimer';
import ReflectionGenerator from './ReflectionGenerator';
import StudyPlanner from './StudyPlanner';
import NoteTaker from './NoteTaker';
import FlashcardMaker from './FlashcardMaker';
import CalculatorTool from './Calculator';
import KindnessTracker from './KindnessTracker';
import ExamPrep from './ExamPrep';
import AITranslator from './AITranslator';
import QuestionGenerator from './QuestionGenerator';
import TextCorrector from './TextCorrector';
import TextSummarizer from './TextSummarizer';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'productivity' | 'analysis' | 'wellbeing';
  color: string;
  onClick: () => void;
}

const ToolsSection: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const { formatTime, timeLeft, isActive } = usePomodoro();

  const tools: Tool[] = [
        {
          id: 'ai-translator',
          name: 'Tradutor IA',
          description: 'Traduza textos com inteligência artificial',
          icon: <Languages size={24} />,
          category: 'analysis',
          color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
          onClick: () => setSelectedTool('ai-translator')
        },
        {
          id: 'question-generator',
          name: 'Gerador de Questões',
          description: 'Crie questões para estudo a partir de textos',
          icon: <HelpCircle size={24} />,
          category: 'analysis',
          color: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
          onClick: () => setSelectedTool('question-generator')
        },
        {
          id: 'text-corrector',
          name: 'Corretor de Texto',
          description: 'Corrija gramática, ortografia e estilo de textos',
          icon: <CheckCircle size={24} />,
          category: 'analysis',
          color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
          onClick: () => setSelectedTool('text-corrector')
        },
        {
          id: 'text-summarizer',
          name: 'Resumidor de Texto',
          description: 'Resuma textos automaticamente com IA',
          icon: <FileText size={24} />,
          category: 'analysis',
          color: 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400',
          onClick: () => setSelectedTool('text-summarizer')
        },
    {
      id: 'calculator',
      name: 'Calculadora',
      description: 'Cálculos matemáticos avançados',
      icon: <Calculator size={24} />,
      category: 'productivity',
      color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      onClick: () => setSelectedTool('calculator')
    },
    {
      id: 'study-planner',
      name: 'Planejador de Estudos',
      description: 'Organize suas tarefas e sessões de estudo',
      icon: <Brain size={24} />,
      category: 'productivity',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      onClick: () => setSelectedTool('study-planner')
    },
    {
      id: 'note-taker',
      name: 'Bloco de Notas',
      description: 'Crie e gerencie suas anotações de estudo',
      icon: <FileText size={24} />,
      category: 'productivity',
      color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      onClick: () => setSelectedTool('note-taker')
    },
    {
      id: 'flashcard-maker',
      name: 'Criador de Flashcards',
      description: 'Crie flashcards para memorização eficiente',
      icon: <Brain size={24} />,
      category: 'analysis',
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      onClick: () => setSelectedTool('flashcard-maker')
    },
    {
      id: 'mood-tracker',
      name: 'Rastreador de Humor',
      description: 'Monitore e analise seu estado emocional',
      icon: <Smile size={24} />,
      category: 'wellbeing',
      color: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
      onClick: () => setSelectedTool('mood-tracker')
    },
    {
      id: 'pomodoro-timer',
      name: 'Timer Pomodoro',
      description: `Técnica de produtividade com dicas de IA - ${formatTime(timeLeft)}`,
      icon: <Clock size={24} className={isActive ? 'animate-pulse' : ''} />,
      category: 'wellbeing',
      color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
      onClick: () => setSelectedTool('pomodoro-timer')
    },
    {
      id: 'reflection-generator',
      name: 'Gerador de Reflexões',
      description: 'Frases inspiradoras e análises motivacionais',
      icon: <Quote size={24} />,
      category: 'wellbeing',
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      onClick: () => setSelectedTool('reflection-generator')
    },
    {
      id: 'kindness-tracker',
      name: 'Atos de Bondade',
      description: 'Pratique gentileza e melhore seu bem-estar',
      icon: <Heart size={24} />,
      category: 'wellbeing',
      color: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
      onClick: () => setSelectedTool('kindness-tracker')
    },
    {
      id: 'exam-prep',
      name: 'Preparatório Vestibulares',
      description: 'Estude para ENEM, FUVEST e outros vestibulares',
      icon: <GraduationCap size={24} />, 
      category: 'analysis',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      onClick: () => setSelectedTool('exam-prep')
    }
  ];

  const categories = [
    { id: 'productivity', name: 'Produtividade', icon: <Zap size={20} /> },
    { id: 'analysis', name: 'Análise', icon: <Brain size={20} /> },
    { id: 'wellbeing', name: 'Bem-estar', icon: <Heart size={20} /> }
  ];

  const renderToolContent = () => {
    switch (selectedTool) {
      case 'mood-tracker':
        return <MoodTracker />;
      case 'pomodoro-timer':
        return <PomodoroTimer />;
      case 'reflection-generator':
        return <ReflectionGenerator />;
      case 'study-planner':
        return <StudyPlanner />;
      case 'note-taker':
        return <NoteTaker />;
      case 'flashcard-maker':
        return <FlashcardMaker />;
      case 'calculator':
        return <CalculatorTool />;
      case 'kindness-tracker':
        return <KindnessTracker />;
      case 'exam-prep':
        return <ExamPrep />;
      case 'ai-translator':
        return <AITranslator />;
      case 'question-generator':
        return <QuestionGenerator />;
      case 'text-corrector':
        return <TextCorrector />;
      case 'text-summarizer':
        return <TextSummarizer />;
      default:
        return null;
    }
  };

  const getToolTitle = () => {
    const tool = tools.find(t => t.id === selectedTool);
    return tool?.name || '';
  };

  return (
    <>
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
              {categoryTools.map((tool, index) => (
                <button
                  key={tool.id}
                  onClick={tool.onClick}
                  className="group p-6 bg-card rounded-2xl border border-border hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-300 text-left hover:shadow-lg hover:-translate-y-1 hover-lift stagger-item animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110", tool.color)}>
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

    {/* Modal para ferramentas */}
    <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col items-center animate-fade-in">
        <DialogHeader className="w-full">
          <DialogTitle className="flex items-center justify-between">
            <span className="animate-fade-in">{getToolTitle()}</span>
            <button
              onClick={() => setSelectedTool(null)}
              className="p-1 hover:bg-muted rounded-full transition-colors hover-lift"
            >
              <X size={20} />
            </button>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 flex justify-center w-full animate-fade-in">
          {renderToolContent()}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default ToolsSection;