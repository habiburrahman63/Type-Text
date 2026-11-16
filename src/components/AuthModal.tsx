import React, { useState } from 'react';
import { useApp, UserRole, DEFAULT_USERS } from '../context/AppContext';
import { X, Lock, Mail, User, School, Sparkles, CheckCircle2, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginUser, registerUser, registeredUsers, switchUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [emailOrName, setEmailOrName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [school, setSchool] = useState<string>('Horizon STEM Academy');
  const [role, setRole] = useState<UserRole>('student');
  const [targetWpm, setTargetWpm] = useState<number>(50);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (mode === 'login') {
      const res = loginUser(emailOrName, password);
      if (res.success) {
        setMessage({ text: res.message || 'Successfully signed in!', type: 'success' });
        setTimeout(() => {
          setMessage(null);
          onClose();
        }, 800);
      } else {
        setMessage({ text: res.message || 'Failed to sign in', type: 'error' });
      }
    } else {
      const res = registerUser({
        name,
        email,
        password,
        schoolName: school,
        role,
        targetWpm
      });
      if (res.success) {
        setMessage({ text: res.message || 'Account successfully created!', type: 'success' });
        setTimeout(() => {
          setMessage(null);
          onClose();
        }, 800);
      } else {
        setMessage({ text: res.message || 'Failed to create account', type: 'error' });
      }
    }
  };

  const handleQuickDemoLogin = (userId: string) => {
    switchUser(userId);
    const target = registeredUsers.find(u => u.id === userId);
    setMessage({ text: `Switched to demo account: ${target?.name || 'User'}`, type: 'success' });
    setTimeout(() => {
      setMessage(null);
      onClose();
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sign In or Register"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mode Selector */}
        <div className="flex gap-4 mb-5 border-b border-slate-100 dark:border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setMessage(null);
            }}
            className={`text-sm tracking-tight pb-2 transition-colors ${
              mode === 'login'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 font-bold'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-semibold'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setMessage(null);
            }}
            className={`text-sm tracking-tight pb-2 transition-colors ${
              mode === 'register'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 font-bold'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-semibold'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Notification Alert */}
        {message && (
          <div
            className={`p-3 mb-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' ? (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Lee"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@school.edu or user@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                  Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-3 text-xs rounded-xl font-bold border transition-all ${
                      role === 'student'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Student / Learner
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-2 px-3 text-xs rounded-xl font-bold border transition-all ${
                      role === 'teacher'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Teacher / Educator
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                  School / Organization
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Horizon STEM Academy"
                    value={school}
                    onChange={e => setSchool(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                  Target Speed (WPM)
                </label>
                <input
                  type="number"
                  min={20}
                  max={150}
                  value={targetWpm}
                  onChange={e => setTargetWpm(Number(e.target.value) || 50)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-tight rounded-xl shadow-md transition-all mt-2 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Create Personalized Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                  Email Address or Name
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. student@school.edu or your name"
                    value={emailOrName}
                    onChange={e => setEmailOrName(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-tight rounded-xl shadow-md transition-all mt-2 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Sign In to Typenex</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Quick Demo Switcher */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                  Or Test Instantly with Demo Accounts:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('usr_student_01')}
                    className="p-2 text-left rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/60 transition-all text-xs"
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">Jordan Lee</span>
                    <span className="text-[10px] text-indigo-500 font-semibold">Student (Demo)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('usr_teacher_01')}
                    className="p-2 text-left rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/60 transition-all text-xs"
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">Sarah Chen</span>
                    <span className="text-[10px] text-indigo-500 font-semibold">Teacher (Demo)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('usr_admin_01')}
                    className="p-2 text-left rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/60 transition-all text-xs"
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">Dr. Vance</span>
                    <span className="text-[10px] text-indigo-500 font-semibold">Admin (Demo)</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
