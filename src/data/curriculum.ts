/**
 * Complete Structured Typing Curriculum & Passages
 * Levels: Beginner, Intermediate, Advanced, Professional
 */

export interface Lesson {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  unit: string;
  order: number;
  title: string;
  description: string;
  keysIntroduced: string[];
  targetWpm: number;
  minAccuracy: number;
  instructions: string;
  text: string;
}

export interface TypingTestPassage {
  id: string;
  title: string;
  category: 'easy' | 'medium' | 'hard' | 'quotes' | 'code' | 'science';
  difficulty: string;
  text: string;
  authorOrSource?: string;
}

export interface DigitalLiteracyLesson {
  id: string;
  module: string;
  title: string;
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export const CURRICULUM_LESSONS: Lesson[] = [
  // --- BEGINNER: Home Row & Primary Reach ---
  {
    id: 'beg-1',
    level: 'beginner',
    unit: '1. Home Row Foundation',
    order: 1,
    title: 'The Home Row: F, J, and Space',
    description: 'Learn the primary tactile index finger anchor keys with bumps.',
    keysIntroduced: ['f', 'j', ' '],
    targetWpm: 15,
    minAccuracy: 85,
    instructions: 'Rest your left index finger on F and right index finger on J. Feel the small bumps. Use your thumbs for the spacebar.',
    text: 'fff jjj fff jjj fj fj jf jf f j f j ff jj ff jj f j f j'
  },
  {
    id: 'beg-2',
    level: 'beginner',
    unit: '1. Home Row Foundation',
    order: 2,
    title: 'Home Row: D and K',
    description: 'Extend to the middle fingers on the home row.',
    keysIntroduced: ['d', 'k'],
    targetWpm: 18,
    minAccuracy: 85,
    instructions: 'Left middle finger rests on D. Right middle finger rests on K. Keep your wrists relaxed and hovering slightly.',
    text: 'ddd kkk ddd kkk dk dk kd kd df jk fd kj d k d k df jk fd'
  },
  {
    id: 'beg-3',
    level: 'beginner',
    unit: '1. Home Row Foundation',
    order: 3,
    title: 'Home Row: S and L',
    description: 'Engage the ring fingers on the home row.',
    keysIntroduced: ['s', 'l'],
    targetWpm: 20,
    minAccuracy: 85,
    instructions: 'Left ring finger on S. Right ring finger on L. Maintain a steady rhythmic tap without pressing hard.',
    text: 'sss lll sss lll sl sl ls ls asd jkl sdf jkl s l s l fall lads'
  },
  {
    id: 'beg-4',
    level: 'beginner',
    unit: '1. Home Row Foundation',
    order: 4,
    title: 'Home Row: A and Semicolon (;)',
    description: 'Master the pinky fingers on the outermost home row keys.',
    keysIntroduced: ['a', ';'],
    targetWpm: 20,
    minAccuracy: 85,
    instructions: 'Left pinky rests on A. Right pinky rests on semicolon. Do not tilt your wrists outwards.',
    text: 'aaa ;;; asdf jkl; asdf jkl; a; ;a ask fall glad salad flask all'
  },
  {
    id: 'beg-5',
    level: 'beginner',
    unit: '1. Home Row Foundation',
    order: 5,
    title: 'Home Row: G and H Center Stretch',
    description: 'Reaching inward from F to G, and from J to H.',
    keysIntroduced: ['g', 'h'],
    targetWpm: 22,
    minAccuracy: 88,
    instructions: 'Stretch your left index finger right to G, then return to F. Stretch right index left to H, then return to J.',
    text: 'fgf jhj fgf jhj flag half dash flash hall glass flash glad half dash'
  },
  // --- Upper Row ---
  {
    id: 'beg-6',
    level: 'beginner',
    unit: '2. Upper Row Exploration',
    order: 6,
    title: 'Upper Row: E and I',
    description: 'The two most common vowels in the English language.',
    keysIntroduced: ['e', 'i'],
    targetWpm: 24,
    minAccuracy: 88,
    instructions: 'Reach up from D to E with your left middle finger. Reach up from K to I with your right middle finger.',
    text: 'ded kik ded kik see life field dial like side desk file slide slide'
  },
  {
    id: 'beg-7',
    level: 'beginner',
    unit: '2. Upper Row Exploration',
    order: 7,
    title: 'Upper Row: R and U',
    description: 'Reaching upward with both index fingers.',
    keysIntroduced: ['r', 'u'],
    targetWpm: 25,
    minAccuracy: 88,
    instructions: 'Left index reaches up to R. Right index reaches up to U. Always return your fingers to the home row.',
    text: 'frf juj frf juj rule rush read sure fire fur user flare full rise'
  },
  {
    id: 'beg-8',
    level: 'beginner',
    unit: '2. Upper Row Exploration',
    order: 8,
    title: 'Upper Row: T and Y',
    description: 'Upward angled reach for T and Y.',
    keysIntroduced: ['t', 'y'],
    targetWpm: 26,
    minAccuracy: 88,
    instructions: 'Left index reaches up and right to T. Right index reaches up and left to Y.',
    text: 'ftf jyj ftf jyj they that year city state style study duty target'
  },
  // --- Lower Row ---
  {
    id: 'beg-9',
    level: 'beginner',
    unit: '3. Lower Row Mastery',
    order: 9,
    title: 'Lower Row: V, B, N, and M',
    description: 'Reaching down to the bottom row index keys.',
    keysIntroduced: ['v', 'b', 'n', 'm'],
    targetWpm: 26,
    minAccuracy: 88,
    instructions: 'Left index steps down to V and B. Right index steps down to N and M.',
    text: 'fbf fvf jnj jmj view banner move number brave man member vine name'
  },
  {
    id: 'beg-10',
    level: 'beginner',
    unit: '3. Lower Row Mastery',
    order: 10,
    title: 'Lower Row: C, X, Z, and Period (.)',
    description: 'Completing the bottom row letters and sentence terminators.',
    keysIntroduced: ['c', 'x', 'z', '.'],
    targetWpm: 28,
    minAccuracy: 90,
    instructions: 'Step down with your middle, ring, and pinky fingers. Tap the period with your right ring finger.',
    text: 'dcd sxs aza l.l calm extra zero zone clock excel mix freeze quick.'
  },

  // --- INTERMEDIATE: Words, Punctuation & Speed Cadence ---
  {
    id: 'int-1',
    level: 'intermediate',
    unit: '4. High-Frequency Words',
    order: 11,
    title: 'The Core 100 English Words',
    description: 'Build muscle memory for the most frequent words in written English.',
    keysIntroduced: ['the', 'and', 'that', 'with'],
    targetWpm: 35,
    minAccuracy: 90,
    instructions: 'Focus on typing entire words as smooth melodic bursts rather than individual disconnected letters.',
    text: 'the and that have with this from they will would there their about which'
  },
  {
    id: 'int-2',
    level: 'intermediate',
    unit: '4. High-Frequency Words',
    order: 12,
    title: 'Common Digraphs and Suffixes',
    description: 'Practice the building blocks: -ing, -tion, -ment, and th-, ch-, sh-.',
    keysIntroduced: ['ing', 'tion', 'ment'],
    targetWpm: 38,
    minAccuracy: 90,
    instructions: 'Feel the rhythm of common endings. Keep your speed steady throughout long words.',
    text: 'thinking learning section action statement agreement teaching making movement'
  },
  {
    id: 'int-3',
    level: 'intermediate',
    unit: '5. Sentence Flow & Punctuation',
    order: 13,
    title: 'Natural Sentences & Commas',
    description: 'Combine letters, spaces, commas, and periods in flowing sentences.',
    keysIntroduced: [',', '.'],
    targetWpm: 40,
    minAccuracy: 92,
    instructions: 'Pause only mentally, not physically. Space once after commas and once after periods in modern digital typing.',
    text: 'Clear communication requires patience, practice, and consistent focus every day.'
  },
  {
    id: 'int-4',
    level: 'intermediate',
    unit: '5. Sentence Flow & Punctuation',
    order: 14,
    title: 'Numbers and Currency Symbols',
    description: 'Reach up to the number row accurately without glancing at your hands.',
    keysIntroduced: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '$'],
    targetWpm: 32,
    minAccuracy: 90,
    instructions: 'Keep your anchor fingers close to the home row while reaching up to the numbers.',
    text: 'Order 42 units for $150 each on May 18, 2026. The total sum is $6300.'
  },

