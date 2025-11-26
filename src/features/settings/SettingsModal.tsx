import { useState, useEffect } from "react";
import { User, Bell, Shield, Palette, Key, Download, Trash2, Upload, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Separator } from "@/shared/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useTheme } from "next-themes";
import { toast } from "@/shared/hooks/use-toast";
import { useSettings } from "./use-settings";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: string;
}

const SettingsModal = ({ open, onOpenChange, defaultTab = "profile" }: SettingsModalProps) => {
  const { theme, setTheme } = useTheme();
  const { settings, isLoading, saveSettings, resetSettings, exportSettings, importSettings } = useSettings();
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
    }
  }, [open, defaultTab]);

  const handleExportData = () => {
    const success = exportSettings();
    if (success) {
      toast({
        title: "Configurações exportadas",
        description: "Arquivo de configurações baixado com sucesso.",
      });
    } else {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar as configurações.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.')) {
      toast({
        title: "Solicitação recebida",
        description: "Sua conta será deletada em 30 dias. Você pode cancelar a qualquer momento.",
        variant: "destructive",
      });
    }
  };

  const handleImportSettings = () => {
    fileInputRef?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const success = await importSettings(file);
      if (success) {
        toast({
          title: "Configurações importadas",
          description: "Suas configurações foram importadas com sucesso.",
        });
      } else {
        toast({
          title: "Erro na importação",
          description: "Não foi possível importar as configurações.",
          variant: "destructive",
        });
      }
    }
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  };

  const handleResetSettings = () => {
    if (confirm('Tem certeza que deseja resetar todas as configurações para o padrão?')) {
      const success = resetSettings();
      if (success) {
        toast({
          title: "Configurações resetadas",
          description: "Todas as configurações foram restauradas para o padrão.",
        });
      } else {
        toast({
          title: "Erro ao resetar",
          description: "Não foi possível resetar as configurações.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando configurações...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[95vw] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Configurações</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto pr-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1">
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="privacy" className="gap-2">
                <Shield className="w-4 h-4" />
                Privacidade
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <Palette className="w-4 h-4" />
                IA & Tema
              </TabsTrigger>
              <TabsTrigger value="advanced" className="gap-2">
                <Key className="w-4 h-4" />
                Avançado
              </TabsTrigger>
            </TabsList>

            {/* Perfil */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Atualize suas informações básicas de perfil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={settings.name}
                        onChange={(e) => saveSettings({name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => saveSettings({email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Conte um pouco sobre você..."
                      value={settings.bio}
                      onChange={(e) => saveSettings({bio: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notificações */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificação</CardTitle>
                  <CardDescription>
                    Configure como e quando você quer receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba atualizações importantes por email
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => 
                        saveSettings({emailNotifications: checked})
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações Push</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações no navegador
                      </p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => 
                        saveSettings({pushNotifications: checked})
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Relatório Semanal</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba um resumo das suas conversas semanalmente
                      </p>
                    </div>
                    <Switch
                      checked={settings.weeklyReport}
                      onCheckedChange={(checked) => 
                        saveSettings({weeklyReport: checked})
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacidade */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Privacidade</CardTitle>
                  <CardDescription>
                    Controle como seus dados são coletados e utilizados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Coleta de Dados Analíticos</Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir coleta de dados para melhorar o serviço
                      </p>
                    </div>
                    <Switch
                      checked={settings.dataCollection}
                      onCheckedChange={(checked) => 
                        saveSettings({dataCollection: checked})
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compartilhar Análises</Label>
                      <p className="text-sm text-muted-foreground">
                        Compartilhar dados anonimizados para pesquisa
                      </p>
                    </div>
                    <Switch
                      checked={settings.shareAnalytics}
                      onCheckedChange={(checked) => 
                        saveSettings({shareAnalytics: checked})
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Dados</CardTitle>
                  <CardDescription>
                    Exporte ou delete seus dados pessoais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Exportar Dados</h4>
                      <p className="text-sm text-muted-foreground">
                        Baixe uma cópia de todos os seus dados
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleExportData} className="gap-2">
                      <Download className="w-4 h-4" />
                      Exportar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div>
                      <h4 className="font-medium text-destructive">Deletar Conta</h4>
                      <p className="text-sm text-muted-foreground">
                        Remover permanentemente sua conta e dados
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleDeleteAccount} className="gap-2">
                      <Trash2 className="w-4 h-4" />
                      Deletar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* IA & Tema */}
            <TabsContent value="ai" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da IA</CardTitle>
                  <CardDescription>
                    Personalize como a IA interage com você
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="personality">Personalidade da IA</Label>
                      <Select
                        value={settings.aiPersonality}
                        onValueChange={(value) => 
                          saveSettings({aiPersonality: value as any})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="empático">Empático</SelectItem>
                          <SelectItem value="direto">Direto</SelectItem>
                          <SelectItem value="encorajador">Encorajador</SelectItem>
                          <SelectItem value="analítico">Analítico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responseLength">Tamanho das Respostas</Label>
                      <Select
                        value={settings.responseLength}
                        onValueChange={(value) => 
                          saveSettings({responseLength: value as any})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="curto">Curto</SelectItem>
                          <SelectItem value="médio">Médio</SelectItem>
                          <SelectItem value="longo">Longo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => 
                        saveSettings({language: value as any})
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Aparência</CardTitle>
                  <CardDescription>
                    Personalize a aparência da interface
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Avançado */}
            <TabsContent value="advanced" className="space-y-6">


              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Configurações</CardTitle>
                  <CardDescription>
                    Importe, exporte ou resete suas configurações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" onClick={handleImportSettings} className="gap-2">
                      <Upload className="w-4 h-4" />
                      Importar
                    </Button>
                    <Button variant="outline" onClick={handleExportData} className="gap-2">
                      <Download className="w-4 h-4" />
                      Exportar
                    </Button>
                    <Button variant="outline" onClick={handleResetSettings} className="gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Resetar
                    </Button>
                  </div>
                  <input
                    type="file"
                    ref={setFileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informações do Sistema</CardTitle>
                  <CardDescription>
                    Detalhes técnicos da aplicação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Versão:</strong> 1.0.0</p>
                      <p><strong>Ambiente:</strong> {import.meta.env.MODE}</p>
                      <p><strong>Build:</strong> {new Date().toLocaleDateString()}</p>

                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Informação sobre salvamento automático */}
          <div className="text-center pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              ✨ Suas configurações são salvas automaticamente
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;