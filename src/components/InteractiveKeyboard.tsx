import React from 'react';
import { getRecommendedFinger, FINGER_NAMES, FingerPlacement } from '../utils/typingEngine';

interface InteractiveKeyboardProps {
  activeChar: string;
  isShiftRequired?: boolean;
}

interface KeyConfig {
  label: string;
  subLabel?: string;
  code: string;
  finger: FingerPlacement;
  width?: string;
}

const KEYBOARD_ROWS: KeyConfig[][] = [
  // Number Row
  [
    { label: '`', subLabel: '~', code: 'Backquote', finger: 'LP' },
    { label: '1', subLabel: '!', code: 'Digit1', finger: 'LP' },
    { label: '2', subLabel: '@', code: 'Digit2', finger: 'LR' },
    { label: '3', subLabel: '#', code: 'Digit3', finger: 'LM' },
    { label: '4', subLabel: '$', code: 'Digit4', finger: 'LI' },
    { label: '5', subLabel: '%', code: 'Digit5', finger: 'LI' },
    { label: '6', subLabel: '^', code: 'Digit6', finger: 'RI' },
    { label: '7', subLabel: '&', code: 'Digit7', finger: 'RI' },
    { label: '8', subLabel: '*', code: 'Digit8', finger: 'RM' },
    { label: '9', subLabel: '(', code: 'Digit9', finger: 'RR' },
    { label: '0', subLabel: ')', code: 'Digit0', finger: 'RP' },
    { label: '-', subLabel: '_', code: 'Minus', finger: 'RP' },
    { label: '=', subLabel: '+', code: 'Equal', finger: 'RP' },
    { label: 'delete', code: 'Backspace', finger: 'RP', width: 'w-16 md:w-20' },
  ],
  // Top Letter Row
  [
    { label: 'tab', code: 'Tab', finger: 'LP', width: 'w-14 md:w-16' },
    { label: 'q', code: 'KeyQ', finger: 'LP' },
    { label: 'w', code: 'KeyW', finger: 'LR' },
    { label: 'e', code: 'KeyE', finger: 'LM' },
    { label: 'r', code: 'KeyR', finger: 'LI' },
    { label: 't', code: 'KeyT', finger: 'LI' },
    { label: 'y', code: 'KeyY', finger: 'RI' },
    { label: 'u', code: 'KeyU', finger: 'RI' },
    { label: 'i', code: 'KeyI', finger: 'RM' },
    { label: 'o', code: 'KeyO', finger: 'RR' },
    { label: 'p', code: 'KeyP', finger: 'RP' },
    { label: '[', subLabel: '{', code: 'BracketLeft', finger: 'RP' },
    { label: ']', subLabel: '}', code: 'BracketRight', finger: 'RP' },
    { label: '\\', subLabel: '|', code: 'Backslash', finger: 'RP', width: 'w-12 md:w-14' },
  ],
  // Home Row
  [
    { label: 'caps lock', code: 'CapsLock', finger: 'LP', width: 'w-16 md:w-20' },
    { label: 'a', code: 'KeyA', finger: 'LP' },
    { label: 's', code: 'KeyS', finger: 'LR' },
    { label: 'd', code: 'KeyD', finger: 'LM' },
    { label: 'f', code: 'KeyF', finger: 'LI' }, // nub
    { label: 'g', code: 'KeyG', finger: 'LI' },
    { label: 'h', code: 'KeyH', finger: 'RI' },
    { label: 'j', code: 'KeyJ', finger: 'RI' }, // nub
    { label: 'k', code: 'KeyK', finger: 'RM' },
    { label: 'l', code: 'KeyL', finger: 'RR' },
    { label: ';', subLabel: ':', code: 'Semicolon', finger: 'RP' },
    { label: "'", subLabel: '"', code: 'Quote', finger: 'RP' },
    { label: 'return', code: 'Enter', finger: 'RP', width: 'w-16 md:w-20' },
  ],
  // Bottom Row
  [
    { label: 'shift', code: 'ShiftLeft', finger: 'LP', width: 'w-20 md:w-24' },
    { label: 'z', code: 'KeyZ', finger: 'LP' },
    { label: 'x', code: 'KeyX', finger: 'LR' },
    { label: 'c', code: 'KeyC', finger: 'LM' },
    { label: 'v', code: 'KeyV', finger: 'LI' },
    { label: 'b', code: 'KeyB', finger: 'LI' },
    { label: 'n', code: 'KeyN', finger: 'RI' },
    { label: 'm', code: 'KeyM', finger: 'RI' },
    { label: ',', subLabel: '<', code: 'Comma', finger: 'RM' },
    { label: '.', subLabel: '>', code: 'Period', finger: 'RR' },
    { label: '/', subLabel: '?', code: 'Slash', finger: 'RP' },
    { label: 'shift', code: 'ShiftRight', finger: 'RP', width: 'w-20 md:w-24' },
  ],
  // Spacebar Row
  [
    { label: 'control', code: 'ControlLeft', finger: 'LP', width: 'w-12 md:w-16' },
    { label: 'alt', code: 'AltLeft', finger: 'LT', width: 'w-12 md:w-14' },
    { label: 'space', code: 'Space', finger: 'RT', width: 'flex-1 max-w-sm md:max-w-md' },
    { label: 'alt', code: 'AltRight', finger: 'RT', width: 'w-12 md:w-14' },
    { label: 'control', code: 'ControlRight', finger: 'RP', width: 'w-12 md:w-16' },
  ]
];