  // --- ADVANCED: Long Form, High Speed & Endurance ---
  {
    id: 'adv-1',
    level: 'advanced',
    unit: '6. Literary & Technical Endurance',
    order: 15,
    title: 'Technology & Human Progress',
    description: 'A multi-sentence paragraph testing sustained speed and accuracy.',
    keysIntroduced: ['complex text'],
    targetWpm: 48,
    minAccuracy: 93,
    instructions: 'Breathe steadily. Scan ahead 2 to 3 words with your eyes while your fingers execute the current word.',
    text: 'Modern digital literacy empowers individuals to analyze information critically, communicate across global networks, and build tools that transform everyday human collaboration.'
  },
  {
    id: 'adv-2',
    level: 'advanced',
    unit: '6. Literary & Technical Endurance',
    order: 16,
    title: 'Complex Punctuation & Quotations',
    description: 'Master quotes, hyphens, colons, semicolons, and parentheses.',
    keysIntroduced: ['"', '-', ':', ';', '(', ')'],
    targetWpm: 45,
    minAccuracy: 94,
    instructions: 'Use the opposite shift key for capital letters and shifted punctuation symbols.',
    text: 'The lead engineer stated: "Consistency outpaces raw burst speed; structured practice yields lasting mastery (over 99% accuracy)." '
  },
  {
    id: 'adv-3',
    level: 'advanced',
    unit: '7. Velocity Sprint (60+ WPM)',
    order: 17,
    title: 'High Velocity Speed Run',
    description: 'Push your limits past the 60 WPM barrier with rhythmic word cadences.',
    keysIntroduced: ['speed rhythm'],
    targetWpm: 60,
    minAccuracy: 95,
    instructions: 'Do not rush into errors. Speed naturally follows relaxed, effortless accuracy.',
    text: 'Speed is not about moving your hands furiously. It is about eliminating hesitation between keystrokes and allowing muscle memory to guide every movement.'
  },

