import React from 'react';

const FlowerDoodle: React.FC = () => (
  <svg width="140" height="140" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-800 opacity-90 animate-in fade-in duration-1000">
    <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Stem */}
      <path d="M100 190 C100 190 105 160 100 120" className="text-orange-900" />
      {/* Leaves */}
      <path d="M100 150 C100 150 130 145 140 130" />
      <path d="M100 160 C100 160 70 155 60 140" />

      {/* Petals - Hand drawn uneven style */}
      <path d="M100 120 C80 90 60 100 60 120 C60 140 80 140 100 120" />
      <path d="M100 120 C90 90 110 70 130 90 C140 100 120 120 100 120" />
      <path d="M100 120 C130 110 150 130 140 150 C130 160 100 120 100 120" />
      <path d="M100 120 C100 150 70 150 70 130 C70 120 100 120 100 120" />
      <path d="M100 120 C80 110 75 90 95 80 C105 75 100 120 100 120" />

      {/* Center */}
      <circle cx="100" cy="120" r="6" fill="currentColor" className="text-orange-400 stroke-none" />
    </g>
  </svg>
);

export default FlowerDoodle;
