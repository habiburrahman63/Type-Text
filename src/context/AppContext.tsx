import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Lesson } from '../data/curriculum';
import { calculateXpEarned, generateCertificateId } from '../utils/gamification';
import { soundController } from '../utils/audio';

export type UserRole = 'student' | 'teacher' | 'school_admin' | 'super_admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  schoolName: string;
  gradeLevel?: string;
  targetWpm: number;
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  password?: string;
}

export interface LessonProgressRecord {
  lessonId: string;
  stars: number;
  bestWpm: number;
  bestAccuracy: number;
  completedAt: string;
}

export interface TypingTestRecord {
  id: string;
  passageTitle: string;
  category: string;
  durationSeconds: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  errorCount: number;
  timestamp: string;
}

export interface CertificateRecord {
  id: string;
  title: string;
  recipientName: string;
  awardType: 'speed_benchmark' | 'curriculum_diploma' | 'digital_scholar';
  wpm: number;
  accuracy: number;
  issuedDate: string;
  verificationCode: string;
}

export interface Classroom {
  id: string;
  name: string;
  grade: string;
  code: string;
  teacherId: string;
  teacherName: string;
  studentCount: number;
  averageWpm: number;
  students: {
    id: string;
    name: string;
    email: string;
    wpm: number;
    accuracy: number;
    completedLessons: number;
    lastActive: string;
  }[];
  assignments: ClassroomAssignment[];
}

export interface ClassroomAssignment {
  id: string;
  title: string;
  classroomId: string;
  type: 'lesson' | 'test';
  targetId: string;
  dueDate: string;
  targetWpm: number;
  minAccuracy: number;
  completedCount: number;
  totalCount: number;
}

export interface GameScore {
  id: string;
  gameId: 'racer' | 'rain' | 'ninja' | 'shooter';
  gameName: string;
  score: number;
  wpm: number;
  accuracy: number;
  date: string;
}

export interface UserPersonalData {
  lessonProgress: Record<string, LessonProgressRecord>;
  testHistory: TypingTestRecord[];
  certificates: CertificateRecord[];
  gameScores: GameScore[];
  unlockedAchievements: string[];
}

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  registeredUsers: UserProfile[];
  
  // Appearance & Audio
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  
  // Auth
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  loginUser: (emailOrName: string, password?: string) => { success: boolean; message?: string; user?: UserProfile };
  registerUser: (payload: {
    name: string;
    email: string;
    password?: string;
    schoolName?: string;
    role?: UserRole;
    gradeLevel?: string;
    targetWpm?: number;
  }) => { success: boolean; message?: string; user?: UserProfile };
  logout: () => void;
  
  // User-Specific Progress & Stats
  lessonProgress: Record<string, LessonProgressRecord>;
  saveLessonProgress: (lessonId: string, wpm: number, accuracy: number, stars: number) => void;
  testHistory: TypingTestRecord[];
  saveTestResult: (record: Omit<TypingTestRecord, 'id' | 'timestamp'>) => TypingTestRecord & { certificate?: CertificateRecord };
  certificates: CertificateRecord[];
  issueCertificate: (title: string, awardType: CertificateRecord['awardType'], wpm: number, accuracy: number) => CertificateRecord;
  gameScores: GameScore[];
  saveGameScore: (gameId: GameScore['gameId'], gameName: string, score: number, wpm: number, accuracy: number) => void;
  
  // Achievements & XP
  unlockedAchievements: string[];
  addXp: (amount: number) => void;
  
  // Classrooms & Institutions
  classrooms: Classroom[];
  createClassroom: (name: string, grade: string) => Classroom;
  joinClassroom: (code: string) => boolean;
  createAssignment: (classroomId: string, title: string, type: 'lesson' | 'test', targetId: string, dueDate: string, targetWpm: number) => void;
  
  // Custom Lessons
  customLessons: Lesson[];
  addCustomLesson: (lesson: Omit<Lesson, 'id' | 'level' | 'order'>) => Lesson;
}