  // --- PROFESSIONAL: Workplace, Code & Documentation ---
  {
    id: 'pro-1',
    level: 'professional',
    unit: '8. Professional Communication',
    order: 18,
    title: 'Executive Business Email',
    description: 'Formal corporate correspondence with greetings, bulleted structure, and professional sign-offs.',
    keysIntroduced: ['formal prose'],
    targetWpm: 50,
    minAccuracy: 95,
    instructions: 'Focus on proper capitalization and clean formatting representative of top-tier professional workplaces.',
    text: 'Dear Leadership Team, Please find attached the quarterly performance summary. All milestones for Q3 were accomplished ahead of schedule with 98.4% client satisfaction.'
  },
  {
    id: 'pro-2',
    level: 'professional',
    unit: '9. Code & Technical Syntax',
    order: 19,
    title: 'Web & Programming Syntax',
    description: 'Practice programming brackets, arrows, strings, and operators.',
    keysIntroduced: ['{', '}', '[', ']', '<', '>', '=', '=>', '()'],
    targetWpm: 38,
    minAccuracy: 92,
    instructions: 'Programmers type numerous special symbols. Keep your right hand nimble for braces and brackets.',
    text: 'const calculateMetrics = (keys = [], time = 60) => { return { wpm: Math.round((keys.length / 5) / (time / 60)) }; };'
  },
  {
    id: 'pro-3',
    level: 'professional',
    unit: '9. Code & Technical Syntax',
    order: 20,
    title: 'SQL & Database Query Typing',
    description: 'Typing uppercase SQL keywords alongside table names and identifiers.',
    keysIntroduced: ['SELECT', 'FROM', 'WHERE', 'JOIN'],
    targetWpm: 42,
    minAccuracy: 94,
    instructions: 'Switch between lowercase identifiers and uppercase keywords without breaking cadence.',
    text: 'SELECT student_id, first_name, average_wpm FROM students WHERE accuracy >= 95.0 ORDER BY average_wpm DESC LIMIT 10;'
  }
];

