import { useState, useEffect } from 'react';

export interface UserSettings {
  // Perfil
  name: string;
  email: string;
  bio: string;
  
  // Notificações
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  
  // Privacidade
  dataCollection: boolean;
  shareAnalytics: boolean;
  
  // IA
  aiPersonality: 'empático' | 'direto' | 'encorajador' | 'analítico';
  responseLength: 'curto' | 'médio' | 'longo';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  

}

const defaultSettings: UserSettings = {
  name: 'Usuário',
  email: 'usuario@exemplo.com',
  bio: '',
  emailNotifications: true,
  pushNotifications: false,
  weeklyReport: true,
  dataCollection: false,
  shareAnalytics: false,
  aiPersonality: 'empático',
  responseLength: 'médio',
  language: 'pt-BR',

};

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar configurações do localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('psymind-settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsed });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Salvar configurações no localStorage
  const saveSettings = (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    try {
      localStorage.setItem('psymind-settings', JSON.stringify(updatedSettings));
      return true;
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return false;
    }
  };

  // Resetar configurações para o padrão
  const resetSettings = () => {
    setSettings(defaultSettings);
    try {
      localStorage.removeItem('psymind-settings');
      return true;
    } catch (error) {
      console.error('Erro ao resetar configurações:', error);
      return false;
    }
  };

  // Exportar configurações
  const exportSettings = () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `psymind-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Erro ao exportar configurações:', error);
      return false;
    }
  };

  // Importar configurações
  const importSettings = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedSettings = JSON.parse(content);
          
          // Validar se as configurações importadas são válidas
          const validatedSettings = { ...defaultSettings, ...importedSettings };
          setSettings(validatedSettings);
          localStorage.setItem('psymind-settings', JSON.stringify(validatedSettings));
          
          resolve(true);
        } catch (error) {
          console.error('Erro ao importar configurações:', error);
          resolve(false);
        }
      };
      
      reader.onerror = () => {
        console.error('Erro ao ler arquivo');
        resolve(false);
      };
      
      reader.readAsText(file);
    });
  };

  return {
    settings,
    isLoading,
    saveSettings,
    resetSettings,
    exportSettings,
    importSettings,
  };
};