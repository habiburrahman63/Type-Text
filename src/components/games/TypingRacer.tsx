import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { soundController } from '../../utils/audio';
import { Play, RotateCcw, Trophy, Gauge, Flag, Zap, Award } from 'lucide-react';

interface BotRacer {
  id: string;
  name: string;
  avatar: string;
  speedMultiplier: number; // wpm range
  color: string;
  progress: number;
}

const WORDS_POOL = [
  'swift', 'engine', 'speed', 'rhythm', 'turbo', 'velocity', 'champion', 'track',
  'drive', 'motion', 'boost', 'fast', 'winner', 'keyboard', 'clutch', 'power',
  'rapid', 'finish', 'vector', 'sprint', 'pedal', 'accel', 'gear', 'nitro'
];

export const TypingRacer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { saveGameScore } = useApp();
  const [gameState, setGameState] = useState<'lobby' | 'countdown' | 'racing' | 'finished'>('lobby');
  const [countdown, setCountdown] = useState<number>(3);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [playerProgress, setPlayerProgress] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [bots, setBots] = useState<BotRacer[]>([
    { id: 'b1', name: 'Turbo Tyler', avatar: '🏎️', speedMultiplier: 38, color: 'bg-emerald-500', progress: 0 },
    { id: 'b2', name: 'Pixel Penny', avatar: '🚗', speedMultiplier: 46, color: 'bg-amber-500', progress: 0 },
    { id: 'b3', name: 'Lightning Leo', avatar: '🚀', speedMultiplier: 54, color: 'bg-rose-500', progress: 0 }
  ]);
  const [rank, setRank] = useState<number>(1);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initGame = () => {
    // Pick 20 words for the race
    const picked: string[] = [];
    for (let i = 0; i < 20; i++) {
      picked.push(WORDS_POOL[Math.floor(Math.random() * WORDS_POOL.length)]);
    }
    setWords(picked);
    setCurrentWordIdx(0);
    setInputValue('');
    setPlayerProgress(0);
    setElapsedTime(0);
    setBots([
      { id: 'b1', name: 'Turbo Tyler', avatar: '🏎️', speedMultiplier: 36 + Math.random() * 8, color: 'bg-emerald-500', progress: 0 },
      { id: 'b2', name: 'Pixel Penny', avatar: '🚗', speedMultiplier: 44 + Math.random() * 8, color: 'bg-amber-500', progress: 0 },
      { id: 'b3', name: 'Lightning Leo', avatar: '🚀', speedMultiplier: 52 + Math.random() * 8, color: 'bg-rose-500', progress: 0 }
    ]);
    setCountdown(3);
    setGameState('countdown');
  };

  // Countdown timer
  useEffect(() => {
    if (gameState === 'countdown') {
      if (countdown > 0) {
        const t = setTimeout(() => {
          setCountdown(prev => prev - 1);
          soundController.playKeyClick();
        }, 1000);
        return () => clearTimeout(t);
      } else {
        setGameState('racing');
        soundController.playSuccess();
        if (inputRef.current) inputRef.current.focus();
      }
    }
  }, [gameState, countdown]);

  // Race progression loop
  useEffect(() => {
    if (gameState === 'racing') {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 0.1);

        // Advance bots gradually based on their simulated WPM
        setBots(prevBots =>
          prevBots.map(bot => {
            if (bot.progress >= 100) return bot;
            const inc = (bot.speedMultiplier / 60) * 0.1 * 4; // normalized advance
            return {
              ...bot,
              progress: Math.min(100, bot.progress + inc)
            };
          })
        );
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Handle typing input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameState !== 'racing') return;
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;

    if (e.key === 'Backspace') {
      soundController.playKeyClick('backspace');
    } else if (e.key === ' ') {
      soundController.playKeyClick('space');
    } else if (e.key.length === 1) {
      soundController.playKeyClick('key');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'racing') return;
    const val = e.target.value.trim();
    const currentTarget = words[currentWordIdx];

    if (val === currentTarget) {
      const nextIdx = currentWordIdx + 1;
      setCurrentWordIdx(nextIdx);
      setInputValue('');

      const newProg = Math.min(100, Math.round((nextIdx / words.length) * 100));
      setPlayerProgress(newProg);

      if (nextIdx >= words.length) {
        finishRace();
      }
    } else {
      setInputValue(e.target.value);
    }
  };

  const finishRace = () => {
    setGameState('finished');
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate final rank
    const botFinishedCount = bots.filter(b => b.progress >= 100).length;
    const finalRank = botFinishedCount + 1;
    setRank(finalRank);

    const safeMinutes = Math.max(elapsedTime, 1) / 60;
    const wpm = Math.round((words.join(' ').length / 5) / safeMinutes);
    const score = Math.max(100, Math.round(1000 / finalRank + wpm * 10));

    soundController.playSuccess();
    try {
      confetti({ particleCount: 70, spread: 80 });
    } catch {}

    saveGameScore('racer', 'Typing Racer', score, wpm, 96);
  };

  const currentWpm = elapsedTime > 0
    ? Math.round(((words.slice(0, currentWordIdx).join(' ').length) / 5) / (elapsedTime / 60))
    : 0;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400 hover:underline mb-1"
          >
            ← Back to Games Hub
          </button>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>🏁</span> Typing Racer Championship
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Type each word swiftly to accelerate your car and beat the AI racers to the finish line!
          </p>
        </div>

        {gameState === 'racing' && (
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Gauge className="w-5 h-5 text-indigo-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Speed</span>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums tracking-tight">
                {currentWpm} WPM
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Track Arena */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Race Track Lanes */}
        <div className="flex flex-col gap-3 py-2">
          {/* Player Lane */}
          <div className="relative bg-slate-900/80 rounded-xl p-3 border border-indigo-500/30">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-medium mb-1">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" /> You (Player)
              </span>
              <span className="font-mono tabular-nums">{playerProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-8 rounded-lg relative overflow-hidden flex items-center px-2">
              {/* Finish line flag pattern */}
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-stripes-white-black opacity-30 border-l border-white/20" />
              
              <div
                className="absolute transition-all duration-150 flex items-center gap-1"
                style={{ left: `calc(${playerProgress}% - 28px)` }}
              >
                <span className="text-2xl drop-shadow-md">🏎️</span>
                <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded-full shadow">
                  P1
                </span>
              </div>
            </div>
          </div>

          {/* Bot Lanes */}
          {bots.map((bot, idx) => (
            <div key={bot.id} className="relative bg-slate-900/40 rounded-xl p-2.5 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                <span>{bot.name}</span>
                <span className="font-mono tabular-nums">{Math.round(bot.progress)}%</span>
              </div>
              <div className="w-full bg-slate-800/80 h-7 rounded-lg relative overflow-hidden flex items-center px-2">
                <div className="absolute right-0 top-0 bottom-0 w-6 bg-stripes-white-black opacity-20 border-l border-white/10" />
                <div
                  className="absolute transition-all duration-200 flex items-center gap-1"
                  style={{ left: `calc(${Math.min(94, bot.progress)}% - 24px)` }}
                >
                  <span className="text-xl">{bot.avatar}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Countdown Overlay */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center z-30">
            <span className="text-7xl font-extrabold text-amber-400 animate-bounce font-mono tabular-nums tracking-tight">
              {countdown > 0 ? countdown : 'GO!'}
            </span>
            <span className="text-xs sm:text-sm text-slate-300 mt-2 font-bold tracking-widest uppercase">
              Get ready to type...
            </span>
          </div>
        )}

        {/* Lobby Start Overlay */}
        {gameState === 'lobby' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center z-30 gap-4">
            <Trophy className="w-16 h-16 text-amber-400 animate-pulse" />
            <div className="text-center">
              <h3 className="text-2xl font-bold tracking-tight text-white">Typing Grand Prix</h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-sm mt-1">
                Compete in real time against AI drivers. Type each target word accurately to boost your speed.
              </p>
            </div>
            <button
              onClick={initGame}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wide rounded-xl shadow-lg shadow-indigo-500/40 flex items-center gap-2 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Race
            </button>
          </div>
        )}

        {/* Finished Podium Modal */}
        {gameState === 'finished' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-30 gap-4 p-6">
            <div className="w-20 h-20 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center ring-2 ring-amber-500/50">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="text-center">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                Race Results
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
                {rank === 1 ? '1st Place Champion! 🏆' : rank === 2 ? '2nd Place Podium! 🥈' : 'Race Completed! 🏁'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mt-1">
                You crossed the line in <strong className="font-mono text-white">{elapsedTime.toFixed(1)}s</strong> at an average of <strong className="font-mono text-indigo-400">{currentWpm} WPM</strong>.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={initGame}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold tracking-wide rounded-xl flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </button>
              <button
                onClick={onBack}
                className="px-5 py-2.5 border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold tracking-wide rounded-xl"
              >
                All Games
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Typing Input & Words Horizon */}
      {gameState === 'racing' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span>Word {currentWordIdx + 1} of {words.length}</span>
            <span>·</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              Type the word and hit Space
            </span>
          </div>

          {/* Current & Upcoming Words Strip */}
          <div className="flex items-center gap-3 overflow-hidden py-2 text-lg sm:text-xl font-mono tracking-[0.14em]">
            {words.slice(currentWordIdx, currentWordIdx + 6).map((word, idx) => (
              <span
                key={idx}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  idx === 0
                    ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400 scale-105'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Typing Field */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            placeholder={words[currentWordIdx] || 'Type here...'}
            className="w-full text-lg sm:text-xl font-mono tracking-[0.14em] px-4 py-3 rounded-xl border-2 border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:bg-slate-800 dark:text-white"
            autoFocus
          />
        </div>
      )}
    </div>
  );
};