export const TYPING_TEST_PASSAGES: TypingTestPassage[] = [
  {
    id: 'test-vet',
    title: 'Rescue Animal Music Project',
    category: 'medium',
    difficulty: 'Medium · Official Benchmark',
    text: 'veterinarian thinks so. The vet has put music in over one thousand animal shelters and says it calms dogs and cats. Moreover, it even cuts down on barking. The vet started the nonprofit rescue animal project nearly four years ago. She asked artists around the world to donate dog and cat friendly music.',
    authorOrSource: 'Rescue Animal Project'
  },
  {
    id: 'test-1',
    title: 'The Art of Touch Typing',
    category: 'easy',
    difficulty: 'Easy · ~35 WPM target',
    text: 'Touch typing is the skill of typing without looking at the keyboard keys. By trusting your fingers to remember the positions of letters through muscle memory, you can focus your entire attention on the thoughts and ideas you wish to express.',
    authorOrSource: 'Educational Foundation'
  },
  {
    id: 'test-2',
    title: 'Curiosity and Scientific Wonder',
    category: 'medium',
    difficulty: 'Medium · ~50 WPM target',
    text: 'Somewhere, something incredible is waiting to be known. The cosmos is within us. We are made of star-stuff, and we are a way for the cosmos to know itself. In all our searching, the only thing we have found that makes the emptiness bearable is each other.',
    authorOrSource: 'Carl Sagan'
  },
  {
    id: 'test-3',
    title: 'The Digital Literacy Imperative',
    category: 'hard',
    difficulty: 'Hard · ~65 WPM target',
    text: 'In an era dominated by rapid computational advances and interconnected networks, digital literacy is no longer a luxury. It represents the quintessential bridge between passive consumption and active technological creation, equipping generations with discernment, cyber security awareness, and analytical depth.',
    authorOrSource: 'Global Skills Initiative'
  },
  {
    id: 'test-4',
    title: 'Timeless Wisdom & Quotes',
    category: 'quotes',
    difficulty: 'Medium · Quotes',
    text: 'Do not go where the path may lead, go instead where there is no path and leave a trail. Success is not final, failure is not fatal: it is the courage to continue that counts. We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    authorOrSource: 'Ralph Waldo Emerson & Winston Churchill'
  },
  {
    id: 'test-5',
    title: 'Software Architecture & Clean Code',
    category: 'code',
    difficulty: 'Hard · Code Syntax',
    text: 'import { useState, useEffect } from "react";\nexport function useTypingEngine(targetText) {\n  const [index, setIndex] = useState(0);\n  const [errors, setErrors] = useState(0);\n  return { index, errors, isComplete: index >= targetText.length };\n}',
    authorOrSource: 'Modern React TypeScript'
  },
  {
    id: 'test-6',
    title: 'Deep Space Astronomy & Physics',
    category: 'science',
    difficulty: 'Hard · Scientific Vocabulary',
    text: 'Gravitational waves are ripples in the fabric of spacetime caused by some of the most violent and energetic processes in the universe. Albert Einstein predicted the existence of gravitational waves in 1916 in his general theory of relativity.',
    authorOrSource: 'Astrophysics Digest'
  }
];

