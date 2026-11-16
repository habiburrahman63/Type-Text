/**
 * Gamification, XP Levels, Badges and Achievements logic
 * Decoupled from UI for testing and server sync.
 */

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'speed' | 'accuracy' | 'streak' | 'lessons' | 'games';
  requirement: string;
}

export const ALL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'first_lesson',
    name: 'First Steps',
    description: 'Completed your very first typing exercise.',
    icon: 'Sparkles',
    category: 'lessons',
    requirement: 'Complete 1 lesson'
  },
  {
    id: 'speed_20',
    name: 'Cadence Starter',
    description: 'Clocked a typing speed of 20+ Words Per Minute.',
    icon: 'Zap',
    category: 'speed',
    requirement: '20+ WPM'
  },
  {
    id: 'speed_40',
    name: 'Swift Fingers',
    description: 'Clocked a typing speed of 40+ Words Per Minute.',
    icon: 'Flame',
    category: 'speed',
    requirement: '40+ WPM'
  },
  {
    id: 'speed_60',
    name: 'Rapid Typist',
    description: 'Achieved 60+ WPM, matching professional office standard.',
    icon: 'Gauge',
    category: 'speed',
    requirement: '60+ WPM'
  },
  {
    id: 'speed_80',
    name: 'Velocity Master',
    description: 'Broke through 80+ Words Per Minute.',
    icon: 'Trophy',
    category: 'speed',
    requirement: '80+ WPM'
  },
  {
    id: 'speed_100',
    name: 'Century Club',
    description: 'Elite typist level: reached 100+ Words Per Minute.',
    icon: 'Crown',
    category: 'speed',
    requirement: '100+ WPM'
  },
  {
    id: 'accuracy_95',
    name: 'Sharp Precision',
    description: 'Maintained 95%+ accuracy in a completed lesson or test.',
    icon: 'Target',
    category: 'accuracy',
    requirement: '95%+ Accuracy'
  },
  {
    id: 'accuracy_99',
    name: 'Laser Precision',
    description: 'Achieved virtually flawless 99%+ accuracy.',
    icon: 'Crosshair',
    category: 'accuracy',
    requirement: '99%+ Accuracy'
  },
  {
    id: 'streak_3',
    name: 'Habit Builder',
    description: 'Practiced 3 days in a row.',
    icon: 'Calendar',
    category: 'streak',
    requirement: '3-Day Streak'
  },
  {
    id: 'streak_7',
    name: 'Weekly Devotion',
    description: 'Maintained a solid 7-day practice streak.',
    icon: 'Award',
    category: 'streak',
    requirement: '7-Day Streak'
  },
  {
    id: 'game_victor',
    name: 'Arcade Champion',
    description: 'Scored high rank in any typing mini-game.',
    icon: 'Gamepad2',
    category: 'games',
    requirement: 'Win or score 500+ in games'
  },
  {
    id: 'digital_literate',
    name: 'Digital Citizen',
    description: 'Completed a digital literacy and computer safety module.',
    icon: 'ShieldCheck',
    category: 'lessons',
    requirement: 'Complete 1 digital module'
  }
];

/**
 * Calculates user level based on cumulative experience points (XP).
 * Formula: Level = floor(sqrt(XP / 100)) + 1
 */
export function calculateLevelFromXp(xp: number): {
  level: number;
  title: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  const safeXp = Math.max(0, xp);
  // Level threshold math:
  // Level 1: 0 - 99 XP
  // Level 2: 100 - 399 XP
  // Level 3: 400 - 899 XP
  // Level L: (L-1)^2 * 100
  const level = Math.floor(Math.sqrt(safeXp / 100)) + 1;
  const currentBaseXp = Math.pow(level - 1, 2) * 100;
  const nextBaseXp = Math.pow(level, 2) * 100;
  const xpInCurrentLevel = safeXp - currentBaseXp;
  const xpNeededForNext = nextBaseXp - currentBaseXp;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));

  const TITLES = [
    'Keyboard Explorer',
    'Home Row Apprentice',
    'Key Navigator',
    'Rhythm Seeker',
    'Touch Typist',
    'Keystroke Specialist',
    'Accuracy Virtuoso',
    'Speed Tactician',
    'Velocity Maestro',
    'Keyboard Grandmaster'
  ];

  const title = TITLES[Math.min(TITLES.length - 1, level - 1)];

  return {
    level,
    title,
    currentLevelXp: safeXp,
    nextLevelXp: nextBaseXp,
    progressPercent
  };
}

/**
 * Calculates XP earned from an activity
 */
export function calculateXpEarned(params: {
  wpm: number;
  accuracy: number;
  durationSeconds: number;
  isTest?: boolean;
}): number {
  const { wpm, accuracy, durationSeconds, isTest = false } = params;
  
  let base = Math.round(durationSeconds * 0.5); // ~30 XP per minute
  
  // WPM bonus
  if (wpm >= 80) base += 50;
  else if (wpm >= 60) base += 35;
  else if (wpm >= 40) base += 20;
  else if (wpm >= 20) base += 10;

  // Accuracy bonus
  if (accuracy >= 98) base += 40;
  else if (accuracy >= 95) base += 25;
  else if (accuracy >= 90) base += 10;

  if (isTest) {
    base = Math.round(base * 1.5);
  }

  return Math.max(10, base);
}

/**
 * Generates a unique verifiable certificate identifier
 */
export function generateCertificateId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TYP-${timestamp}-${random}`;
}
