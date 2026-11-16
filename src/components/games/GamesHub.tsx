import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TypingRacer } from './TypingRacer';
import { WordRain } from './WordRain';
import { WordShooter } from './WordShooter';
import { Gamepad2, Trophy, Zap, Flag, Shield, Sparkles, Flame, Target } from 'lucide-react';

export const GamesHub: React.FC = () => {
  const { gameScores } = useApp();
  const [activeGame, setActiveGame] = useState<'hub' | 'racer' | 'rain' | 'shooter'>('hub');

  if (activeGame === 'racer') {
    return <TypingRacer onBack={() => setActiveGame('hub')} />;
  }
  if (activeGame === 'rain') {
    return <WordRain onBack={() => setActiveGame('hub')} />;
  }
  if (activeGame === 'shooter') {
    return <WordShooter onBack={() => setActiveGame('hub')} />;
  }

  const GAMES = [
    {
      id: 'racer',
      title: 'Typing Racer',
      badge: 'Multiplayer Bot Race',
      description: 'Accelerate your nitro sports car along the track by typing target words faster than computer rivals.',
      icon: '🏁',
      gradient: 'from-indigo-600 to-blue-700',
      skill: 'Speed & Rhythm Cadence'
    },
    {
      id: 'rain',
      title: 'Word Rain',
      badge: 'Arcade Sky Defense',
      description: 'Vaporize words falling from atmospheric clouds before they strike and breach your energy defense perimeter.',
      icon: '🌧️',
      gradient: 'from-sky-500 to-cyan-600',
      skill: 'Reflexes & Reaction Speed'
    },
    {
      id: 'shooter',
      title: 'Space Defense Blaster',
      badge: 'Action Shooter',
      description: 'Target approaching alien spacecraft and fire high-energy intercept lasers by typing cosmic call-signs.',
      icon: '🚀',
      gradient: 'from-purple-600 to-indigo-800',
      skill: 'Burst Speed & Accuracy'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Playable Typing Games
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Typing Arcade & Battle Arena
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-1 max-w-xl">
            Gamified exercises designed to elevate muscle memory, peripheral vision, and keystroke burst speed while having fun.
          </p>
        </div>

        {/* Global Games Stats */}
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <Trophy className="w-6 h-6 text-amber-500" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Games Played</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {gameScores.length}
            </span>
          </div>
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {GAMES.map(game => (
          <div
            key={game.id}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                  {game.icon}
                </span>
                <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-200 dark:border-indigo-800">
                  {game.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                {game.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {game.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate min-w-0">
                Focus: <strong className="font-semibold text-slate-700 dark:text-slate-300">{game.skill}</strong>
              </span>

              <button
                onClick={() => setActiveGame(game.id as 'racer' | 'rain' | 'shooter')}
                className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white text-xs font-bold tracking-wide rounded-xl transition-all shadow-md whitespace-nowrap shrink-0"
              >
                Play Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Scores & Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Recent Game Records & High Scores
        </h3>

        {gameScores.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">
            No games played yet. Jump into an arcade game above to record your first score!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="pb-3">Game</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Speed (WPM)</th>
                  <th className="pb-3">Accuracy</th>
                  <th className="pb-3">Played</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {gameScores.map(score => (
                  <tr key={score.id} className="text-slate-700 dark:text-slate-300">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      {score.gameName}
                    </td>
                    <td className="py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {score.score} pts
                    </td>
                    <td className="py-3 font-mono tabular-nums">
                      {score.wpm} WPM
                    </td>
                    <td className="py-3 font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                      {score.accuracy}%
                    </td>
                    <td className="py-3 text-xs text-slate-400 tabular-nums">
                      {score.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
