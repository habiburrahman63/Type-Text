import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Keyboard,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  User,
  Shield,
  Menu,
  X,
  Sparkles,
  LogOut
} from 'lucide-react';

export type ActiveView = 'landing' | 'dashboard' | 'curriculum' | 'test' | 'games' | 'literacy' | 'teacher' | 'admin';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, setActiveView, onOpenAuth }) => {
  const { user, theme, toggleTheme, soundEnabled, toggleSound, isAuthenticated, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: ActiveView; label: string }[] = [
    { id: 'landing', label: 'Home' },
    { id: 'curriculum', label: 'Lessons' },
    { id: 'test', label: 'Tests' },
    { id: 'games', label: 'Games' },
    { id: 'literacy', label: 'Digital Skills' },
    { id: 'dashboard', label: 'Dashboard' },
  ];

  if (user.role === 'teacher' || user.role === 'school_admin' || user.role === 'super_admin') {
    navLinks.push({ id: 'teacher', label: 'Classroom' });
  }

  if (user.role === 'school_admin' || user.role === 'super_admin') {
    navLinks.push({ id: 'admin', label: 'Admin' });
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand title, one line */}
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 text-slate-900 dark:text-white font-extrabold text-xl tracking-tight whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Keyboard className="w-4 h-4" />
          </div>
          <span>Typenex</span>
        </button>

        {/* Zone 2: 4-5 concise single-line text links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold tracking-tight text-slate-600 dark:text-slate-300">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => setActiveView(link.id)}
              className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
                activeView === link.id
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
            aria-label="Toggle audio effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Authentication CTA / Account Button */}
          {!isAuthenticated ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide rounded-xl shadow-xs transition-all shrink-0"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50 dark:bg-slate-900 transition-all text-xs font-semibold"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-5 h-5 rounded-md object-cover"
                />
                <span className="hidden sm:inline-block max-w-[100px] truncate text-slate-800 dark:text-slate-200 tracking-tight">
                  {user.name.split(' ')[0]}
                </span>
              </button>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-2">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                setActiveView(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold tracking-tight ${
                activeView === link.id
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
