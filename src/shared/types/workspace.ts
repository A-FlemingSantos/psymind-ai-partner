export type ProjectStatus = 'Novo' | 'Ativo' | 'Em Rascunho' | 'Recorrente' | 'Concluído';

export interface Project {
  id: number;
  title: string;
  category: string;
  progress: number; // 0-100
  dueDate: string;
  members: number[];
  status: ProjectStatus;
}
