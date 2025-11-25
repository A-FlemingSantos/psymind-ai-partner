import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Clock, Lightbulb } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { generatePomodoroTip } from '@/shared/services';
import { usePomodoro } from './PomodoroContext';

const PomodoroTimer: React.FC = () => {
  const { timeLeft, isActive, mode, formatTime, toggleTimer, resetTimer, switchMode } = usePomodoro();
  const [tip, setTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const modes = {
    focus: { duration: 25 * 60, label: 'Foco', color: 'text-red-500' },
    short: { duration: 5 * 60, label: 'Pausa Curta', color: 'text-green-500' },
    long: { duration: 15 * 60, label: 'Pausa Longa', color: 'text-blue-500' }
  };

  const handleSwitchMode = (newMode: 'focus' | 'short' | 'long') => {
    switchMode(newMode);
    setTip('');
  };

  const getTip = async () => {
    setLoadingTip(true);
    try {
      const result = await generatePomodoroTip(mode);
      setTip(result);
    } catch (error) {
      setTip('Erro ao gerar dica');
    } finally {
      setLoadingTip(false);
    }
  };



  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="text-orange-500" size={24} />
          Timer Pomodoro
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className={`text-6xl font-mono font-bold ${modes[mode].color} mb-4`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-lg font-medium text-muted-foreground mb-4">
            {modes[mode].label}
            {mode === 'focus' && sessionCount > 0 && (
              <span className="ml-2 text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full">
                Sessão #{sessionCount + (isActive ? 1 : 0)}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Button
            onClick={toggleTimer}
            size="lg"
            className="flex items-center gap-2"
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            {isActive ? 'Pausar' : 'Iniciar'}
          </Button>
          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
          >
            <RotateCcw size={20} />
          </Button>
        </div>

        <div className="flex justify-center gap-1">
          {Object.entries(modes).map(([key, modeData]) => (
            <Button
              key={key}
              onClick={() => handleSwitchMode(key as 'focus' | 'short' | 'long')}
              variant={mode === key ? 'default' : 'outline'}
              size="sm"
            >
              {modeData.label}
            </Button>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <Button
            onClick={getTip}
            disabled={loadingTip}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <Lightbulb size={16} />
            {loadingTip ? 'Gerando...' : 'Dica para esta sessão'}
          </Button>
          
          {tip && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200" dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;