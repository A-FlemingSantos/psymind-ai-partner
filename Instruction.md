# Plano de Reestruturação: De Feature-Based para Layered Architecture

Este documento descreve o plano detalhado para migrar o projeto **Psymind AI Partner** da arquitetura atual (baseada em *features*) para uma estrutura em camadas (Layered Architecture).

## 1. Estrutura Alvo

O objetivo final é alcançar a seguinte organização de diretórios:

```text
psymind-ai-partner/
├── .gitignore
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── LICENSE
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── robots.txt
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── index.ts
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── pages/                 # Antigos containers de features
│   │   ├── Calendar.tsx
│   │   ├── Editor.tsx
│   │   ├── Index.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   ├── Register.tsx
│   │   └── Workspace.tsx
│   ├── components/
│   │   ├── ui/                # Shadcn e componentes básicos
│   │   │   ├── button.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   ├── workspace/         # Componentes específicos do Workspace
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ...
│   │   └── calendar/          # Componentes específicos do Calendar
│   ├── constants/             # Constantes globais
│   │   └── index.ts
│   ├── context/               # Context API (Providers)
│   │   ├── ChatContext.tsx
│   │   └── ...
│   ├── hooks/                 # Hooks personalizados (useChat, useToast)
│   │   └── ...
│   ├── lib/                   # Configurações de bibliotecas e Utils
│   │   ├── gemini.ts
│   │   └── utils.ts
│   ├── services/              # Lógica de negócios e APIs
│   │   └── chatService.ts
│   ├── styles/                # Arquivos CSS globais extras
│   └── types/                 # Definições de tipos TypeScript
└── verification/
    └── verify_workspace.py
```

---

## 2. Guia de Implementação Passo a Passo

### Fase 1: Preparação
1.  **Backup**: Garanta que todas as mudanças atuais estejam salvas no Git.
2.  **Branch**: Crie uma nova branch: `git checkout -b refactor/layered-structure`.
3.  **Skeleton**: Crie as pastas da nova estrutura dentro de `src/`:
    ```bash
    mkdir -p src/{components/ui,components/workspace,components/calendar,components/tools,context,hooks,lib,services,styles,types,pages,constants}
    ```

### Fase 2: Migração de Base (Utils e Shared)
Mova os arquivos que não dependem de componentes React primeiro.

1.  **Tipos (`src/types`)**:
    * Mova `src/shared/types/*` → `src/types/`.
2.  **Constantes (`src/constants`)**:
    * Mova `src/shared/constants/*` → `src/constants/`.
3.  **Lib/Utils (`src/lib`)**:
    * Mova `src/shared/utils/*` → `src/lib/`.
    * *Nota*: Arquivos como `gemini.ts` e `cn` (classnames) ficam aqui.
4.  **Serviços (`src/services`)**:
    * Mova `src/shared/services/*` → `src/services/`.
5.  **Hooks Globais (`src/hooks`)**:
    * Mova `src/shared/hooks/*` → `src/hooks/`.

### Fase 3: Migração de Componentes

1.  **UI Components (`src/components/ui`)**:
    * Mova `src/shared/components/ui/*` → `src/components/ui/`.
    * Mova componentes genéricos (ex: `LoadingSpinner.tsx`) de `src/shared/components/` → `src/components/ui/` ou `src/components/common/`.
2.  **Workspace Components**:
    * Mova de `src/features/workspace/*` (exceto `Workspace.tsx`) → `src/components/workspace/`.
    * Itens: `ChatInterface.tsx`, `Sidebar.tsx`, `ProjectCard.tsx`, `PdfViewer.tsx`, modais, etc.
3.  **Calendar Components**:
    * Mova de `src/features/calendar/*` (exceto `Calendar.tsx` e hooks) → `src/components/calendar/`.
4.  **Tools Components**:
    * Mova as ferramentas de `src/features/tools/*` → `src/components/tools/`.

### Fase 4: Migração de Páginas e Contextos

1.  **Contextos (`src/context`)**:
    * Localize providers dentro das features antigas (ex: `ChatContext.tsx` em `features/chat`, `PomodoroContext.tsx` em `features/tools`).
    * Mova-os para `src/context/`.
2.  **Páginas (`src/pages`)**:
    * Mova `src/features/auth/Login.tsx` → `src/pages/Login.tsx`.
    * Mova `src/features/auth/Register.tsx` → `src/pages/Register.tsx`.
    * Mova `src/features/workspace/Workspace.tsx` → `src/pages/Workspace.tsx`.
    * Mova `src/features/calendar/Calendar.tsx` → `src/pages/Calendar.tsx`.
    * Mova `src/features/editor/Editor.tsx` → `src/pages/Editor.tsx`.

### Fase 5: Atualização de Configurações

1.  **Estilos**:
    * Mova `src/shared/styles/globals.css` → `src/index.css` (sobrescreva ou concatene) ou `src/styles/globals.css`.
    * Atualize a importação no `src/main.tsx`.
2.  **Tailwind Config (`tailwind.config.ts`)**:
    * Atualize a propriedade `content` para incluir os novos caminhos:
        ```ts
        content: [
          "./pages/**/*.{ts,tsx}",
          "./components/**/*.{ts,tsx}",
          "./app/**/*.{ts,tsx}",
          "./src/**/*.{ts,tsx}",
        ],
        ```

### Fase 6: Correção de Importações (Critical Path)

Utilize "Localizar e Substituir" em todo o projeto para corrigir os caminhos. Siga esta tabela de referência:

| Caminho Antigo | Novo Caminho Sugerido | Contexto |
| :--- | :--- | :--- |
| `@/shared/components/ui` | `@/components/ui` | Componentes Shadcn |
| `@/shared/utils` | `@/lib` | Utilitários (cn, gemini) |
| `@/shared/hooks` | `@/hooks` | Hooks globais |
| `@/shared/services` | `@/services` | Serviços de API |
| `@/shared/types` | `@/types` | Tipos TypeScript |
| `@/features/auth` | `@/pages` | Ao importar Login/Register no App.tsx |
| `@/features/chat` | `@/context` ou `@/hooks` | Dependendo se é o Provider ou o Hook |
| `@/features/workspace` | `@/components/workspace` | Para componentes internos |

**Atenção ao `App.tsx`**:
As rotas devem apontar diretamente para as novas páginas:
```tsx
import Index from "./pages/Index";
import { Login } from "./pages/Login"; // Ajuste se for export default ou named
import { Workspace } from "./pages/Workspace";
```

### Fase 7: Limpeza e Verificação

1.  Remova as pastas vazias: `src/features` e `src/shared`.
2.  Execute o linter: `npm run lint` ou `npx tsc --noEmit` para identificar imports quebrados.
3.  Rode a aplicação: `npm run dev`.
4.  Teste as rotas principais: Login, Workspace, Calendar.

## 3. Checklist de Finalização

- [ ] Estrutura de pastas criada.
- [ ] Arquivos movidos para `src/lib`, `src/services`, `src/types`.
- [ ] Componentes UI movidos para `src/components/ui`.
- [ ] Componentes de features movidos para `src/components/{feature}`.
- [ ] Páginas principais movidas para `src/pages`.
- [ ] Contextos movidos para `src/context`.
- [ ] Imports atualizados globalmente.
- [ ] `tailwind.config.ts` atualizado.
- [ ] Projeto compila sem erros (`npm run build`).