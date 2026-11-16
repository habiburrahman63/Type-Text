/**
 * Pure Typing Engine Math & Keystroke Analysis
 * Strictly decoupled from UI/DOM for unit testing and deterministic calculations.
 */

export interface TypingMetrics {
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  errorCount: number;
  uncorrectedErrors: number;
  elapsedSeconds: number;
  elapsedMinutes: number;
}

export interface CharacterMistake {
  expected: string;
  actual: string;
  timestamp: number;
}

/**
 * Standard WPM Formulas:
 * Standard typing word is defined internationally as 5 keystrokes (including spaces and punctuation).
 * Gross WPM = (Total Keystrokes / 5) / (Time in minutes)
 * Net WPM = ((Total Keystrokes / 5) - Uncorrected Errors) / (Time in minutes)
 * Accuracy = (Correct Keystrokes / Total Keystrokes) * 100
 */
export function calculateTypingMetrics(params: {
  totalKeystrokes: number;
  correctKeystrokes: number;
  uncorrectedErrors: number;
  elapsedSeconds: number;
}): TypingMetrics {
  const { totalKeystrokes, correctKeystrokes, uncorrectedErrors, elapsedSeconds } = params;

  // Protect against division by zero
  const safeSeconds = Math.max(elapsedSeconds, 1);
  const elapsedMinutes = safeSeconds / 60;

  const grossWpm = Math.round((totalKeystrokes / 5) / elapsedMinutes);
  const netWpm = Math.max(0, Math.round(((totalKeystrokes / 5) - uncorrectedErrors) / elapsedMinutes));
  
  const accuracy = totalKeystrokes > 0
    ? Math.min(100, Math.max(0, Math.round((correctKeystrokes / totalKeystrokes) * 100)))
    : 100;

  const errorCount = Math.max(0, totalKeystrokes - correctKeystrokes);

  return {
    grossWpm,
    netWpm,
    accuracy,
    totalKeystrokes,
    correctKeystrokes,
    errorCount,
    uncorrectedErrors,
    elapsedSeconds: safeSeconds,
    elapsedMinutes: Number(elapsedMinutes.toFixed(2))
  };
}

/**
 * Maps a keyboard character to its recommended finger placement.
 * Left Hand:
 *   LP: Left Pinky (1, Q, A, Z, ~, Tab, Caps, Left Shift)
 *   LR: Left Ring (2, W, S, X)
 *   LM: Left Middle (3, E, D, C)
 *   LI: Left Index (4, 5, R, T, F, G, V, B)
 *   LT: Left Thumb (Spacebar)
 * Right Hand:
 *   RT: Right Thumb (Spacebar)
 *   RI: Right Index (6, 7, Y, U, H, J, N, M)
 *   RM: Right Middle (8, I, K, , <)
 *   RR: Right Ring (9, O, L, . >)
 *   RP: Right Pinky (0, -, =, P, [, ], ;, ', Enter, Right Shift, /, ?)
 */
export type FingerPlacement = 'LP' | 'LR' | 'LM' | 'LI' | 'LT' | 'RT' | 'RI' | 'RM' | 'RR' | 'RP';

export const FINGER_NAMES: Record<FingerPlacement, string> = {
  LP: 'Left Pinky',
  LR: 'Left Ring',
  LM: 'Left Middle',
  LI: 'Left Index',
  LT: 'Left Thumb',
  RT: 'Right Thumb',
  RI: 'Right Index',
  RM: 'Right Middle',
  RR: 'Right Ring',
  RP: 'Right Pinky'
};

export function getRecommendedFinger(char: string): { finger: FingerPlacement; fingerName: string; hand: 'left' | 'right' } {
  const upper = char.toUpperCase();
  
  if (char === ' ') {
    return { finger: 'RT', fingerName: FINGER_NAMES.RT, hand: 'right' };
  }

  // Left Pinky
  if (['1', '!', 'Q', 'A', 'Z', '`', '~'].includes(upper)) {
    return { finger: 'LP', fingerName: FINGER_NAMES.LP, hand: 'left' };
  }
  // Left Ring
  if (['2', '@', 'W', 'S', 'X'].includes(upper)) {
    return { finger: 'LR', fingerName: FINGER_NAMES.LR, hand: 'left' };
  }
  // Left Middle
  if (['3', '#', 'E', 'D', 'C'].includes(upper)) {
    return { finger: 'LM', fingerName: FINGER_NAMES.LM, hand: 'left' };
  }
  // Left Index
  if (['4', '$', '5', '%', 'R', 'T', 'F', 'G', 'V', 'B'].includes(upper)) {
    return { finger: 'LI', fingerName: FINGER_NAMES.LI, hand: 'left' };
  }

  // Right Index
  if (['6', '^', '7', '&', 'Y', 'U', 'H', 'J', 'N', 'M'].includes(upper)) {
    return { finger: 'RI', fingerName: FINGER_NAMES.RI, hand: 'right' };
  }
  // Right Middle
  if (['8', '*', 'I', 'K', ',', '<'].includes(upper)) {
    return { finger: 'RM', fingerName: FINGER_NAMES.RM, hand: 'right' };
  }
  // Right Ring
  if (['9', '(', 'O', 'L', '.', '>'].includes(upper)) {
    return { finger: 'RR', fingerName: FINGER_NAMES.RR, hand: 'right' };
  }
  // Right Pinky
  if (['0', ')', '-', '_', '=', '+', 'P', '[', '{', ']', '}', '\\', '|', ';', ':', "'", '"', '/', '?'].includes(upper)) {
    return { finger: 'RP', fingerName: FINGER_NAMES.RP, hand: 'right' };
  }

  return { finger: 'RI', fingerName: FINGER_NAMES.RI, hand: 'right' };
}

/**
 * Evaluates lesson completion performance and star rating (1-3 stars)
 */
export function evaluateLessonResult(params: {
  targetWpm: number;
  actualWpm: number;
  actualAccuracy: number;
  minAccuracy?: number;
}): { passed: boolean; stars: number; feedback: string } {
  const { targetWpm, actualWpm, actualAccuracy, minAccuracy = 85 } = params;

  if (actualAccuracy < minAccuracy) {
    return {
      passed: false,
      stars: 0,
      feedback: `Accuracy was ${actualAccuracy}%. Reach at least ${minAccuracy}% to pass.`
    };
  }

  let stars = 1;
  if (actualWpm >= targetWpm && actualAccuracy >= 95) {
    stars = 3;
  } else if (actualWpm >= targetWpm * 0.85 && actualAccuracy >= 90) {
    stars = 2;
  }

  const feedback = stars === 3
    ? 'Mastery achieved! Flawless speed and accuracy.'
    : stars === 2
    ? 'Great job! Strong rhythm and solid control.'
    : 'Lesson passed! Keep practicing to boost your speed.';

  return {
    passed: true,
    stars,
    feedback
  };
}
