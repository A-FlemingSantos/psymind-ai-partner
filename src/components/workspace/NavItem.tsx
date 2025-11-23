import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  isCollapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, isCollapsed }) => {
  const content = (
    <button
      onClick={onClick}
      className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-xl transition-all duration-300 group w-full relative ${
        active
          ? 'bg-orange-100 text-zinc-900 shadow-lg shadow-orange-900/20'
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-orange-200'
      }`}
    >
      {/* Icon wrapper to ensure stable sizing */}
      <div className="shrink-0">
        {icon}
      </div>
      
      {!isCollapsed && (
        <span className="font-medium tracking-wide whitespace-nowrap overflow-hidden animate-in fade-in duration-200">
          {label}
        </span>
      )}
      
      {active && (
        <div className={`absolute ${isCollapsed ? 'right-1 w-1.5 h-1.5' : 'ml-auto right-4 w-1.5 h-1.5'} rounded-full bg-orange-500`} />
      )}
    </button>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-zinc-800 text-orange-50 border-zinc-700">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
};

export default NavItem;