// Built-in Default Users
export const DEFAULT_USERS: Record<UserRole, UserProfile> = {
  student: {
    id: 'usr_student_01',
    name: 'Jordan Lee',
    email: 'student@school.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=JordanLee',
    schoolName: 'Horizon STEM Academy',
    gradeLevel: 'Grade 9',
    targetWpm: 50,
    xp: 680,
    streakDays: 4,
    lastActiveDate: new Date().toISOString()
  },
  teacher: {
    id: 'usr_teacher_01',
    name: 'Sarah Chen, M.Ed.',
    email: 's.chen@horizonstem.edu',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen',
    schoolName: 'Horizon STEM Academy',
    gradeLevel: 'Computer Science Dept',
    targetWpm: 75,
    xp: 2400,
    streakDays: 14,
    lastActiveDate: new Date().toISOString()
  },
  school_admin: {
    id: 'usr_admin_01',
    name: 'Dr. Marcus Vance',
    email: 'm.vance@horizonstem.edu',
    role: 'school_admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusVance',
    schoolName: 'Horizon STEM Academy',
    gradeLevel: 'Principal & Director of Tech',
    targetWpm: 80,
    xp: 3800,
    streakDays: 28,
    lastActiveDate: new Date().toISOString()
  },
  super_admin: {
    id: 'usr_super_01',
    name: 'Platform Engineering Lead',
    email: 'root@typenex.academy',
    role: 'super_admin',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=TypenexAdmin',
    schoolName: 'Global Administration',
    targetWpm: 105,
    xp: 12000,
    streakDays: 45,
    lastActiveDate: new Date().toISOString()
  }
};

// Initial Demo data specifically for the default demo student
const DEMO_STUDENT_DATA: UserPersonalData = {
  lessonProgress: {
    'beg-1': { lessonId: 'beg-1', stars: 3, bestWpm: 24, bestAccuracy: 98, completedAt: '2026-11-04T10:00:00Z' },
    'beg-2': { lessonId: 'beg-2', stars: 3, bestWpm: 26, bestAccuracy: 96, completedAt: '2026-11-05T14:30:00Z' },
    'beg-3': { lessonId: 'beg-3', stars: 2, bestWpm: 28, bestAccuracy: 93, completedAt: '2026-11-06T08:15:00Z' }
  },
  testHistory: [
    {
      id: 'rec-1',
      passageTitle: 'The Art of Touch Typing',
      category: 'easy',
      durationSeconds: 60,
      grossWpm: 54,
      netWpm: 50,
      accuracy: 96,
      errorCount: 2,
      timestamp: '2026-11-05T16:20:00Z'
    },
    {
      id: 'rec-2',
      passageTitle: 'Curiosity and Scientific Wonder',
      category: 'medium',
      durationSeconds: 60,
      grossWpm: 56,
      netWpm: 52,
      accuracy: 97,
      errorCount: 2,
      timestamp: '2026-11-06T08:45:00Z'
    }
  ],
  certificates: [
    {
      id: 'cert_001',
      title: 'Standardized Touch Typing Certification',
      recipientName: 'Jordan Lee',
      awardType: 'speed_benchmark',
      wpm: 52,
      accuracy: 97,
      issuedDate: 'November 5, 2026',
      verificationCode: 'TYP-CERT-9042-ACTIVE'
    }
  ],
  gameScores: [
    { id: 'gs-1', gameId: 'racer', gameName: 'Typing Racer', score: 850, wpm: 58, accuracy: 97, date: 'Yesterday' },
    { id: 'gs-2', gameId: 'rain', gameName: 'Word Rain', score: 1240, wpm: 52, accuracy: 96, date: '2 days ago' }
  ],
  unlockedAchievements: ['first_lesson', 'speed_20', 'speed_40', 'accuracy_95', 'streak_3']
};

