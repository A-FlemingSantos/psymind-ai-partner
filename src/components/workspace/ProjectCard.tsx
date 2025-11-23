import React from 'react';
import { MoreHorizontal, Clock, ArrowUpRight } from 'lucide-react';
import { Project } from '@/types/workspace';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <div className="h-full group bg-card p-6 rounded-3xl border border-border hover:border-orange-200 dark:hover:border-orange-800 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-500 relative overflow-hidden flex flex-col">
    {/* Elemento decorativo do canto */}
    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 dark:bg-orange-900/20 rounded-bl-full -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-150" />

    <div className="relative z-10 flex flex-col flex-1">
      <div className="flex justify-between items-start mb-6">
        {/* Tag da categoria */}
        <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
          {project.category}
        </span>
        
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
        {project.title}
      </h3>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-auto">
        <span className="flex items-center gap-1.5">
          <Clock size={16} className="text-orange-300" />
          <span className="font-medium">Criado em {project.dueDate}</span>
        </span>
      </div>

      <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members.map((memberId, i) => (
            <div 
              key={i} 
              className={cn(
                "w-8 h-8 rounded-full border-2 border-card flex items-center justify-center text-xs font-bold shadow-sm",
                "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              )}
            >
              {String.fromCharCode(64 + memberId)}
            </div>
          ))}
        </div>
        
        <button className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-400 hover:bg-orange-400 hover:text-white transition-colors shadow-sm">
          <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default ProjectCard;