import React, { useState } from 'react';
import { useApp, CertificateRecord } from '../context/AppContext';
import { TYPING_TEST_PASSAGES, TypingTestPassage } from '../data/curriculum';
import { TypingArena } from './TypingArena';
import { CertificateModal } from './CertificateModal';
import { TypingMetrics } from '../utils/typingEngine';
import { Timer, Award, Clock, Flame, ChevronRight, FileText, CheckCircle2, RotateCcw } from 'lucide-react';

export const TypingTestView: React.FC = () => {
  const { testHistory, saveTestResult, certificates } = useApp();
  const [selectedDuration, setSelectedDuration] = useState<number>(60); // 60s standard
  const [selectedPassage, setSelectedPassage] = useState<TypingTestPassage>(TYPING_TEST_PASSAGES[0]);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [activeCert, setActiveCert] = useState<CertificateRecord | null>(null);

  const DURATIONS = [
    { label: '15 Seconds', seconds: 15, hint: 'Sprint' },
    { label: '30 Seconds', seconds: 30, hint: 'Quick' },
    { label: '1 Minute', seconds: 60, hint: 'Official Standard' },
    { label: '2 Minutes', seconds: 120, hint: 'Endurance' },
    { label: '3 Minutes', seconds: 180, hint: 'Certification' },
    { label: '5 Minutes', seconds: 300, hint: 'Exhaustive' }
  ];

  const handleCompleteTest = (metrics: TypingMetrics) => {
    const saved = saveTestResult({
      passageTitle: selectedPassage.title,
      category: selectedPassage.category,
      durationSeconds: selectedDuration,
      grossWpm: metrics.grossWpm,
      netWpm: metrics.netWpm,
      accuracy: metrics.accuracy,
      errorCount: metrics.errorCount
    });

    if (saved.certificate) {
      setActiveCert(saved.certificate);
    }
  };

  if (isTestActive) {
    return (
      <div className="w-full flex flex-col gap-6">
        <button
          onClick={() => setIsTestActive(false)}
          className="self-start text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          ← Exit Typing Test
        </button>

        <TypingArena
          title={selectedPassage.title}
          categoryOrUnit={`${selectedDuration}s Test · ${selectedPassage.difficulty}`}
          targetText={selectedPassage.text}
          timeLimitSeconds={selectedDuration}
          onComplete={handleCompleteTest}
          showKeyboard={false}
        />

        {activeCert && (
          <CertificateModal
            certificate={activeCert}
            onClose={() => setActiveCert(null)}
          />
        )}
      </div>
    );
  }

  const latestTest = testHistory[0];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Standardized Examination
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight leading-tight">
          Official Typing Speed &amp; Accuracy Test
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1.5 max-w-2xl leading-relaxed">
          Evaluate your net words per minute under official time conditions. Earn a verified certificate for scores meeting academic standards (35+ WPM, 90%+ Accuracy).
        </p>
      </div>

      {/* Test Setup Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Duration & Passage Selection */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
          <div>
            <label className="text-sm font-bold text-slate-900 dark:text-white block mb-3 tracking-tight">
              1. Choose Duration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {DURATIONS.map(dur => (
                <button
                  key={dur.seconds}
                  onClick={() => setSelectedDuration(dur.seconds)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedDuration === dur.seconds
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-bold text-sm tracking-tight">{dur.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{dur.hint}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-900 dark:text-white block mb-3 tracking-tight">
              2. Select Passage &amp; Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TYPING_TEST_PASSAGES.map(pass => (
                <button
                  key={pass.id}
                  onClick={() => setSelectedPassage(pass)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedPassage.id === pass.id
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs uppercase font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider">
                      {pass.category}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {pass.difficulty}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white tracking-tight leading-snug">
                    {pass.title}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {pass.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsTestActive(true)}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 text-base flex items-center justify-center gap-2 transition-all mt-2 tracking-tight"
          >
            <Timer className="w-5 h-5" />
            Begin {selectedDuration}-Second Test
          </button>
        </div>

        {/* Right Column: Personal Best & Recent Test History */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Latest Test Record
            </h3>

            {latestTest ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Speed</span>
                    <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums tracking-tight mt-0.5">
                      {latestTest.netWpm} <span className="text-xs font-normal">WPM</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Accuracy</span>
                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums tracking-tight mt-0.5">
                      {latestTest.accuracy}%
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                  <div>Passage: <strong className="font-semibold text-slate-700 dark:text-slate-300">{latestTest.passageTitle}</strong></div>
                  <div>Duration: <strong className="font-semibold text-slate-700 dark:text-slate-300">{latestTest.durationSeconds}s</strong></div>
                  <div>Date: <strong className="font-semibold text-slate-700 dark:text-slate-300">{new Date(latestTest.timestamp).toLocaleDateString()}</strong></div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                No tests completed yet. Start your first test today!
              </p>
            )}
          </div>

          {/* Certificates Earned Banner */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-3xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm tracking-tight">
              <Award className="w-5 h-5 text-amber-500" />
              Certificates Earned ({certificates.length})
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Achieve 35+ WPM with at least 90% accuracy on any test to unlock your verified digital certificate.
            </p>
            {certificates.length > 0 && (
              <button
                onClick={() => setActiveCert(certificates[0])}
                className="mt-2 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 self-start tracking-tight"
              >
                View Latest Certificate →
              </button>
            )}
          </div>
        </div>
      </div>

      {activeCert && (
        <CertificateModal
          certificate={activeCert}
          onClose={() => setActiveCert(null)}
        />
      )}
    </div>
  );
};