const INITIAL_CLASSROOMS: Classroom[] = [
  {
    id: 'cls-1',
    name: 'Period 2 — Computer Science Foundations',
    grade: 'Grade 9',
    code: 'STEM-9042',
    teacherId: 'usr_teacher_01',
    teacherName: 'Sarah Chen, M.Ed.',
    studentCount: 24,
    averageWpm: 46,
    students: [
      { id: 'usr_student_01', name: 'Jordan Lee', email: 'student@school.edu', wpm: 52, accuracy: 96, completedLessons: 8, lastActive: 'Today' },
      { id: 's-2', name: 'Emma Watson', email: 'e.watson@school.edu', wpm: 58, accuracy: 98, completedLessons: 12, lastActive: 'Yesterday' },
      { id: 's-3', name: 'Liam Johnson', email: 'l.johnson@school.edu', wpm: 41, accuracy: 92, completedLessons: 6, lastActive: '2 days ago' },
      { id: 's-4', name: 'Sophia Patel', email: 's.patel@school.edu', wpm: 64, accuracy: 97, completedLessons: 15, lastActive: 'Today' },
      { id: 's-5', name: 'Noah Davis', email: 'n.davis@school.edu', wpm: 39, accuracy: 89, completedLessons: 5, lastActive: '3 days ago' }
    ],
    assignments: [
      {
        id: 'asg-1',
        title: 'Complete Upper Row Lessons (E, I, R, U)',
        classroomId: 'cls-1',
        type: 'lesson',
        targetId: 'beg-6',
        dueDate: 'Tomorrow, 5:00 PM',
        targetWpm: 25,
        minAccuracy: 88,
        completedCount: 18,
        totalCount: 24
      },
      {
        id: 'asg-2',
        title: 'Weekly 1-Minute Speed Benchmark Test',
        classroomId: 'cls-1',
        type: 'test',
        targetId: 'test-1',
        dueDate: 'Friday, 11:59 PM',
        targetWpm: 40,
        minAccuracy: 90,
        completedCount: 12,
        totalCount: 24
      }
    ]
  },
  {
    id: 'cls-2',
    name: 'Period 4 — Digital Media & Communications',
    grade: 'Grade 10',
    code: 'MEDIA-771',
    teacherId: 'usr_teacher_01',
    teacherName: 'Sarah Chen, M.Ed.',
    studentCount: 28,
    averageWpm: 53,
    students: [
      { id: 's-6', name: 'Chloe Martin', email: 'c.martin@school.edu', wpm: 54, accuracy: 95, completedLessons: 14, lastActive: 'Today' },
      { id: 's-7', name: 'Ethan Clark', email: 'e.clark@school.edu', wpm: 62, accuracy: 97, completedLessons: 18, lastActive: 'Today' }
    ],
    assignments: [
      {
        id: 'asg-3',
        title: 'Executive Business Email Practice',
        classroomId: 'cls-2',
        type: 'lesson',
        targetId: 'pro-1',
        dueDate: 'Next Monday',
        targetWpm: 45,
        minAccuracy: 93,
        completedCount: 22,
        totalCount: 28
      }
    ]
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

// Storage helper functions for user-specific data isolation
function getUserStorageKey(userId: string): string {
  return `typenex_userdata_${userId}`;
}

function loadUserDataFromStorage(userId: string): UserPersonalData {
  if (typeof window === 'undefined') {
    return userId === 'usr_student_01' ? DEMO_STUDENT_DATA : createEmptyUserData();
  }
  const raw = localStorage.getItem(getUserStorageKey(userId));
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      return {
        lessonProgress: parsed.lessonProgress || {},
        testHistory: parsed.testHistory || [],
        certificates: parsed.certificates || [],
        gameScores: parsed.gameScores || [],
        unlockedAchievements: parsed.unlockedAchievements || []
      };
    } catch (e) {
      console.error('Failed to parse user data from storage', e);
    }
  }

  // If this is the demo student, seed initial demo data
  if (userId === 'usr_student_01') {
    saveUserDataToStorage(userId, DEMO_STUDENT_DATA);
    return DEMO_STUDENT_DATA;
  }

  // Any other user starts clean and empty
  const empty = createEmptyUserData();
  saveUserDataToStorage(userId, empty);
  return empty;
}

