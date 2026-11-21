import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { soundController } from '../../utils/audio';
import { Play, RotateCcw, Crosshair, Zap, ShieldAlert, Award } from 'lucide-react';

interface TargetWord {
  id: number;
  word: string;
  x: number;
  y: number;
  distance: number; // 100 to 0 (closer)
}

const SPACE_WORDS = [
  'laser', 'plasma', 'rocket', 'galaxy', 'orbit', 'nebula', 'pulsar', 'quasar',
  'shield', 'energy', 'photon', 'atomic', 'fusion', 'thrust', 'matrix', 'cosmos'
];

export const WordShooter: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { saveGameScore } = useApp();
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'gameover'>('lobby');
  const [targets, setTargets] = useState<TargetWord[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [health, setHealth] = useState<number>(100);

  const inputRef = useRef<HTMLInputElement>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setScore(0);
    setHealth(100);
    setTargets([
      { id: 1, word: 'laser', x: 25, y: 30, distance: 90 },
      { id: 2, word: 'orbit', x: 70, y: 35, distance: 80 }
    ]);
    setCurrentInput('');
    setGameState('playing');
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(() => {
        setTargets(prev => {
          let damaged = 0;
          const updated: TargetWord[] = [];

          for (const t of prev) {
            const nextDist = t.distance - 2;
            if (nextDist <= 10) {
              damaged += 15;
            } else {
              updated.push({ ...t, distance: nextDist });
            }
          }

          if (damaged > 0) {
            soundController.playError();
            setHealth(h => {
              const nextH = h - damaged;
              if (nextH <= 0) {
                gameOver();
                return 0;
              }
              return nextH;
            });
          }

          // Randomly spawn new targets if below 4
          if (updated.length < 3 && Math.random() < 0.25) {
            const word = SPACE_WORDS[Math.floor(Math.random() * SPACE_WORDS.length)];
            updated.push({
              id: Date.now() + Math.random(),
              word,
              x: 15 + Math.random() * 70,
              y: 20 + Math.random() * 40,
              distance: 100
            });
          }

          return updated;
        });
      }, 300);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    const val = e.target.value.trim().toLowerCase();
    setCurrentInput(e.target.value);

    const hitIdx = targets.findIndex(t => t.word === val);
    if (hitIdx !== -1) {
      soundController.playSuccess();
      const hit = targets[hitIdx];
      setTargets(prev => prev.filter(t => t.id !== hit.id));
      setCurrentInput('');
      setScore(s => s + 150);
    }
  };

  const gameOver = () => {
    setGameState('gameover');
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    saveGameScore('shooter', 'Space Defense', score, Math.round(score / 25), 95);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400 hover:underline mb-1"
          >
            ← Back to Games Hub
          </button>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>🚀</span> Word Blaster: Space Defense
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Target approaching alien drones and fire lasers by typing their call signs!
          </p>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-6 bg-white dark:bg-slate-900 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Hull Shield</span>
              <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full transition-all duration-300 ${health > 50 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${health}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Points</span>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums tracking-tight">
                {score}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="relative w-full h-[460px] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between p-6">
        {/* Targets */}
        <div className="relative w-full h-full">
          {targets.map(target => {
            const scale = 0.8 + (100 - target.distance) / 100 * 0.5;
            const isMatch = target.word.startsWith(currentInput.trim().toLowerCase()) && currentInput.trim().length > 0;
            return (
              <div
                key={target.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 transition-all duration-300"
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  transform: `scale(${scale})`
                }}
              >
                <div className={`p-2 rounded-full border-2 ${isMatch ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400' : 'bg-rose-500/10 border-rose-500/60'}`}>
                  <Crosshair className={`w-6 h-6 ${isMatch ? 'text-amber-400 animate-spin' : 'text-rose-500'}`} />
                </div>
                <span className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-bold tracking-tight shadow ${isMatch ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 text-white border border-slate-700'}`}>
                  {target.word}
                </span>
              </div>
            );
          })}
        </div>

        {/* Player Laser Base */}
        <div className="w-full flex justify-center pb-2">
          <div className="flex flex-col items-center">
            <div className="w-12 h-6 bg-indigo-600 rounded-t-xl border-t-2 border-indigo-400 shadow-lg shadow-indigo-500/50 flex items-center justify-center text-xs text-white">
              ▲
            </div>
            <div className="w-24 h-4 bg-slate-800 rounded-md border border-slate-700" />
          </div>
        </div>

        {gameState === 'lobby' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center z-30 gap-4">
            <Zap className="w-16 h-16 text-indigo-400 animate-pulse" />
            <div className="text-center">
              <h3 className="text-2xl font-bold tracking-tight text-white">Space Defense Protocol</h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-sm mt-1">
                Incoming cosmic drones are approaching. Type each drone's keyword to fire laser intercepts!
              </p>
            </div>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wide rounded-xl shadow-lg flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              Engage Defense
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-30 gap-4 p-6">
            <div className="text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-rose-400">
                Defense Breach
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">Game Over</h3>
              <p className="text-sm text-slate-300 leading-relaxed mt-1">
                You defended the galaxy with <strong className="font-mono text-indigo-400">{score}</strong> points!
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={startGame}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold tracking-wide rounded-xl flex items-center gap-2"
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

      {gameState === 'playing' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            placeholder="Type target keywords to fire..."
            className="flex-1 text-lg sm:text-xl font-mono tracking-[0.14em] px-4 py-3 rounded-xl border-2 border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:bg-slate-800 dark:text-white"
            autoFocus
          />
        </div>
      )}
    </div>
  );
};
