import React from 'react';
import { Keyboard, Heart, ShieldCheck, Globe } from 'lucide-react';
import { ActiveView } from './Navbar';

interface FooterProps {
  onNavigate: (view: ActiveView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand Lockup */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-base tracking-tight">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Keyboard className="w-3.5 h-3.5" />
            </div>
            <span>Typenex Academy</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-center md:text-left max-w-sm text-xs leading-relaxed">
            Empowering students, educators, and professionals with elite touch typing mastery and digital literacy.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold tracking-tight text-slate-600 dark:text-slate-300">
          <button onClick={() => onNavigate('curriculum')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Curriculum
          </button>
          <button onClick={() => onNavigate('test')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Speed Tests
          </button>
          <button onClick={() => onNavigate('games')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Arcade Games
          </button>
          <button onClick={() => onNavigate('literacy')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Digital Skills
          </button>
          <button onClick={() => onNavigate('teacher')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Teacher Tools
          </button>
        </div>

        {/* Copyright & Compliance */}
        <div className="text-center md:text-right text-slate-500 dark:text-slate-400 text-xs">
          <div>© {new Date().getFullYear()} Typenex International Education Inc.</div>
          <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
            All rights reserved · FERPA &amp; COPPA compliant educational environment
          </div>
        </div>
      </div>
    </footer>
  );
};