export const DIGITAL_LITERACY_MODULES: DigitalLiteracyLesson[] = [
  {
    id: 'digi-1',
    module: 'Computer Hardware & Fundamentals',
    title: 'Inside the Machine: How Computers Process Data',
    readTime: '4 min read',
    summary: 'Understand the fundamental hardware components: CPU, RAM, SSD storage, and input/output peripherals.',
    content: [
      'Every computing device—from a smartwatch to a massive cloud data center—relies on four essential hardware pillars: processing, temporary memory, permanent storage, and input/output.',
      'The Central Processing Unit (CPU) executes instructions millions of times per second. Random Access Memory (RAM) provides lightning-fast temporary workspace for currently active applications.',
      'Solid-State Drives (SSDs) retain files and operating system files permanently using non-volatile flash memory chips. Input devices (keyboards, mice, touchscreens) translate physical human gestures into digital signals.'
    ],
    keyTakeaways: [
      'CPU is the brain that executes calculations.',
      'RAM is volatile temporary high-speed memory wiped when powered off.',
      'SSDs provide non-volatile persistent file storage.',
      'Good ergonomics with keyboard & monitor placement prevent repetitive strain injury (RSI).'
    ],
    quiz: [
      {
        question: 'Which component stores active running apps temporarily and clears its data when the computer turns off?',
        options: ['Hard Disk Drive (HDD)', 'Random Access Memory (RAM)', 'Central Processing Unit (CPU)', 'Power Supply Unit (PSU)'],
        correctIndex: 1,
        explanation: 'RAM is volatile memory used for active programs; it requires power to maintain data.'
      },
      {
        question: 'What is the primary benefit of touch typing for computer operators?',
        options: [
          'It looks impressive to observers',
          'It allows typing without looking at keys, drastically boosting speed and reducing eye fatigue',
          'It makes the keyboard silent',
          'It replaces the need for a mouse entirely'
        ],
        correctIndex: 1,
        explanation: 'Touch typing frees visual attention to focus on content rather than hunting for keys.'
      }
    ]
  },
  {
    id: 'digi-2',
    module: 'Internet Safety & Online Privacy',
    title: 'Cybersecurity Shield: Passwords, Phishing & 2FA',
    readTime: '5 min read',
    summary: 'Protect your identity online with password hygiene, multi-factor authentication, and phishing recognition.',
    content: [
      'In a hyper-connected world, personal credentials are the primary target for malicious actors. Weak or reused passwords represent over 80% of preventable account breaches.',
      'Phishing attacks use deceptive emails, spoofed sender domains, and urgent language to trick users into revealing sensitive credentials or downloading malware.',
      'Implementing Two-Factor Authentication (2FA) adds a critical second barrier—such as an authenticator app code or security key—ensuring that even if a password leaks, unauthorized access is stopped.'
    ],
    keyTakeaways: [
      'Never reuse passwords across financial and educational accounts.',
      'Use passphrases of 4+ random words for maximum entropy.',
      'Always inspect URLs carefully before entering login credentials.',
      'Enable Multi-Factor Authentication (MFA/2FA) wherever supported.'
    ],
    quiz: [
      {
        question: 'What is the most effective defense against credential stuffing attacks?',
        options: [
          'Using the same complex password everywhere',
          'Using unique strong passwords for each account combined with a password manager and 2FA',
          'Writing passwords on a sticky note attached to your monitor',
          'Changing your username every week'
        ],
        correctIndex: 1,
        explanation: 'Unique passwords ensure a breach on one website cannot compromise your other accounts.'
      }
    ]
  },
  {
    id: 'digi-3',
    module: 'Digital Citizenship & Responsible AI',
    title: 'Critical Thinking & Information Verification',
    readTime: '4 min read',
    summary: 'Evaluate online sources, recognize synthetic media, and utilize AI tools ethically and productively.',
    content: [
      'Digital citizenship means participating constructively, respectfully, and safely in online communities while understanding the digital footprint left by our actions.',
      'With the emergence of generative AI and deepfake media, critical evaluation of sources is paramount. Always cross-verify sensational claims using lateral reading across authoritative primary sources.',
      'Responsible AI literacy means using assistive technologies as thought partners and accelerators rather than unverified sources of absolute truth.'
    ],
    keyTakeaways: [
      'Practice lateral reading: open new tabs to verify the source.',
      'Respect copyright, attribution, and intellectual property.',
      'Verify AI-generated factual claims against primary documentation.'
    ],
    quiz: [
      {
        question: 'What does "lateral reading" mean when evaluating online articles?',
        options: [
          'Reading from right to left',
          'Leaving the original article to research the author and publisher across other reputable tabs',
          'Skimming only the first and last paragraphs',
          'Translating the text into multiple languages'
        ],
        correctIndex: 1,
        explanation: 'Lateral reading investigates credibility by consulting external sources rather than trusting the site itself.'
      }
    ]
  }
];
