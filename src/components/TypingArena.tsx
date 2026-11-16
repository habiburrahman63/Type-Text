import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { calculateTypingMetrics, TypingMetrics } from '../utils/typingEngine';
import { soundController } from '../utils/audio';
import { InteractiveKeyboard } from './InteractiveKeyboard';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, Award, Zap, AlertTriangle, ArrowRight } from 'lucide-react';

interface TypingArenaProps {
  title: string;
  categoryOrUnit?: string;
  targetText: string;
  targetWpm?: number;
  timeLimitSeconds?: number; // 0 for unlimited / lesson mode
  onComplete: (metrics: TypingMetrics) => void;
  onNext?: () => void;
  showKeyboard?: boolean;
}

export const TypingArena: React.FC<TypingArenaProps> = ({
  title,
  categoryOrUnit,
  targetText,
  targetWpm = 30,
  timeLimitSeconds = 0,
  onComplete,
  onNext,
  showKeyboard = true
}) => {
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [soundOn, setSoundOn] = useState<boolean>(soundController.enabled);
  const [finalMetrics, setFinalMetrics] = useState<TypingMetrics | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeCharSpanRef = useRef<HTMLSpanElement>(null);

  const isTimed = timeLimitSeconds > 0;
  const remainingSeconds = isTimed ? Math.max(0, timeLimitSeconds - elapsedSeconds) : elapsedSeconds;

  const currentIndex = typedChars.length;
  const currentChar = targetText[currentIndex] || '';
  const isShiftNeeded = /[A-Z!@#$%^&*()_+{}:"<>?~]/.test(currentChar);

  // Focus input automatically
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, []);

  // Timer loop
  useEffect(() => {
    if (isStarted && !isPaused && !isFinished) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => {
          const next = prev + 1;
          if (isTimed && next >= timeLimitSeconds) {
            finishExercise(next);
            return timeLimitSeconds;
          }
          return next;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isPaused, isFinished, isTimed, timeLimitSeconds]);

  // Keep cursor scrolled into view
  useEffect(() => {
    if (activeCharSpanRef.current) {
      activeCharSpanRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [currentIndex]);

  const finishExercise = useCallback((totalSeconds: number) => {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);

    let correctCount = 0;
    let uncorrectedErrors = 0;

    typedChars.forEach((ch, idx) => {
      if (ch === targetText[idx]) {
        correctCount++;
      } else {
        uncorrectedErrors++;
      }
    });

    const metrics = calculateTypingMetrics({
      totalKeystrokes: typedChars.length,
      correctKeystrokes: correctCount,
      uncorrectedErrors,
      elapsedSeconds: totalSeconds
    });

    setFinalMetrics(metrics);
    soundController.playSuccess();
    
    // Trigger festive celebratory confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    onComplete(metrics);
  }, [typedChars, targetText, onComplete]);

  // Check if text is completed
  useEffect(() => {
    if (isStarted && !isFinished && currentIndex >= targetText.length) {
      finishExercise(elapsedSeconds);
    }
  }, [currentIndex, targetText.length, isStarted, isFinished, elapsedSeconds, finishExercise]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished || isPaused) return;

    // Ignore pure modifier keys
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
      return;
    }

    if (!isStarted) {
      setIsStarted(true);
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typedChars.length > 0) {
        setTypedChars(prev => prev.slice(0, -1));
        soundController.playKeyClick();
      }
      return;
    }

    // Only process printable single character inputs
    if (e.key.length === 1) {
      e.preventDefault();
      const expected = targetText[currentIndex];
      const isCorrect = e.key === expected;

      if (isCorrect) {
        soundController.playKeyClick();
      } else {
        soundController.playError();
      }

      setTypedChars(prev => [...prev, e.key]);
    }
  };

  const handleRestart = () => {
    setTypedChars([]);
    setIsStarted(false);
    setIsPaused(false);
    setIsFinished(false);
    setElapsedSeconds(0);
    setFinalMetrics(null);
    focusInput();
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundController.enabled = next;
  };

  // Live intermediate metrics
  const liveCorrect = typedChars.reduce((acc, ch, i) => acc + (ch === targetText[i] ? 1 : 0), 0);
  const liveErrors = typedChars.length - liveCorrect;
  const liveAccuracy = typedChars.length > 0 ? Math.round((liveCorrect / typedChars.length) * 100) : 100;
  const liveMinutes = Math.max(elapsedSeconds, 1) / 60;
  const liveWpm = Math.round((typedChars.length / 5) / liveMinutes);
  const progressPercent = Math.min(100, Math.round((typedChars.length / targetText.length) * 100));

  return (
    <div
      ref={containerRef}
      onClick={focusInput}
      className="relative w-full max-w-5xl mx-auto flex flex-col gap-6"
    >
      {/* Hidden real input capturing all keyboard & mobile virtual keyboard events */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute -top-96 left-0 pointer-events-none"
        onKeyDown={handleKeyDown}
        autoFocus
        tabIndex={0}
        aria-label="Typing input field"
      />

      {/* Top HUD: Title, Progress & Live Metrics */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            {categoryOrUnit && (
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {categoryOrUnit}
              </span>
            )}
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={soundOn ? 'Mute Keystroke Sounds' : 'Unmute Sounds'}
              aria-label="Toggle sound"
            >
              {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {isStarted && !isFinished && (
              <button
                onClick={() => setIsPaused(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-tight bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            )}

            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-tight bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Live Speed</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl md:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums font-mono tracking-tight">
                {liveWpm}
              </span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">WPM</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Accuracy</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-2xl md:text-3xl font-extrabold tabular-nums font-mono tracking-tight ${liveAccuracy >= 95 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                {liveAccuracy}%
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isTimed ? 'Time Left' : 'Time Elapsed'}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-200 tabular-nums font-mono tracking-tight">
                {Math.floor(remainingSeconds / 60)}:{(remainingSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progress</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-200 tabular-nums font-mono tracking-tight">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
          <div
            className="bg-indigo-600 h-full transition-all duration-150 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Interactive Typing Area */}
      <div className="relative bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-md cursor-text min-h-[180px] flex flex-col justify-center">
        {isPaused && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center z-20 text-white gap-3">
            <p className="text-lg font-bold">Exercise Paused</p>
            <button
              onClick={() => setIsPaused(false)}
              className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 shadow-md transition-all"
            >
              Click to Resume
            </button>
          </div>
        )}

        <div className="text-lg md:text-2xl font-mono leading-[1.8] select-none max-h-56 overflow-y-auto pr-2 whitespace-pre-wrap break-words tracking-normal">
          {targetText.split('').map((char, index) => {
            const isTyped = index < typedChars.length;
            const isCurrent = index === currentIndex;
            const userChar = typedChars[index];
            const isCorrect = userChar === char;
            const isSpace = char === ' ';

            let charClass = 'text-slate-400 dark:text-slate-500';
            if (isTyped) {
              if (isCorrect) {
                charClass = 'text-emerald-600 dark:text-emerald-400 font-medium';
              } else {
                charClass = 'bg-rose-500/25 text-rose-600 dark:text-rose-400 underline decoration-rose-500 decoration-2 font-medium';
              }
            }

            // Visible display for active cursor or mistyped space
            let displayChar: React.ReactNode = char;
            if (isSpace) {
              if (isCurrent) {
                displayChar = <span className="inline-block w-[1ch] text-center font-bold text-indigo-600 dark:text-indigo-400">␣</span>;
              } else if (isTyped && !isCorrect) {
                displayChar = <span className="inline-block min-w-[1ch] text-rose-600 underline font-bold">{userChar || '␣'}</span>;
              } else {
                displayChar = ' ';
              }
            } else if (isTyped && !isCorrect && userChar === ' ') {
              displayChar = <span className="underline decoration-rose-500">{char}</span>;
            }

            return (
              <span
                key={index}
                ref={isCurrent ? activeCharSpanRef : null}
                className={`relative inline transition-colors duration-75 ${charClass} ${
                  isCurrent
                    ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-950 dark:text-white rounded-xs ring-2 ring-indigo-500 font-semibold'
                    : ''
                }`}
              >
                {displayChar}
                {isCurrent && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                )}
              </span>
            );
          })}
        </div>

        {!isStarted && (
          <div className="mt-4 text-center text-xs md:text-sm font-medium text-slate-400 dark:text-slate-500 animate-pulse tracking-tight">
            Click here or press any key to start typing...
          </div>
        )}
      </div>

      {/* Interactive Visual Keyboard with Real-time Hands Guidance */}
      {showKeyboard && !isFinished && (
        <InteractiveKeyboard
          activeChar={currentChar}
          isShiftRequired={isShiftNeeded}
        />
      )}

      {/* Completion Modal Summary */}
      {isFinished && finalMetrics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl flex flex-col gap-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Exercise Completed!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                {finalMetrics.accuracy >= 95
                  ? 'Outstanding accuracy! Muscle memory is solidifying.'
                  : finalMetrics.accuracy >= 85
                  ? 'Great progress! Practice regularly to eliminate minor errors.'
                  : 'Keep going! Focus on accuracy first, then speed will follow.'}
              </p>
            </div>

            {/* Scorecard */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Speed</span>
                <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums tracking-tight mt-0.5">
                  {finalMetrics.netWpm}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">WPM</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Accuracy</span>
                <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums tracking-tight mt-0.5">
                  {finalMetrics.accuracy}%
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Precision</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Errors</span>
                <span className="text-3xl font-extrabold text-rose-500 font-mono tabular-nums tracking-tight mt-0.5">
                  {finalMetrics.errorCount}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Mistakes</span>
              </div>
            </div>

            {/* Total Keystrokes & Time */}
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 px-2 font-medium">
              <span>Keystrokes: <strong className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{finalMetrics.totalKeystrokes}</strong></span>
              <span>Time: <strong className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{finalMetrics.elapsedSeconds}s</strong></span>
              <span>Target: <strong className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{targetWpm} WPM</strong></span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm tracking-tight rounded-xl transition-all"
              >
                Try Again
              </button>

              {onNext && (
                <button
                  onClick={onNext}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-tight rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  Next Exercise
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
