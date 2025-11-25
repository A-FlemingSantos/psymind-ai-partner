import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Lightbulb } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { generatePomodoroTip } from '@/shared/services';

const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos em segundos
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [tip, setTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState(false);

  const modes = {
    focus: { duration: 25 * 60, label: 'Foco', color: 'text-red-500' },
    short: { duration: 5 * 60, label: 'Pausa Curta', color: 'text-green-500' },
    long: { duration: 15 * 60, label: 'Pausa Longa', color: 'text-blue-500' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Aqui poderia tocar um som ou mostrar notificação
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].duration);
  };

  const switchMode = (newMode: 'focus' | 'short' | 'long') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(modes[newMode].duration);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
              onClick={() => switchMode(key as 'focus' | 'short' | 'long')}
              variant={mode === key ? 'default' : 'outline'}
              size="sm"
            >
              {modeData.label}
            </Button>
          ))}
        </div>

        <div className="text-center">
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
              <p className="text-sm text-yellow-800 dark:text-yellow-200">{tip}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;