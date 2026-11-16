import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CURRICULUM_LESSONS, Lesson } from '../data/curriculum';
import {
  ShieldAlert,
  Users,
  Building,
  BookOpen,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  Sliders,
  Sparkles,
  Award
} from 'lucide-react';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'school_admin' | 'super_admin';
  school: string;
  wpm: number;
  status: 'active' | 'suspended';
  createdDate: string;
}

const INITIAL_USERS: MockUser[] = [
  { id: 'u1', name: 'Jordan Lee', email: 'jordan.lee@school.edu', role: 'student', school: 'Horizon STEM Academy', wpm: 52, status: 'active', createdDate: 'Oct 12, 2026' },
  { id: 'u2', name: 'Sarah Chen, M.Ed.', email: 's.chen@horizonstem.edu', role: 'teacher', school: 'Horizon STEM Academy', wpm: 78, status: 'active', createdDate: 'Sep 01, 2026' },
  { id: 'u3', name: 'Dr. Marcus Vance', email: 'm.vance@horizonstem.edu', role: 'school_admin', school: 'Horizon STEM Academy', wpm: 82, status: 'active', createdDate: 'Aug 15, 2026' },
  { id: 'u4', name: 'Emma Watson', email: 'e.watson@school.edu', role: 'student', school: 'Horizon STEM Academy', wpm: 58, status: 'active', createdDate: 'Oct 14, 2026' },
  { id: 'u5', name: 'Liam Johnson', email: 'l.johnson@school.edu', role: 'student', school: 'Horizon STEM Academy', wpm: 41, status: 'active', createdDate: 'Oct 15, 2026' },
  { id: 'u6', name: 'David Miller', email: 'd.miller@citytech.edu', role: 'teacher', school: 'City Technical High', wpm: 68, status: 'active', createdDate: 'Sep 10, 2026' }
];

