import { useState, createContext, useContext, ReactNode } from 'react';
import SettingsModal from './SettingsModal';

interface SettingsContextType {
  openSettings: (tab?: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useGlobalSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useGlobalSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState('profile');

  const openSettings = (tab: string = 'profile') => {
    setDefaultTab(tab);
    setIsOpen(true);
  };

  return (
    <SettingsContext.Provider value={{ openSettings }}>
      {children}
      <SettingsModal 
        open={isOpen} 
        onOpenChange={setIsOpen}
        defaultTab={defaultTab}
      />
    </SettingsContext.Provider>
  );
};