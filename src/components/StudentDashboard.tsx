import React, { useState } from 'react';
import { useApp, CertificateRecord } from '../context/AppContext';
import { CURRICULUM_LESSONS } from '../data/curriculum';
import { calculateLevelFromXp } from '../utils/gamification';
import { CertificateModal } from './CertificateModal';
import {
  Flame,
  Award,
  Zap,
  Target,
  Clock,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Play,
  TrendingUp,
  FileCheck,
  History,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigateToCurriculum: (lessonId?: string) => void;
  onNavigateToTest: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigateToCurriculum,
  onNavigateToTest
}) => {
  const { user, lessonProgress, testHistory, certificates, classrooms, isAuthenticated } = useApp();
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);

  const levelInfo = calculateLevelFromXp(user.xp);

  // Compute strictly user-specific metrics
  const tests = testHistory;
  const hasTests = tests.length > 0;
  const avgWpm = hasTests
    ? Math.round(tests.reduce((acc, t) => acc + t.netWpm, 0) / tests.length)
    : 0;
  const topWpm = hasTests
    ? Math.max(...tests.map(t => t.netWpm))
    : 0;
  const avgAccuracy = hasTests
    ? Math.round(tests.reduce((acc, t) => acc + t.accuracy, 0) / tests.length)
    : 0;

  const completedLessonCount = Object.keys(lessonProgress).length;

  // Next recommended lesson
  const nextLesson = CURRICULUM_LESSONS.find(l => !lessonProgress[l.id]) || CURRICULUM_LESSONS[0];

  // Extract enrolled student assignments
  const studentAssignments = classrooms.flatMap(c =>
    c.assignments.map(a => ({ ...a, className: c.name }))
  );

  // Chronologically sorted tests for dynamic trend chart (oldest to newest, max 7)
  const chartTests = [...tests].reverse().slice(-7);

  // Dynamic Chart coordinate calculations
  const maxWpmInChart = Math.max(...chartTests.map(t => t.netWpm), 60);
  const chartMaxY = Math.ceil(maxWpmInChart / 10) * 10 + 10;

  const chartPoints = chartTests.map((t, idx) => {
    const totalCount = chartTests.length;
    const x = totalCount === 1 ? 300 : 50 + (idx / (totalCount - 1)) * 500;
    // Y mapped between 135 (bottom) and 25 (top)
    const ySpeed = 135 - (t.netWpm / chartMaxY) * 110;
    const yAccuracy = 135 - (t.accuracy / 100) * 110;
    return {
      x,
      ySpeed: Math.max(20, Math.min(135, ySpeed)),
      yAccuracy: Math.max(20, Math.min(135, yAccuracy)),
      wpm: t.netWpm,
      accuracy: t.accuracy,
      title: t.passageTitle,
      date: new Date(t.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    };
  });

  const speedPolyline = chartPoints.map(p => `${p.x},${p.ySpeed}`).join(' ');
  const accuracyPolyline = chartPoints.map(p => `${p.x},${p.yAccuracy}`).join(' ');

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      {/* Top Welcome & Progression Strip */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-950 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 z-10">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-indigo-800/40 p-1 border-2 border-indigo-400 shadow-lg object-cover"
          />
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 tracking-tight">
              <span>{user.schoolName}</span>
              <span>·</span>
              <span>{user.gradeLevel || (user.role === 'teacher' ? 'Educator' : 'Student')}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-0.5 leading-tight">
              {isAuthenticated ? `Welcome back, ${user.name}` : `Welcome, ${user.name}`}
            </h2>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/30 font-bold tracking-tight">
                Level {levelInfo.level} · {levelInfo.title}
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-bold tracking-tight">
                <Flame className="w-4 h-4 fill-amber-400" />
                {user.streakDays}-Day Streak
              </span>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="w-full md:w-72 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 z-10">
          <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium tracking-tight">
            <span>Level {levelInfo.level} Progress</span>
            <span className="font-mono text-indigo-400 font-bold tabular-nums">{levelInfo.progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-mono tabular-nums">
            <span>{user.xp} XP</span>
            <span>{levelInfo.nextLevelXp} XP</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Average Speed</span>
            <Zap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {avgWpm}
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">WPM</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Target goal: {user.targetWpm} WPM
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Top Speed</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {topWpm}
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">WPM</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
            {hasTests ? 'Personal all-time best' : 'No tests recorded'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Accuracy</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums tracking-tight">
              {hasTests ? `${avgAccuracy}%` : '—'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            {hasTests ? 'Average precision rate' : 'Take a test to calculate'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Lessons Passed</span>
            <BookOpen className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {completedLessonCount}
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">/ {CURRICULUM_LESSONS.length}</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Curriculum milestone
          </span>
        </div>
      </div>

      {/* Main Split: Next Lesson CTA & Dynamic Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Recommended Lesson Card */}
        <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Up Next in Your Curriculum
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight leading-snug">
              {nextLesson.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {nextLesson.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md font-mono font-semibold text-slate-700 dark:text-slate-300 tracking-tight">
                Target: {nextLesson.targetWpm} WPM
              </span>
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md font-mono font-semibold text-slate-700 dark:text-slate-300 tracking-tight">
                Min: {nextLesson.minAccuracy}% Accuracy
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
            <button
              onClick={() => onNavigateToCurriculum(nextLesson.id)}
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-xs tracking-tight transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Continue Lesson
            </button>
            <button
              onClick={onNavigateToTest}
              className="py-3 px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs tracking-tight transition-all cursor-pointer"
            >
              Take Test
            </button>
          </div>
        </div>

        {/* Speed Trend Interactive SVG Chart (Completely Dynamic) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Typing Speed &amp; Accuracy Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                {hasTests
                  ? `Plotted from ${tests.length} recorded session${tests.length > 1 ? 's' : ''} for ${user.name}.`
                  : `Real-time dynamic trajectory curve for ${user.name}.`}
              </p>
            </div>
            {hasTests && (
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-medium tracking-tight text-indigo-600 dark:text-indigo-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Speed (WPM)
                </span>
                <span className="flex items-center gap-1.5 font-medium tracking-tight text-emerald-600 dark:text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Accuracy (%)
                </span>
              </div>
            )}
          </div>

          {/* Dynamic SVG Chart or Empty State */}
          <div className="w-full h-44 relative mt-2 flex items-center justify-center">
            {hasTests ? (
              <svg viewBox="0 0 600 160" className="w-full h-full overflow-visible">
                {/* Horizontal Grid Lines */}
                <line x1="30" y1="25" x2="570" y2="25" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
                <line x1="30" y1="62" x2="570" y2="62" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
                <line x1="30" y1="98" x2="570" y2="98" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
                <line x1="30" y1="135" x2="570" y2="135" stroke="currentColor" className="text-slate-200 dark:text-slate-700" />

                {/* Speed Polyline */}
                {chartPoints.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={speedPolyline}
                  />
                )}

                {/* Accuracy Polyline */}
                {chartPoints.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    points={accuracyPolyline}
                  />
                )}

                {/* Data Points */}
                {chartPoints.map((p, i) => (
                  <g key={i}>
                    {/* Speed Circle & Label */}
                    <circle
                      cx={p.x}
                      cy={p.ySpeed}
                      r="4.5"
                      fill="#4f46e5"
                      className="stroke-white dark:stroke-slate-900 stroke-2"
                    />
                    <text
                      x={p.x}
                      y={p.ySpeed - 8}
                      textAnchor="middle"
                      className="text-[10px] font-mono fill-indigo-600 dark:fill-indigo-400 font-bold"
                    >
                      {p.wpm}
                    </text>

                    {/* Accuracy Circle */}
                    <circle
                      cx={p.x}
                      cy={p.yAccuracy}
                      r="3.5"
                      fill="#10b981"
                      className="stroke-white dark:stroke-slate-900 stroke-2"
                    />
                  </g>
                ))}
              </svg>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 w-full h-full bg-slate-50/50 dark:bg-slate-800/30">
                <TrendingUp className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  No Speed Tests Recorded Yet
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mt-0.5 mb-3">
                  Take a 1-minute standardized test to plot your personalized speed and accuracy curve.
                </p>
                <button
                  onClick={onNavigateToTest}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start First Test</span>
                </button>
              </div>
            )}
          </div>

          {/* Session Footnotes */}
          {hasTests && (
            <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono tracking-tight mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {chartPoints.map((p, idx) => (
                <span key={idx}>
                  {idx === chartPoints.length - 1 ? 'Latest' : `S-${idx + 1}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Performance Activity Tracking Log & Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Performance History Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" />
              Recent Performance Sessions ({tests.length})
            </h3>
            {hasTests && (
              <button
                onClick={onNavigateToTest}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>New Test</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {!hasTests ? (
            <div className="p-6 text-center rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You haven&apos;t completed any speed tests yet.
              </p>
              <button
                onClick={onNavigateToTest}
                className="mt-3 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Take Speed Test</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {tests.slice(0, 5).map(test => (
                <div
                  key={test.id}
                  className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight truncate">
                      {test.passageTitle}
                    </h4>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      {new Date(test.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}{' '}
                      · {test.durationSeconds}s test
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-right shrink-0">
                    <div>
                      <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                        {test.netWpm}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-0.5">WPM</span>
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                        {test.accuracy}%
                      </span>
                      <span className="text-[10px] text-slate-400 block text-right">
                        {test.errorCount} err
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verified Certificates */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Verified Credentials ({certificates.length})
            </h3>
          </div>

          {certificates.length === 0 ? (
            <div className="p-6 text-center rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <Award className="w-8 h-8 text-amber-400/60 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No Certificates Earned Yet
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 mb-3 max-w-xs mx-auto">
                Score 35+ WPM with 90%+ accuracy on any test to unlock your official verified certificate!
              </p>
              <button
                onClick={onNavigateToTest}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Qualify for Certificate</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {certificates.map(cert => (
                <div
                  key={cert.id}
                  className="p-4 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg">
                      🏆
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                        {cert.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tracking-tight">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{cert.wpm} WPM</span>
                        <span>·</span>
                        <span>{cert.accuracy}% Precision</span>
                        <span>·</span>
                        <span>{cert.issuedDate}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block mt-0.5">
                        Awarded to: <strong className="text-slate-700 dark:text-slate-300">{cert.recipientName}</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="px-3 py-1.5 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200 font-bold text-xs tracking-tight rounded-lg transition-all shrink-0 cursor-pointer"
                  >
                    View / Print
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Classroom Assignments Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 tracking-tight flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-indigo-600" />
          Classroom Assignments &amp; Deadlines
        </h3>

        {studentAssignments.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            No pending assignments. You are fully up to date!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {studentAssignments.map(asg => (
              <div
                key={asg.id}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {asg.className}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                    {asg.title}
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                    Due: {asg.dueDate} · Target: {asg.targetWpm} WPM
                  </span>
                </div>

                <button
                  onClick={() => onNavigateToCurriculum(asg.targetId)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-tight rounded-lg transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};