export const AdminDashboard: React.FC = () => {
  const { customLessons, addCustomLesson, registeredUsers } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'schools' | 'lesson_builder' | 'settings'>('users');
  const [userStatuses, setUserStatuses] = useState<Record<string, 'active' | 'suspended'>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Custom Lesson Form State
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [lessonUnit, setLessonUnit] = useState<string>('Custom Department Practice');
  const [lessonDesc, setLessonDesc] = useState<string>('');
  const [lessonText, setLessonText] = useState<string>('');
  const [lessonTargetWpm, setLessonTargetWpm] = useState<number>(45);
  const [lessonMinAccuracy, setLessonMinAccuracy] = useState<number>(90);
  const [lessonSuccessMsg, setLessonSuccessMsg] = useState<string>('');

  const combinedUsers: MockUser[] = [
    ...registeredUsers.map(ru => ({
      id: ru.id,
      name: ru.name,
      email: ru.email,
      role: ru.role,
      school: ru.schoolName,
      wpm: ru.targetWpm,
      status: (userStatuses[ru.id] || 'active') as 'active' | 'suspended',
      createdDate: new Date(ru.lastActiveDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    })),
    ...INITIAL_USERS.filter(iu => !registeredUsers.some(ru => ru.email.toLowerCase() === iu.email.toLowerCase())).map(iu => ({
      ...iu,
      status: (userStatuses[iu.id] || iu.status) as 'active' | 'suspended'
    }))
  ];

  const handleToggleUserStatus = (id: string) => {
    setUserStatuses(prev => ({
      ...prev,
      [id]: prev[id] === 'suspended' ? 'active' : 'suspended'
    }));
  };

  const handleCreateCustomLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !lessonText.trim()) return;

    addCustomLesson({
      title: lessonTitle,
      unit: lessonUnit,
      description: lessonDesc || 'Custom instructor-crafted typing practice exercise.',
      text: lessonText,
      targetWpm: lessonTargetWpm,
      minAccuracy: lessonMinAccuracy,
      keysIntroduced: ['custom vocabulary'],
      instructions: 'Maintain a steady typing rhythm. Read each word carefully.'
    });

    setLessonSuccessMsg(`Successfully published custom lesson: "${lessonTitle}"`);
    setLessonTitle('');
    setLessonDesc('');
    setLessonText('');
    setTimeout(() => setLessonSuccessMsg(''), 4000);
  };

  const filteredUsers = combinedUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.school.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            Administration &amp; Governance Console
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight leading-tight">
            System Administration &amp; Lesson Builder
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1.5 max-w-xl leading-relaxed">
            Manage institutional tenants, user permissions, audit security policies, and author custom curriculum lessons.
          </p>
        </div>

        {/* Global Platform KPIs */}
        <div className="flex items-center gap-6 bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Users</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">1,480</span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Schools</span>
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums tracking-tight">38</span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Lessons Passed</span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums tracking-tight">42.8k</span>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-bold tracking-tight rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          User Management
        </button>

        <button
          onClick={() => setActiveTab('lesson_builder')}
          className={`px-4 py-2 text-xs font-bold tracking-tight rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'lesson_builder'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Custom Lesson Builder ({customLessons.length})
        </button>

        <button
          onClick={() => setActiveTab('schools')}
          className={`px-4 py-2 text-xs font-bold tracking-tight rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'schools'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          Institutional Tenants
        </button>
      </div>

      {/* Tab: User Management */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user name, email, or institution..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Filter Role:</span>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
                <option value="school_admin">School Admins</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Institution</th>
                  <th className="pb-3">Typing Speed</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="text-slate-700 dark:text-slate-300">
                    <td className="py-3">
                      <div className="font-semibold text-slate-900 dark:text-white tracking-tight">{u.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{u.email}</div>
                    </td>
                    <td className="py-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-slate-500 dark:text-slate-400">
                      {u.school}
                    </td>
                    <td className="py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums tracking-tight">
                      {u.wpm} WPM
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold tracking-tight ${u.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                        {u.status === 'active' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`px-3 py-1 text-xs font-bold tracking-tight rounded-lg transition-all ${
                          u.status === 'active'
                            ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                            : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Custom Lesson Builder */}
      {activeTab === 'lesson_builder' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Author Custom Typing Exercise
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Create domain-specific typing exercises for your classes (coding snippets, medical jargon, literature, or foreign language practice).
            </p>

            {lessonSuccessMsg && (
              <div className="p-4 mb-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                {lessonSuccessMsg}
              </div>
            )}

            <form onSubmit={handleCreateCustomLesson} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                  Lesson Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Legal Terminology &amp; Courtroom Transcripts"
                  value={lessonTitle}
                  onChange={e => setLessonTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                    Curriculum Unit / Tag
                  </label>
                  <input
                    type="text"
                    value={lessonUnit}
                    onChange={e => setLessonUnit(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                    Target Speed (WPM)
                  </label>
                  <input
                    type="number"
                    value={lessonTargetWpm}
                    onChange={e => setLessonTargetWpm(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                  Target Practice Text (What students will type)
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Type or paste the exact target paragraph here..."
                  value={lessonText}
                  onChange={e => setLessonText(e.target.value)}
                  className="w-full text-xs sm:text-sm font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
                <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                  <span>Characters: {lessonText.length}</span>
                  <span>Estimated words: {Math.round(lessonText.length / 5)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all text-xs tracking-wide cursor-pointer"
              >
                Publish Custom Lesson
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Live Published Custom Exercises ({customLessons.length})
              </h4>
              {customLessons.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                  No custom lessons authored yet. Once published, custom lessons appear in the global curriculum and can be assigned to students.
                </p>
              ) : (
                <div className="space-y-3">
                  {customLessons.map(l => (
                    <div key={l.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs">
                      <div className="font-bold text-slate-900 dark:text-white tracking-tight">{l.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 font-mono">{l.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Institutions */}
      {activeTab === 'schools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Horizon STEM Academy (Primary Campus)
            </h4>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>Enrolled Students</span>
                <strong className="text-slate-900 dark:text-white font-mono tabular-nums">1,120</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>Active Teachers</span>
                <strong className="text-slate-900 dark:text-white font-mono tabular-nums">24</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>Campus Average WPM</span>
                <strong className="text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">48.2 WPM</strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span>License Plan</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">Enterprise District Unlimited</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              City Technical High School
            </h4>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>Enrolled Students</span>
                <strong className="text-slate-900 dark:text-white font-mono tabular-nums">680</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>Active Teachers</span>
                <strong className="text-slate-900 dark:text-white font-mono tabular-nums">14</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>Campus Average WPM</span>
                <strong className="text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">51.4 WPM</strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span>License Plan</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">Enterprise High School</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
