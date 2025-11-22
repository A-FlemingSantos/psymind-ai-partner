import React from 'react';
import { MoreHorizontal, Clock, ArrowUpRight } from 'lucide-react';
import { Project } from '@/types/workspace';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <div className="h-full group bg-white p-6 rounded-3xl border border-orange-100/50 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-500 relative overflow-hidden flex flex-col">
    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-150" />

    <div className="relative z-10 flex flex-col flex-1">
      <div className="flex justify-between items-start mb-6">
        <span className="px-3 py-1 bg-zinc-900 text-orange-50 text-xs font-medium rounded-full">
          {project.category}
        </span>
        <button className="text-zinc-400 hover:text-zinc-900">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-orange-600 transition-colors">
        {project.title}
      </h3>

      <div className="flex items-center gap-4 text-sm text-zinc-500 mb-auto">
        <span className="flex items-center gap-1.5">
          <Clock size={16} className="text-orange-300" />
          <span className="font-medium">Created {project.dueDate}</span>
        </span>
      </div>

      <div className="mt-8 pt-4 border-t border-orange-50/50 flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members.map((memberId, i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
              {String.fromCharCode(64 + memberId)}
            </div>
          ))}
        </div>
        <button className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-400 hover:bg-orange-400 hover:text-white transition-colors shadow-sm">
          <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default ProjectCard;
