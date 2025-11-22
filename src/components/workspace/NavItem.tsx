import React from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
      active
      ? 'bg-orange-100 text-zinc-900 shadow-lg shadow-orange-900/20'
      : 'text-zinc-400 hover:bg-zinc-800 hover:text-orange-200'
    }`}
  >
    {icon}
    <span className="font-medium tracking-wide">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
  </button>
);

export default NavItem;
