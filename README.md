# Typenex Academy - Frontend Single-Page Application

Typenex Academy is a modern, 100% **Frontend-Based** single-page web application built with **React 19, Tailwind CSS, Lucide Icons, and Framer Motion**. It requires no backend server, no database, and no server-side dependencies. All state, user authentication, progress tracking, and personalized dashboards are managed entirely on the client side using secure isolated local persistence.

---

## ✨ Features & Architecture

1. **Client-Side Sign In & Registration System**:
   - Frictionless Sign In and Account Creation.
   - Built-in user registry with support for multiple user accounts.
   - Instant 1-click Demo Account presets (Student, Teacher, School Admin).

2. **Personalized User Dashboards**:
   - Distinct, personalized dashboard for every user.
   - User identity banner showing individual name, avatar, school/institution, grade/role, streak days, level, and XP progression.

3. **Strict User-Specific Data Isolation**:
   - Each user's data (lesson progress, speed test history, verified certificates, achievements, game scores) is strictly partitioned and stored per user.
   - Switching between users completely resets and loads only that user's personal records without any cross-user data leakage.

4. **Dynamic Performance Tracking & Analytics**:
   - Real-time calculation of Average WPM, Top Speed (All-Time Best), Precision/Accuracy rate, and Curriculum Completion.
   - Fully dynamic SVG Speed & Accuracy trajectory chart plotted in real time from the user's recorded sessions.
   - Detailed session history log displaying dates, passage titles, net/gross WPM, accuracy, and error counts.
   - Officially verifiable certificates with unique cryptographic IDs issued specifically in the user's name.

5. **Classroom & Administration Tools**:
   - Teacher classroom management suite with instant join codes, student roster analytics, and CSV roster export.
   - Administration console with multi-tenant metrics, user directory, and custom lesson builder.

---

## 📁 Project Structure

```text
typeTex/
├── public/                 # Static assets & public images
├── src/
│   ├── assets/             # Photography, certificates, and emblems
│   ├── components/         # Reusable interactive UI components
│   │   ├── games/          # Typing Racer, Word Rain, Word Shooter arcade games
│   │   ├── AdminDashboard.tsx      # Platform analytics, user directory & lesson builder
│   │   ├── AuthModal.tsx           # Sign in, registration & quick demo switch modal
│   │   ├── CertificateModal.tsx    # Printable verified certificate viewer
│   │   ├── CurriculumView.tsx      # 4-tier structured typing lessons browser
│   │   ├── DigitalLiteracyView.tsx # Cybersecurity & AI digital skills modules
│   │   ├── Footer.tsx              # Institutional footer
│   │   ├── InteractiveKeyboard.tsx # QWERTY visualizer with live home-row guide
│   │   ├── LandingPage.tsx         # Educational homepage & practice arena
│   │   ├── Navbar.tsx              # 3-zone header with theme, audio & user profile
│   │   ├── StudentDashboard.tsx    # Dynamic speed progression, charts & metrics
│   │   ├── TeacherDashboard.tsx    # Classroom manager, join codes & gradebook export
│   │   ├── TypingArena.tsx         # Interactive typing engine with real-time accuracy
│   │   └── TypingTestView.tsx      # Standardized timed speed tests
│   ├── context/
│   │   └── AppContext.tsx  # Central state management, isolated storage & auth
│   ├── data/
│   │   └── curriculum.ts   # 22+ professional typing lessons and passage texts
│   ├── hooks/
│   │   ├── useTypingEngine.ts # Keystroke capture, WPM, and accuracy calculator
│   │   ├── useSound.ts     # Synthesized mechanical key clicks and fanfare audio
│   │   └── useAuth.ts      # Pure frontend authentication helper
│   ├── pages/              # View pages (Home, Dashboard, Lessons, Games, etc.)
│   ├── utils/
│   │   ├── audio.ts        # Web Audio API sound synthesis
│   │   ├── gamification.ts # Level curves, badges, certificates, and XP
│   │   ├── typingEngine.ts # Pure typing calculations and finger maps
│   │   └── typingEngine.test.ts # Native Node.js test suite
│   ├── App.tsx             # Root view router
│   ├── main.tsx            # React root mount entrypoint
│   └── index.css           # Tailwind CSS imports and design tokens
├── index.html              # HTML entrypoint
├── vite.config.ts          # Pure frontend Vite build configuration
├── tsconfig.json           # Frontend TypeScript configuration
├── package.json            # Frontend dependencies & npm scripts
├── .env                    # Frontend environment settings
└── README.md
```

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server (runs on port 3000)
npm run dev

# 3. Production build
npm run build

# 4. Run native unit tests
npm test

# 5. Typecheck & lint
npm run lint
```
