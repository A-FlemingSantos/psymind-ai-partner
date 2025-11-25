# Estrutura Modular do PsyMind

## Organização por Features

### 📁 `/features`
Cada feature é um módulo independente com sua própria lógica de negócio.

#### 🔐 `/auth`
- `Login.tsx` - Página de login
- `Register.tsx` - Página de registro
- `index.ts` - Exportações da feature

#### 💬 `/chat`
- `ChatContext.tsx` - Contexto e provider do chat
- `index.ts` - Exportações da feature

#### 📅 `/calendar`
- `Calendar.tsx` - Componente do calendário
- `index.ts` - Exportações da feature

#### ✏️ `/editor`
- `Editor.tsx` - Componente do editor
- `index.ts` - Exportações da feature

#### ⚙️ `/settings`
- `SettingsModal.tsx` - Modal de configurações
- `GlobalSettingsModal.tsx` - Provider global
- `settings-dropdown.tsx` - Dropdown de configurações
- `use-settings.ts` - Hook de configurações
- `index.ts` - Exportações da feature

#### 🏢 `/workspace`
- `Workspace.tsx` - Página principal do workspace
- `Sidebar.tsx` - Barra lateral
- `ChatInterface.tsx` - Interface de chat
- `ProjectCard.tsx` - Card de projeto
- `NavItem.tsx` - Item de navegação
- `AddProjectModal.tsx` - Modal de adicionar projeto
- `AddTaskModal.tsx` - Modal de adicionar tarefa
- `PdfViewer.tsx` - Visualizador de PDF
- `FlowerDoodle.tsx` - Componente decorativo
- `index.ts` - Exportações da feature

### 📁 `/shared`
Recursos compartilhados entre features.

#### 🧩 `/components`
- `/ui` - Componentes de UI do shadcn/ui
- `NavLink.tsx` - Componente de link de navegação
- `index.ts` - Exportações dos componentes

#### 🎣 `/hooks`
- `use-mobile.tsx` - Hook para detectar mobile
- `use-toast.ts` - Hook para toasts
- `index.ts` - Exportações dos hooks

#### 🛠️ `/utils`
- `utils.ts` - Utilitários gerais (cn, etc.)
- `gemini.ts` - Utilitários do Gemini AI
- `gemini-editor.ts` - Utilitários do editor Gemini
- `index.ts` - Exportações dos utilitários

#### 📝 `/types`
- `workspace.ts` - Tipos do workspace
- `pdfjs-dist.d.ts` - Tipos do PDF.js
- `index.ts` - Exportações dos tipos

#### 📋 `/constants`
- `paths.ts` - Constantes de rotas e endpoints
- `index.ts` - Exportações das constantes

### 📁 `/pages`
Páginas que não pertencem a uma feature específica.
- `Index.tsx` - Página inicial/landing
- `NotFound.tsx` - Página 404

## Padrões de Importação

### Importações Internas (dentro da mesma feature)
```typescript
import Component from './Component';
```

### Importações de Outras Features
```typescript
import { useChat } from '@/features/chat';
import { SettingsProvider } from '@/features/settings';
```

### Importações Compartilhadas
```typescript
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import { ROUTES } from '@/shared/constants';
```

## Vantagens da Estrutura Modular

### 🎯 **Separação de Responsabilidades**
- Cada feature é independente
- Lógica de negócio isolada
- Fácil manutenção

### 🔄 **Reutilização**
- Componentes compartilhados centralizados
- Hooks reutilizáveis
- Utilitários comuns

### 📈 **Escalabilidade**
- Fácil adicionar novas features
- Estrutura consistente
- Código organizado

### 🧪 **Testabilidade**
- Testes isolados por feature
- Mocks mais simples
- Cobertura focada

### 👥 **Colaboração**
- Diferentes devs podem trabalhar em features diferentes
- Menos conflitos de merge
- Responsabilidades claras

## Como Adicionar uma Nova Feature

1. **Criar diretório**: `src/features/nova-feature/`
2. **Adicionar componentes**: Criar arquivos `.tsx`
3. **Criar index.ts**: Exportar componentes públicos
4. **Atualizar src/index.ts**: Adicionar export da nova feature
5. **Documentar**: Atualizar este README

## Exemplo de Nova Feature

```typescript
// src/features/notifications/index.ts
export { default as NotificationCenter } from './NotificationCenter';
export { useNotifications } from './useNotifications';
export { NotificationProvider } from './NotificationProvider';

// src/features/notifications/NotificationCenter.tsx
import { useNotifications } from './useNotifications';
import { Button } from '@/shared/components/ui/button';

export default function NotificationCenter() {
  const { notifications } = useNotifications();
  
  return (
    <div>
      {notifications.map(notification => (
        <div key={notification.id}>
          {notification.message}
        </div>
      ))}
    </div>
  );
}
```