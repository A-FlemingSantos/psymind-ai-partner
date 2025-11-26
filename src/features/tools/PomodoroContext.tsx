import React, { createContext, useContext, useState, useEffect } from 'react';

interface PomodoroContextType {
  timeLeft: number;
  isActive: boolean;
  mode: 'focus' | 'short' | 'long';
  formatTime: (seconds: number) => string;
  toggleTimer: () => void;
  resetTimer: () => void;
  switchMode: (newMode: 'focus' | 'short' | 'long') => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

const modes = {
  focus: { duration: 25 * 60, label: 'Foco' },
  short: { duration: 5 * 60, label: 'Pausa Curta' },
  long: { duration: 15 * 60, label: 'Pausa Longa' }
};

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
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
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <PomodoroContext.Provider value={{
      timeLeft,
      isActive,
      mode,
      formatTime,
      toggleTimer,
      resetTimer,
      switchMode
    }}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
};