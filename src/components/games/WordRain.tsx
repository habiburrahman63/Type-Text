import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { soundController } from '../../utils/audio';
import { Play, RotateCcw, Heart, Shield, Sparkles, Award } from 'lucide-react';

interface FallingWord {
  id: number;
  text: string;
  x: number; // percentage from left (5% to 85%)
  y: number; // percentage from top (0% to 100%)
  speed: number;
}

const RAIN_VOCABULARY = [
  'cloud', 'storm', 'drop', 'water', 'stream', 'river', 'frost', 'crystal',
  'flash', 'splash', 'thunder', 'lightning', 'breeze', 'current', 'flow',
  'ocean', 'tide', 'ripple', 'cascade', 'monsoon', 'rainbow', 'vapor', 'mist'
];

export const WordRain: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { saveGameScore } = useApp();
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'gameover'>('lobby');
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [typedInput, setTypedInput] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [difficultyLevel, setDifficultyLevel] = useState<number>(1);

  const inputRef = useRef<HTMLInputElement>(null);
  const loopRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setFallingWords([]);
    setTypedInput('');
    setDifficultyLevel(1);
    setGameState('playing');
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  // Word spawner
  useEffect(() => {
    if (gameState === 'playing') {
      const spawnInterval = Math.max(1200, 2400 - difficultyLevel * 200);
      spawnRef.current = setInterval(() => {
        const randomWord = RAIN_VOCABULARY[Math.floor(Math.random() * RAIN_VOCABULARY.length)];
        const newWord: FallingWord = {
          id: Date.now() + Math.random(),
          text: randomWord,
          x: 10 + Math.random() * 75,
          y: 0,
          speed: 0.5 + Math.random() * 0.4 + difficultyLevel * 0.1
        };
        setFallingWords(prev => [...prev, newWord]);
      }, spawnInterval);
    }
    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [gameState, difficultyLevel]);

  // Game physics loop (falling words & ground hit check)
  useEffect(() => {
    if (gameState === 'playing') {
      loopRef.current = setInterval(() => {
        setFallingWords(prevWords => {
          const nextWords: FallingWord[] = [];
          let lostLife = false;

          for (const word of prevWords) {
            const nextY = word.y + word.speed;
            if (nextY >= 92) {
              // Word hit bottom hazard line!
              lostLife = true;
            } else {
              nextWords.push({ ...word, y: nextY });
            }
          }

          if (lostLife) {
            soundController.playError();
            setLives(l => {
              const remaining = l - 1;
              if (remaining <= 0) {
                gameOver();
              }
              return Math.max(0, remaining);
            });
          }

          return nextWords;
        });
      }, 50);
    }
    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, [gameState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim().toLowerCase();
    setTypedInput(e.target.value);

    // Check if input matches any falling word
    const matchedIdx = fallingWords.findIndex(w => w.text.toLowerCase() === val);
    if (matchedIdx !== -1) {
      const matched = fallingWords[matchedIdx];
      soundController.playKeyClick();
      setFallingWords(prev => prev.filter(w => w.id !== matched.id));
      setTypedInput('');
      setScore(s => {
        const nextScore = s + matched.text.length * 10;
        if (nextScore > difficultyLevel * 200) {
          setDifficultyLevel(d => d + 1);
        }
        return nextScore;
      });
    }
  };

  const gameOver = () => {
    setGameState('gameover');
    if (loopRef.current) clearInterval(loopRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    soundController.playError();
    saveGameScore('rain', 'Word Rain', score, Math.round(score / 20), 94);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400 hover:underline mb-1"
          >
            ← Back to Games Hub
          </button>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>🌧️</span> Word Rain Defense
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Type falling words before they strike the defense barrier!
          </p>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-6 bg-white dark:bg-slate-900 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-1.5 text-rose-500 font-bold">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 ${i < lives ? 'fill-current' : 'opacity-20 text-slate-400'}`}
                />
              ))}
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Score</span>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums tracking-tight">
                {score}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Falling Sky Canvas */}
      <div className="relative w-full h-[460px] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Falling Words */}
        {fallingWords.map(word => {
          const isTargeted = word.text.startsWith(typedInput.trim().toLowerCase()) && typedInput.trim().length > 0;
          return (
            <div
              key={word.id}
              className={`absolute transform -translate-x-1/2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold tracking-tight shadow-lg transition-transform ${
                isTargeted
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-110 z-10'
                  : 'bg-slate-800/90 text-sky-200 border border-sky-400/30'
              }`}
              style={{ left: `${word.x}%`, top: `${word.y}%` }}
            >
              {word.text}
            </div>
          );
        })}

        {/* Hazard Shield Line at Bottom */}
        <div className="absolute bottom-10 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)] flex items-center justify-center">
          <span className="px-3 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-slate-900 bg-amber-400 rounded-full shadow -translate-y-2">
            Defense Perimeter
          </span>
        </div>

        {/* Lobby State */}
        {gameState === 'lobby' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center z-30 gap-4">
            <div className="w-16 h-16 bg-sky-500/20 text-sky-400 rounded-2xl flex items-center justify-center ring-2 ring-sky-500/30">
              <Shield className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold tracking-tight text-white">Word Rain Sky Patrol</h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-sm mt-1">
                Words fall from the sky. Type the matching word to vaporize it before it breaches your perimeter.
              </p>
            </div>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold tracking-wide rounded-xl shadow-lg shadow-sky-500/30 flex items-center gap-2 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Patrol
            </button>
          </div>
        )}

        {/* Game Over State */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-30 gap-4 p-6">
            <div className="text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-rose-400">
                Shield Depleted
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">Game Over</h3>
              <p className="text-sm text-slate-300 leading-relaxed mt-1">
                You defended the sky with a score of <strong className="font-mono text-amber-400">{score}</strong> points!
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={startGame}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold tracking-wide rounded-xl flex items-center gap-2 shadow-lg"
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

      {/* Input Bar */}
      {gameState === 'playing' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <input
            ref={inputRef}
            type="text"
            value={typedInput}
            onChange={handleInputChange}
            placeholder="Type falling words..."
            className="flex-1 text-lg sm:text-xl font-mono tracking-tight px-4 py-3 rounded-xl border-2 border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20 dark:bg-slate-800 dark:text-white"
            autoFocus
          />
        </div>
      )}
    </div>
  );
};
