import React, { useState } from 'react';
import { useApp, Classroom } from '../context/AppContext';
import { CURRICULUM_LESSONS, TYPING_TEST_PASSAGES } from '../data/curriculum';
import {
  Users,
  Plus,
  BookOpen,
  Calendar,
  Download,
  Share2,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  ClipboardList
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { user, classrooms, createClassroom, createAssignment } = useApp();
  const [selectedClassId, setSelectedClassId] = useState<string>(classrooms[0]?.id || '');
  const [isCreatingClass, setIsCreatingClass] = useState<boolean>(false);
  const [newClassName, setNewClassName] = useState<string>('');
  const [newClassGrade, setNewClassGrade] = useState<string>('Grade 9');

  const [isAssigning, setIsAssigning] = useState<boolean>(false);
  const [assignTitle, setAssignTitle] = useState<string>('');
  const [assignType, setAssignType] = useState<'lesson' | 'test'>('lesson');
  const [assignTargetId, setAssignTargetId] = useState<string>('beg-1');
  const [assignDueDate, setAssignDueDate] = useState<string>('Next Friday, 5:00 PM');
  const [assignTargetWpm, setAssignTargetWpm] = useState<number>(35);

  const selectedClass = classrooms.find(c => c.id === selectedClassId) || classrooms[0];

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const created = createClassroom(newClassName, newClassGrade);
    setSelectedClassId(created.id);
    setNewClassName('');
    setIsCreatingClass(false);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !assignTitle.trim()) return;
    createAssignment(
      selectedClass.id,
      assignTitle,
      assignType,
      assignTargetId,
      assignDueDate,
      assignTargetWpm
    );
    setAssignTitle('');
    setIsAssigning(false);
  };

  const exportRosterCsv = () => {
    if (!selectedClass) return;
    const headers = 'Student ID,Name,Email,WPM,Accuracy,Completed Lessons,Last Active\n';
    const rows = selectedClass.students
      .map(s => `${s.id},"${s.name}",${s.email},${s.wpm},${s.accuracy}%,${s.completedLessons},"${s.lastActive}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedClass.name.replace(/\s+/g, '_')}_Roster.csv`;
    a.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      {/* Top Banner with Classroom Generated Asset */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950 min-h-[220px] flex flex-col justify-end p-6 md:p-8">
        <img
          src="/src/assets/images/classroom_interactive_learning_1793985550810.jpg"
          alt="Classroom Education"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Teacher &amp; Instructor Portal
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1 tracking-tight leading-tight">
              Classroom &amp; Student Mastery Suite
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-xl leading-relaxed">
              Monitor real-time student typing accuracy, assign lessons, track speed distributions, and generate compliance reports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreatingClass(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-tight rounded-xl shadow-md flex items-center gap-2 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              Create Classroom
            </button>
            <button
              onClick={exportRosterCsv}
              className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 font-bold text-xs tracking-tight rounded-xl shadow-md flex items-center gap-2 transition-all shrink-0"
            >
              <Download className="w-4 h-4" />
              Export Roster CSV
            </button>
          </div>
        </div>
      </div>

      {/* Classroom Switcher Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {classrooms.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedClassId(c.id)}
            className={`px-5 py-3 rounded-2xl border text-left whitespace-nowrap transition-all ${
              selectedClass?.id === c.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md font-bold'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 font-medium'
            }`}
          >
            <div className="text-sm font-bold tracking-tight">{c.name}</div>
            <div className={`text-xs mt-0.5 tracking-tight ${selectedClass?.id === c.id ? 'text-indigo-100' : 'text-slate-400'}`}>
              Join Code: <strong className="font-mono tracking-wider">{c.code}</strong> · {c.studentCount} Students
            </div>
          </button>
        ))}
      </div>

      {selectedClass && (
        <div className="flex flex-col gap-6">
          {/* Class Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Class Average WPM</span>
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums tracking-tight mt-1">
                {selectedClass.averageWpm} WPM
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Enrolled Students</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight mt-1">
                {selectedClass.studentCount}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Active Assignments</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight mt-1">
                {selectedClass.assignments.length}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Class Join Code</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tracking-wider">
                  {selectedClass.code}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 tracking-tight">Share with students</span>
              </div>
            </div>
          </div>

          {/* Assignments Management & Quick Assign */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-indigo-600" />
                  Class Assignments &amp; Homework
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                  Assign lessons or standardized typing tests with custom deadlines and speed goals.
                </p>
              </div>

              <button
                onClick={() => setIsAssigning(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-tight rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Assign Task
              </button>
            </div>

            {selectedClass.assignments.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 py-4 leading-relaxed">
                No assignments created yet for this classroom. Click "Assign Task" to create one.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedClass.assignments.map(asg => (
                  <div
                    key={asg.id}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span className="uppercase font-bold text-[10px] tracking-wider text-indigo-600 dark:text-indigo-400">
                          {asg.type === 'lesson' ? 'Curriculum Lesson' : 'Standardized Test'}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Due: {asg.dueDate}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                        {asg.title}
                      </h4>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Goal: <strong className="font-semibold text-slate-800 dark:text-slate-200">{asg.targetWpm} WPM</strong> · Min {asg.minAccuracy}% Accuracy
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span>Completion: <strong className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{asg.completedCount} / {asg.totalCount} Students</strong></span>
                      <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${Math.round((asg.completedCount / asg.totalCount) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Student Roster Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Student Roster &amp; Performance Overview
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Speed (WPM)</th>
                    <th className="pb-3">Accuracy</th>
                    <th className="pb-3">Lessons Done</th>
                    <th className="pb-3">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedClass.students.map(std => (
                    <tr key={std.id} className="text-slate-700 dark:text-slate-300">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white tracking-tight">
                        {std.name}
                      </td>
                      <td className="py-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {std.email}
                      </td>
                      <td className="py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums tracking-tight">
                        {std.wpm} WPM
                      </td>
                      <td className="py-3 font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400 tracking-tight">
                        {std.accuracy}%
                      </td>
                      <td className="py-3 text-xs text-slate-500 dark:text-slate-400">
                        {std.completedLessons} completed
                      </td>
                      <td className="py-3 text-xs text-slate-400 dark:text-slate-500">
                        {std.lastActive}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Classroom */}
      {isCreatingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Create New Classroom
            </h3>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                  Classroom Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Period 5 — AP Computer Science"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                  Grade / Level
                </label>
                <select
                  value={newClassGrade}
                  onChange={e => setNewClassGrade(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Grade 6 - Middle School</option>
                  <option>Grade 7 - Middle School</option>
                  <option>Grade 8 - Middle School</option>
                  <option>Grade 9 - High School</option>
                  <option>Grade 10 - High School</option>
                  <option>Grade 11 - High School</option>
                  <option>Grade 12 - High School</option>
                  <option>College / Professional</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingClass(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold tracking-tight rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold tracking-tight rounded-xl shadow-md"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Assignment */}
      {isAssigning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Assign Task to {selectedClass?.name}
            </h3>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Upper Row Letters E &amp; I"
                  value={assignTitle}
                  onChange={e => setAssignTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                    Activity Type
                  </label>
                  <select
                    value={assignType}
                    onChange={e => setAssignType(e.target.value as any)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="lesson">Curriculum Lesson</option>
                    <option value="test">Speed Test</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                    Target Activity
                  </label>
                  <select
                    value={assignTargetId}
                    onChange={e => setAssignTargetId(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {assignType === 'lesson'
                      ? CURRICULUM_LESSONS.slice(0, 10).map(l => (
                          <option key={l.id} value={l.id}>{l.title}</option>
                        ))
                      : TYPING_TEST_PASSAGES.map(t => (
                          <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                    Due Date
                  </label>
                  <input
                    type="text"
                    value={assignDueDate}
                    onChange={e => setAssignDueDate(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 tracking-tight">
                    Target Speed (WPM)
                  </label>
                  <input
                    type="number"
                    value={assignTargetWpm}
                    onChange={e => setAssignTargetWpm(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAssigning(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold tracking-tight rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold tracking-tight rounded-xl shadow-md"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
