import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CURRICULUM_LESSONS, Lesson } from '../data/curriculum';
import { TypingArena } from './TypingArena';
import { TypingMetrics, evaluateLessonResult } from '../utils/typingEngine';
import { Star, CheckCircle, Lock, Play, Sparkles, BookOpen, ChevronRight, Award } from 'lucide-react';

export const CurriculumView: React.FC<{ initialLessonId?: string }> = ({ initialLessonId }) => {
  const { lessonProgress, saveLessonProgress, customLessons } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'professional'>('beginner');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(() => {
    if (initialLessonId) {
      return CURRICULUM_LESSONS.find(l => l.id === initialLessonId) || null;
    }
    return null;
  });

  const allLessons = [...CURRICULUM_LESSONS, ...customLessons];
  const filteredLessons = allLessons.filter(l => l.level === selectedLevel);

  // Group lessons by unit
  const unitsMap: Record<string, Lesson[]> = {};
  filteredLessons.forEach(l => {
    if (!unitsMap[l.unit]) {
      unitsMap[l.unit] = [];
    }
    unitsMap[l.unit].push(l);
  });

  const handleCompleteLesson = (metrics: TypingMetrics) => {
    if (!activeLesson) return;
    const evalResult = evaluateLessonResult({
      targetWpm: activeLesson.targetWpm,
      actualWpm: metrics.netWpm,
      actualAccuracy: metrics.accuracy,
      minAccuracy: activeLesson.minAccuracy
    });

    saveLessonProgress(activeLesson.id, metrics.netWpm, metrics.accuracy, evalResult.stars);
  };

  const handleNextLesson = () => {
    if (!activeLesson) return;
    const currIdx = allLessons.findIndex(l => l.id === activeLesson.id);
    if (currIdx !== -1 && currIdx < allLessons.length - 1) {
      setActiveLesson(allLessons[currIdx + 1]);
    } else {
      setActiveLesson(null);
    }
  };

  if (activeLesson) {
    return (
      <div className="w-full flex flex-col gap-6">
        <button
          onClick={() => setActiveLesson(null)}
          className="self-start text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          ← Back to Curriculum Overview
        </button>

        <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-4 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong>Lesson Instructions:</strong> {activeLesson.instructions}
          </div>
        </div>

        <TypingArena
          title={activeLesson.title}
          categoryOrUnit={activeLesson.unit}
          targetText={activeLesson.text}
          targetWpm={activeLesson.targetWpm}
          onComplete={handleCompleteLesson}
          onNext={handleNextLesson}
          showKeyboard={true}
        />
      </div>
    );
  }

  const LEVELS = [
    { id: 'beginner', label: 'Beginner', desc: 'Home row anchors, finger reaches, and basic punctuation' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Frequent word pairs, sentence flow, and numbers' },
    { id: 'advanced', label: 'Advanced', desc: 'Long-form endurance, quotes, and velocity sprints' },
    { id: 'professional', label: 'Professional', desc: 'Business correspondence, code syntax, and SQL' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Interactive Typing Curriculum
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight leading-tight">
            Typing Curriculum &amp; Skill Progression
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1.5 max-w-xl leading-relaxed">
            A research-backed 4-tier curriculum taking typists from zero keyboard knowledge to professional workplace mastery.
          </p>
        </div>

        {/* Completion Counter */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <Award className="w-5 h-5 text-amber-500" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {Object.keys(lessonProgress).length} / {allLessons.length} Lessons
            </span>
          </div>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {LEVELS.map(lvl => (
          <button
            key={lvl.id}
            onClick={() => setSelectedLevel(lvl.id as any)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedLevel === lvl.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <div className="font-extrabold text-base tracking-tight">{lvl.label}</div>
            <div className={`text-xs mt-1 line-clamp-2 leading-relaxed ${selectedLevel === lvl.id ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
              {lvl.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Units & Lesson Cards List */}
      <div className="flex flex-col gap-8">
        {Object.entries(unitsMap).map(([unitName, lessons]) => (
          <div key={unitName} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {unitName}
              </h3>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessons.map(lesson => {
                const progress = lessonProgress[lesson.id];
                const isPassed = !!progress && progress.stars > 0;

                return (
                  <div
                    key={lesson.id}
                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top status */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 font-mono tracking-wide">
                          Lesson {lesson.order}
                        </span>

                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map(starNum => (
                            <Star
                              key={starNum}
                              className={`w-4 h-4 ${
                                progress && progress.stars >= starNum
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight leading-snug">
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {lesson.description}
                      </p>

                      {/* Keys Introduced */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        {lesson.keysIntroduced.map((key, kIdx) => (
                          <span
                            key={kIdx}
                            className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-tight bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700"
                          >
                            {key === ' ' ? 'Space' : key}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="text-slate-600 dark:text-slate-400">
                        {isPassed ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Best: {progress.bestWpm} WPM
                          </span>
                        ) : (
                          <span>Target: <strong className="font-semibold text-slate-900 dark:text-white">{lesson.targetWpm} WPM</strong></span>
                        )}
                      </div>

                      <button
                        onClick={() => setActiveLesson(lesson)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs tracking-tight flex items-center gap-1.5 transition-all ${
                          isPassed
                            ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        {isPassed ? 'Practice Again' : 'Start Lesson'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
