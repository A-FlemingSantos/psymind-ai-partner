export interface Project {
  id: number;
  title: string;
  category: string;
  progress: number;
  dueDate: string;
  members: number[];
  status: string;
}
