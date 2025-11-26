import { Settings, User, Bell, Shield, Palette, Key, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { useSettings } from "./use-settings";
import { useGlobalSettings } from "./GlobalSettingsModal";

interface SettingsDropdownProps {
  trigger?: React.ReactNode;
}

export const SettingsDropdown = ({ trigger }: SettingsDropdownProps) => {
  const { settings } = useSettings();
  const { openSettings } = useGlobalSettings();

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="gap-2">
      <Settings className="w-4 h-4" />
      Configurações
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{settings.name}</p>
            <p className="text-xs text-muted-foreground">{settings.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openSettings('profile')}>
          <User className="w-4 h-4" />
          Perfil
        </DropdownMenuItem>
        
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openSettings('notifications')}>
          <Bell className="w-4 h-4" />
          Notificações
        </DropdownMenuItem>
        
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openSettings('privacy')}>
          <Shield className="w-4 h-4" />
          Privacidade
        </DropdownMenuItem>
        
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openSettings('ai')}>
          <Palette className="w-4 h-4" />
          IA & Tema
        </DropdownMenuItem>
        
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openSettings('advanced')}>
          <Key className="w-4 h-4" />
          Avançado
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openSettings()}>
          <Settings className="w-4 h-4" />
          Todas as Configurações
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};