function saveUserDataToStorage(userId: string, data: UserPersonalData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getUserStorageKey(userId), JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save user data to storage', e);
  }
}

function createEmptyUserData(): UserPersonalData {
  return {
    lessonProgress: {},
    testHistory: [],
    certificates: [],
    gameScores: [],
    unlockedAchievements: []
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('typenex_theme');
      if (stored === 'dark' || stored === 'light') return stored;
    }
    return 'light';
  });

  // Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('typenex_sound');
      return stored !== 'false';
    }
    return true;
  });

  // Registered Users Registry
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('typenex_users_registry');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {}
      }
    }
    return Object.values(DEFAULT_USERS);
  });

  // Authenticated state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('typenex_auth_status') === 'true';
    }
    return false;
  });

  // Active User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const activeId = localStorage.getItem('typenex_session_user_id');
      if (activeId) {
        const storedRegistry = localStorage.getItem('typenex_users_registry');
        if (storedRegistry) {
          try {
            const list: UserProfile[] = JSON.parse(storedRegistry);
            const found = list.find(u => u.id === activeId);
            if (found) return found;
          } catch {}
        }
      }
    }
    return DEFAULT_USERS.student;
  });

  // Track active user ID using ref to avoid stale closures in effects
  const activeUserIdRef = useRef<string>(user.id);
  useEffect(() => {
    activeUserIdRef.current = user.id;
  }, [user.id]);

  // User-Specific Data State (Strictly isolated per user)
  const [personalData, setPersonalData] = useState<UserPersonalData>(() => {
    return loadUserDataFromStorage(user.id);
  });

  // Convenience state accessors
  const lessonProgress = personalData.lessonProgress;
  const testHistory = personalData.testHistory;
  const certificates = personalData.certificates;
  const gameScores = personalData.gameScores;
  const unlockedAchievements = personalData.unlockedAchievements;

  // Classrooms and custom lessons
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('typenex_classrooms');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return INITIAL_CLASSROOMS;
  });

  const [customLessons, setCustomLessons] = useState<Lesson[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('typenex_custom_lessons');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return [];
  });

  // Sync theme with DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('typenex_theme', theme);
  }, [theme]);

  // Sync sound settings
  useEffect(() => {
    soundController.enabled = soundEnabled;
    localStorage.setItem('typenex_sound', soundEnabled.toString());
  }, [soundEnabled]);

  // Persist session user and auth status
  useEffect(() => {
    localStorage.setItem('typenex_session_user_id', user.id);
    localStorage.setItem('typenex_auth_status', isAuthenticated.toString());
  }, [user.id, isAuthenticated]);

  // Persist registered users registry
  useEffect(() => {
    localStorage.setItem('typenex_users_registry', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Persist user-specific data whenever it changes
  useEffect(() => {
    saveUserDataToStorage(user.id, personalData);
  }, [user.id, personalData]);

  // Persist classrooms
  useEffect(() => {
    localStorage.setItem('typenex_classrooms', JSON.stringify(classrooms));
  }, [classrooms]);

  // Persist custom lessons
  useEffect(() => {
    localStorage.setItem('typenex_custom_lessons', JSON.stringify(customLessons));
  }, [customLessons]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const toggleSound = () => setSoundEnabled(prev => !prev);

  // Switch to another user (loads their isolated data immediately)
  const switchUser = useCallback((targetUserId: string) => {
    const targetUser = registeredUsers.find(u => u.id === targetUserId);
    if (!targetUser) return;
    
    // First save current user's data
    saveUserDataToStorage(activeUserIdRef.current, personalData);
    
    // Load target user's isolated data
    const targetData = loadUserDataFromStorage(targetUser.id);
    setUser(targetUser);
    setPersonalData(targetData);
    setIsAuthenticated(true);
  }, [registeredUsers, personalData]);

  // Switch role (switches demo account for testing)
  const switchRole = useCallback((newRole: UserRole) => {
    const demoUser = DEFAULT_USERS[newRole];
    switchUser(demoUser.id);
  }, [switchUser]);

  // Sign In / Login function
  const loginUser = useCallback((emailOrName: string, password?: string): { success: boolean; message?: string; user?: UserProfile } => {
    const normalized = emailOrName.trim().toLowerCase();
    if (!normalized) {
      return { success: false, message: 'Please enter your email or name.' };
    }

    // Save current user data before switching
    saveUserDataToStorage(activeUserIdRef.current, personalData);

    // Look for existing registered user
    let found = registeredUsers.find(
      u => u.email.toLowerCase() === normalized || u.name.toLowerCase() === normalized
    );

    if (!found) {
      // Auto-register new user so sign in is completely frictionless
      const formattedName = emailOrName.includes('@')
        ? emailOrName.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        : (emailOrName.charAt(0).toUpperCase() + emailOrName.slice(1));
      
      const newEmail = emailOrName.includes('@') ? emailOrName.trim() : `${emailOrName.trim().toLowerCase()}@school.edu`;
      
      const newUser: UserProfile = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: formattedName,
        email: newEmail,
        role: 'student',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formattedName)}`,
        schoolName: 'Horizon STEM Academy',
        gradeLevel: 'Grade 9',
        targetWpm: 50,
        xp: 0,
        streakDays: 1,
        lastActiveDate: new Date().toISOString(),
        password: password || '123456'
      };

      setRegisteredUsers(prev => [...prev, newUser]);
      found = newUser;
    }

    // Load found user's isolated data
    const loadedData = loadUserDataFromStorage(found.id);
    setUser(found);
    setPersonalData(loadedData);
    setIsAuthenticated(true);

    return { success: true, message: `Welcome back, ${found.name}!`, user: found };
  }, [registeredUsers, personalData]);

  // Sign Up / Register new account
  const registerUser = useCallback((payload: {
    name: string;
    email: string;
    password?: string;
    schoolName?: string;
    role?: UserRole;
    gradeLevel?: string;
    targetWpm?: number;
  }): { success: boolean; message?: string; user?: UserProfile } => {
    const trimmedName = payload.name.trim();
    const trimmedEmail = payload.email.trim();

    if (!trimmedName || !trimmedEmail) {
      return { success: false, message: 'Name and email are required.' };
    }

    // Save previous user data
    saveUserDataToStorage(activeUserIdRef.current, personalData);

    const newUser: UserProfile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: trimmedName,
      email: trimmedEmail,
      role: payload.role || 'student',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedName)}`,
      schoolName: payload.schoolName?.trim() || 'Typenex Academy',
      gradeLevel: payload.gradeLevel || 'Grade 9',
      targetWpm: payload.targetWpm || 50,
      xp: 0,
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      password: payload.password || '123456'
    };

    // Initialize clean isolated data for the new user
    const emptyData = createEmptyUserData();
    saveUserDataToStorage(newUser.id, emptyData);

    setRegisteredUsers(prev => [...prev, newUser]);
    setUser(newUser);
    setPersonalData(emptyData);
    setIsAuthenticated(true);

    return { success: true, message: `Account created for ${trimmedName}!`, user: newUser };
  }, [personalData]);

  // Logout function
  const logout = useCallback(() => {
    // Save current user's data before logout
    saveUserDataToStorage(activeUserIdRef.current, personalData);
    setIsAuthenticated(false);
    
    // Switch to guest/default student data
    const defaultData = loadUserDataFromStorage(DEFAULT_USERS.student.id);
    setUser(DEFAULT_USERS.student);
    setPersonalData(defaultData);
  }, [personalData]);

  // Add XP to current user
  const addXp = useCallback((amount: number) => {
    setUser(prev => {
      const updatedXp = prev.xp + amount;
      const updatedUser = { ...prev, xp: updatedXp };
      // Update in registeredUsers list as well
      setRegisteredUsers(list => list.map(u => (u.id === prev.id ? updatedUser : u)));
      return updatedUser;
    });
  }, []);

  // Check achievements unlock
  const checkBadgeUnlocks = useCallback((newWpm: number, newAccuracy: number) => {
    setPersonalData(prev => {
      const toUnlock: string[] = [];
      const current = prev.unlockedAchievements;
      if (newWpm >= 20 && !current.includes('speed_20')) toUnlock.push('speed_20');
      if (newWpm >= 40 && !current.includes('speed_40')) toUnlock.push('speed_40');
      if (newWpm >= 60 && !current.includes('speed_60')) toUnlock.push('speed_60');
      if (newWpm >= 80 && !current.includes('speed_80')) toUnlock.push('speed_80');
      if (newWpm >= 100 && !current.includes('speed_100')) toUnlock.push('speed_100');
      if (newAccuracy >= 95 && !current.includes('accuracy_95')) toUnlock.push('accuracy_95');
      if (newAccuracy >= 99 && !current.includes('accuracy_99')) toUnlock.push('accuracy_99');

      if (toUnlock.length > 0) {
        return {
          ...prev,
          unlockedAchievements: [...current, ...toUnlock]
        };
      }
      return prev;
    });
  }, []);

  // Save lesson progress for current user
  const saveLessonProgress = useCallback((lessonId: string, wpm: number, accuracy: number, stars: number) => {
    setPersonalData(prev => {
      const existing = prev.lessonProgress[lessonId];
      const bestWpm = existing ? Math.max(existing.bestWpm, wpm) : wpm;
      const bestAccuracy = existing ? Math.max(existing.bestAccuracy, accuracy) : accuracy;
      const bestStars = existing ? Math.max(existing.stars, stars) : stars;

      return {
        ...prev,
        lessonProgress: {
          ...prev.lessonProgress,
          [lessonId]: {
            lessonId,
            stars: bestStars,
            bestWpm,
            bestAccuracy,
            completedAt: new Date().toISOString()
          }
        }
      };
    });

    const xp = calculateXpEarned({ wpm, accuracy, durationSeconds: 60 });
    addXp(xp);
    checkBadgeUnlocks(wpm, accuracy);
  }, [addXp, checkBadgeUnlocks]);

  // Issue certificate to current user
  const issueCertificate = useCallback((
    title: string,
    awardType: CertificateRecord['awardType'],
    wpm: number,
    accuracy: number
  ): CertificateRecord => {
    const newCert: CertificateRecord = {
      id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title,
      recipientName: user.name,
      awardType,
      wpm,
      accuracy,
      issuedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      verificationCode: generateCertificateId()
    };

    setPersonalData(prev => ({
      ...prev,
      certificates: [newCert, ...prev.certificates]
    }));

    return newCert;
  }, [user.name]);

  // Save test result for current user
  const saveTestResult = useCallback((record: Omit<TypingTestRecord, 'id' | 'timestamp'>) => {
    const fullRecord: TypingTestRecord = {
      ...record,
      id: `test_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    setPersonalData(prev => ({
      ...prev,
      testHistory: [fullRecord, ...prev.testHistory]
    }));

    // Auto-award certificate if performance qualifies
    let issuedCert: CertificateRecord | undefined;
    if (fullRecord.netWpm >= 35 && fullRecord.accuracy >= 90) {
      issuedCert = issueCertificate(
        `Certified Typist: ${fullRecord.passageTitle}`,
        'speed_benchmark',
        fullRecord.netWpm,
        fullRecord.accuracy
      );
    }

    const xp = calculateXpEarned({
      wpm: fullRecord.netWpm,
      accuracy: fullRecord.accuracy,
      durationSeconds: fullRecord.durationSeconds,
      isTest: true
    });
    addXp(xp);
    checkBadgeUnlocks(fullRecord.netWpm, fullRecord.accuracy);

    return { ...fullRecord, certificate: issuedCert };
  }, [addXp, checkBadgeUnlocks, issueCertificate]);

  // Save game score for current user
  const saveGameScore = useCallback((gameId: GameScore['gameId'], gameName: string, score: number, wpm: number, accuracy: number) => {
    const newScore: GameScore = {
      id: `gs_${Date.now()}`,
      gameId,
      gameName,
      score,
      wpm,
      accuracy,
      date: 'Just now'
    };

    setPersonalData(prev => {
      const achievements = prev.unlockedAchievements.includes('game_victor')
        ? prev.unlockedAchievements
        : [...prev.unlockedAchievements, 'game_victor'];

      return {
        ...prev,
        gameScores: [newScore, ...prev.gameScores],
        unlockedAchievements: achievements
      };
    });

    addXp(Math.round(score / 10));
  }, [addXp]);

  // Classrooms management
  const createClassroom = useCallback((name: string, grade: string) => {
    const randomCode = `STEM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newClass: Classroom = {
      id: `cls_${Date.now()}`,
      name,
      grade,
      code: randomCode,
      teacherId: user.id,
      teacherName: user.name,
      studentCount: 1,
      averageWpm: 45,
      students: [
        { id: user.id, name: user.name, email: user.email, wpm: user.targetWpm, accuracy: 95, completedLessons: 3, lastActive: 'Just now' }
      ],
      assignments: []
    };
    setClassrooms(prev => [newClass, ...prev]);
    return newClass;
  }, [user.id, user.name, user.email, user.targetWpm]);

  const joinClassroom = useCallback((code: string): boolean => {
    const target = classrooms.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!target) return false;

    if (target.students.some(s => s.id === user.id)) return true;

    const updated = classrooms.map(c => {
      if (c.id === target.id) {
        return {
          ...c,
          studentCount: c.studentCount + 1,
          students: [
            ...c.students,
            { id: user.id, name: user.name, email: user.email, wpm: 50, accuracy: 95, completedLessons: Object.keys(lessonProgress).length, lastActive: 'Just now' }
          ]
        };
      }
      return c;
    });
    setClassrooms(updated);
    return true;
  }, [classrooms, user.id, user.name, user.email, lessonProgress]);

  const createAssignment = useCallback((
    classroomId: string,
    title: string,
    type: 'lesson' | 'test',
    targetId: string,
    dueDate: string,
    targetWpm: number
  ) => {
    const newAssignment: ClassroomAssignment = {
      id: `asg_${Date.now()}`,
      title,
      classroomId,
      type,
      targetId,
      dueDate,
      targetWpm,
      minAccuracy: 90,
      completedCount: 0,
      totalCount: classrooms.find(c => c.id === classroomId)?.studentCount || 20
    };

    setClassrooms(prev => prev.map(c => {
      if (c.id === classroomId) {
        return {
          ...c,
          assignments: [newAssignment, ...c.assignments]
        };
      }
      return c;
    }));
  }, [classrooms]);

  const addCustomLesson = useCallback((data: Omit<Lesson, 'id' | 'level' | 'order'>): Lesson => {
    const newLesson: Lesson = {
      ...data,
      id: `custom_${Date.now()}`,
      level: 'intermediate',
      order: 100 + customLessons.length
    };
    setCustomLessons(prev => [newLesson, ...prev]);
    return newLesson;
  }, [customLessons.length]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        switchRole,
        switchUser,
        registeredUsers,
        theme,
        toggleTheme,
        soundEnabled,
        toggleSound,
        isAuthenticated,
        setIsAuthenticated,
        loginUser,
        registerUser,
        logout,
        lessonProgress,
        saveLessonProgress,
        testHistory,
        saveTestResult,
        certificates,
        issueCertificate,
        gameScores,
        saveGameScore,
        unlockedAchievements,
        addXp,
        classrooms,
        createClassroom,
        joinClassroom,
        createAssignment,
        customLessons,
        addCustomLesson
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