const FINGER_BG_HINTS: Record<FingerPlacement, string> = {
  LP: 'border-b-2 border-b-rose-400/70',
  LR: 'border-b-2 border-b-amber-400/70',
  LM: 'border-b-2 border-b-emerald-400/70',
  LI: 'border-b-2 border-b-sky-400/70',
  LT: 'border-b-2 border-b-indigo-400/70',
  RT: 'border-b-2 border-b-indigo-400/70',
  RI: 'border-b-2 border-b-sky-400/70',
  RM: 'border-b-2 border-b-emerald-400/70',
  RR: 'border-b-2 border-b-amber-400/70',
  RP: 'border-b-2 border-b-rose-400/70'
};

export const InteractiveKeyboard: React.FC<InteractiveKeyboardProps> = ({
  activeChar,
  isShiftRequired = false
}) => {
  const currentFingerInfo = getRecommendedFinger(activeChar || ' ');
  const targetChar = activeChar === ' ' ? 'space' : activeChar.toLowerCase();

  const isKeyActive = (key: KeyConfig) => {
    if (activeChar === ' ' && key.code === 'Space') return true;
    if (targetChar === key.label.toLowerCase()) return true;
    if (key.subLabel && activeChar === key.subLabel) return true;
    if (isShiftRequired && (key.code === 'ShiftLeft' || key.code === 'ShiftRight')) {
      // Use opposite shift if left hand types char
      return currentFingerInfo.hand === 'left' ? key.code === 'ShiftRight' : key.code === 'ShiftLeft';
    }
    return false;
  };

  return (
    <div className="w-full select-none bg-slate-900/90 dark:bg-slate-950 p-3 md:p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
      {/* Top HUD: Current Key & Finger Guidance */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">Target Key:</span>
          <span className="px-2.5 py-1 font-mono font-bold text-sm bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-md tracking-normal">
            {activeChar === ' ' ? 'Spacebar ␣' : activeChar === '\n' ? 'Enter ↵' : activeChar}
          </span>
          {isShiftRequired && (
            <span className="text-amber-400 font-semibold text-xs tracking-tight">+ Hold Shift</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">Finger Placement:</span>
          <span className="font-bold text-sky-400 tracking-tight">
            {currentFingerInfo.fingerName}
          </span>
          <span className="text-slate-500">
            ({currentFingerInfo.hand === 'left' ? 'Left Hand' : 'Right Hand'})
          </span>
        </div>
      </div>

      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5 md:gap-2">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 md:gap-1.5">
            {row.map((key, kIdx) => {
              const active = isKeyActive(key);
              const isHomeNub = key.label === 'f' || key.label === 'j';

              return (
                <div
                  key={kIdx}
                  className={`
                    relative flex flex-col items-center justify-center h-10 md:h-12 rounded-lg text-xs font-mono font-semibold tracking-tight transition-all duration-150
                    ${key.width || 'w-8 sm:w-10 md:w-12'}
                    ${
                      active
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-105 z-10 ring-2 ring-indigo-400'
                        : 'bg-slate-800/90 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60'
                    }
                    ${FINGER_BG_HINTS[key.finger]}
                  `}
                >
                  {key.subLabel ? (
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-[10px] text-slate-400 font-normal leading-none mb-0.5">{key.subLabel}</span>
                      <span className="text-xs font-bold leading-none">{key.label.toUpperCase()}</span>
                    </div>
                  ) : (
                    <span className="capitalize leading-none">{key.label}</span>
                  )}

                  {/* Home Row Tactile Bumps Indicator */}
                  {isHomeNub && (
                    <div className="absolute bottom-1 w-2.5 h-0.5 rounded-full bg-slate-400/80" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Hands Diagram / Legend Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">Finger Guide:</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> Pinky</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Ring</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Middle</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400" /> Index</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400" /> Thumb</span>
        </div>
        <div className="text-slate-400 hidden sm:block tracking-tight text-[11px]">
          Keep wrists neutral · Let fingertips float above the home row
        </div>
      </div>
    </div>
  );
};
