import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Keyboard,
  Award,
  Gamepad2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Timer,
  ChevronDown,
  Play,
  TrendingUp,
  Flame,
  Star
} from 'lucide-react';

interface LandingPageProps {
  onStartLearning: () => void;
  onTakeTest: () => void;
  onExploreGames: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onTakeTest,
  onExploreGames
}) => {
  const [demoInput, setDemoInput] = useState<string>('');
  const demoTarget = 'The quick brown fox jumps over the lazy dog.';
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSuccess, setNewsletterSuccess] = useState<boolean>(false);

  const handleDemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDemoInput(e.target.value);
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 4000);
    }
  };

  const FAQS = [
    {
      q: 'How does touch typing improve professional productivity?',
      a: 'Touch typing trains muscle memory so that you type without looking at the keyboard. Average hunt-and-peck typists clock 25-35 WPM, while touch typists comfortably reach 65-90+ WPM, saving 20-30 days of typing time annually.'
    },
    {
      q: 'Is Typenex appropriate for K-12 schools and university students?',
      a: 'Yes! Typenex provides comprehensive teacher dashboards, student roster tracking, auto-generated class join codes, customizable homework assignments, and CSV progress export tailored for educators.'
    },
    {
      q: 'How are typing certificates verified?',
      a: 'Each certificate issued contains a unique cryptographically generated verification code. Certificates record net WPM, precision percentage, and completion date under standardized test conditions.'
    },
    {
      q: 'Does Typenex teach digital skills beyond basic keyboarding?',
      a: 'Yes. Our platform includes dedicated digital literacy modules covering computer hardware architecture, cybersecurity, password hygiene, phishing defense, and responsible AI literacy.'
    }
  ];

  return (
    <div className="w-full flex flex-col gap-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative pt-6 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800 text-xs font-semibold tracking-tight">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Next-Generation Typing &amp; Digital Skills Academy</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Master Touch Typing &amp; Essential Digital Skills.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
              From foundational home-row finger placement to 90+ WPM professional endurance. Standardized speed tests, interactive arcade games, verified certifications, and complete K-12 classroom management.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartLearning}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/25 flex items-center gap-2.5 transition-all text-sm tracking-tight"
              >
                Start Learning Free
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onTakeTest}
                className="px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold rounded-2xl shadow-xs transition-all text-sm tracking-tight flex items-center gap-2"
              >
                <Timer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Take Typing Test
              </button>

              <button
                onClick={onExploreGames}
                className="px-4 py-3.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold text-sm tracking-tight flex items-center gap-1.5 transition-colors"
              >
                <Gamepad2 className="w-4 h-4" />
                Play Games
              </button>
            </div>

            {/* Micro Trust Proof */}
            <div className="flex items-center gap-6 pt-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium tracking-tight">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free for Students
              </span>
              <span className="flex items-center gap-1.5 font-medium tracking-tight">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified Certificates
              </span>
              <span className="flex items-center gap-1.5 font-medium tracking-tight">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-time Analytics
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Hero Workspace & Live Typing Sandbox */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950 aspect-[16/10]">
              <img
                src="/src/assets/images/hero_typing_workspace_1793985549679.jpg"
                alt="Typing Workspace Environment"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 text-white">
                <div className="flex items-center justify-between text-xs text-indigo-300 font-medium mb-1 tracking-tight">
                  <span>Interactive Live Preview</span>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">98% Accuracy</span>
                </div>
                <div className="text-xs font-mono text-slate-300 truncate leading-relaxed">
                  {demoTarget}
                </div>
                <input
                  type="text"
                  value={demoInput}
                  onChange={handleDemoChange}
                  placeholder="Test typing this sentence right now..."
                  className="w-full mt-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-normal"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Statistics Banner */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col">
            <span className="text-3xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums tracking-tight">
              4-Tier
            </span>
            <span className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1.5 tracking-tight">
              Structured Curriculum
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">Beginner to Professional</span>
          </div>

          <div className="flex flex-col">
            <span className="text-3xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums tracking-tight">
              60+ WPM
            </span>
            <span className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1.5 tracking-tight">
              Average Student Exit Speed
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">Measured benchmark</span>
          </div>

          <div className="flex flex-col">
            <span className="text-3xl md:text-4xl font-extrabold text-amber-500 font-mono tabular-nums tracking-tight">
              100%
            </span>
            <span className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1.5 tracking-tight">
              Verified Certificates
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">With verifiable ID hash</span>
          </div>

          <div className="flex flex-col">
            <span className="text-3xl md:text-4xl font-extrabold text-sky-500 font-mono tabular-nums tracking-tight">
              24/7
            </span>
            <span className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1.5 tracking-tight">
              Accessible Learning
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">Works on any browser</span>
          </div>
        </div>
      </section>

      {/* 3. Four Core Pillars Curriculum */}
      <section className="flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Progressive Skill Progression
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight leading-tight">
            Engineered for Fast, Lasting Muscle Memory
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 leading-relaxed">
            Every lesson systematically reinforces finger assignments, eliminates visual hunting, and cultivates effortless rhythm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-indigo-400 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 font-mono uppercase tracking-wider">Level 1</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 tracking-tight leading-snug">
                Beginner Foundation
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Home row anchor keys (F, J), correct posture, upper and lower row reaches, and basic spacebar timing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
              10 Structured Lessons →
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-indigo-400 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 font-mono uppercase tracking-wider">Level 2</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 tracking-tight leading-snug">
                Intermediate Flow
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                High-frequency English n-grams, common word melodies, capital shift rhythm, and punctuation cadence.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-sky-600 dark:text-sky-400 tracking-tight">
              High-Frequency Words →
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-indigo-400 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 font-mono uppercase tracking-wider">Level 3</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 tracking-tight leading-snug">
                Advanced Endurance
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Long-form literature paragraphs, complex quotations, technical vocabulary, and sustained 60+ WPM sprints.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-amber-600 dark:text-amber-400 tracking-tight">
              Velocity Drills →
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-indigo-400 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono uppercase tracking-wider">Level 4</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 tracking-tight leading-snug">
                Professional &amp; Code
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Executive business emails, JavaScript &amp; HTML syntax, SQL queries, brackets, and terminal command drills.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
              Workplace Ready →
            </div>
          </div>
        </div>
      </section>

      {/* 4. Classroom & Teacher Suite Section */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              For Schools &amp; Instructors
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 leading-tight tracking-tight">
              Classroom Management Designed for Modern Educators
            </h2>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              Create classrooms with 1-click join codes, assign targeted typing lessons, set custom speed goals, and monitor live student accuracy distributions.
            </p>

            <div className="space-y-3 mt-6 text-sm text-slate-200 leading-normal">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant join codes (no complicated student email setup needed)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom lesson authoring tool for specialized terminology</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>One-click CSV gradebook export for school reports</span>
              </div>
            </div>

            <button
              onClick={onStartLearning}
              className="mt-8 px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs tracking-tight rounded-xl shadow-lg transition-all"
            >
              Explore Teacher Tools
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl">
            <img
              src="/src/assets/images/classroom_interactive_learning_1793985550810.jpg"
              alt="Students learning typing in computer classroom"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. Student Testimonials */}
      <section className="flex flex-col gap-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Real Student Outcomes
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight leading-tight">
            Proven Results in the Classroom
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "I went from 32 WPM hunting for keys to 74 WPM in less than six weeks. The finger placement guide and hands visualizer completely changed my typing posture."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="font-bold text-xs text-slate-900 dark:text-white tracking-tight">Jordan Lee</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">9th Grade Student · Horizon STEM</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "Managing 120 middle schoolers used to be a headache with other typing apps. Typenex join codes and CSV exports make homework tracking effortless."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="font-bold text-xs text-slate-900 dark:text-white tracking-tight">Sarah Chen, M.Ed.</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Computer Science Teacher</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "The coding and technical syntax lessons are brilliant. Typing brackets, curly braces, and SQL queries no longer slows down my programming flow."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="font-bold text-xs text-slate-900 dark:text-white tracking-tight">Marcus Vance</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Software Engineering Student</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions (FAQ) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight leading-tight">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm text-slate-900 dark:text-white tracking-tight flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${faqOpen === idx ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>
              {faqOpen === idx && (
                <div className="p-4 pt-0 text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. Newsletter Subscription & Final Call to Action */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-md">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
            Ready to Accelerate Your Typing Speed?
          </h3>
          <p className="text-xs md:text-sm text-indigo-100 mt-2 leading-relaxed">
            Subscribe for weekly typing tips, digital literacy drills, and newly released arcade challenges.
          </p>
        </div>

        <form onSubmit={handleNewsletter} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            placeholder="Enter your student or teacher email..."
            value={newsletterEmail}
            onChange={e => setNewsletterEmail(e.target.value)}
            className="px-4 py-3 rounded-xl bg-indigo-900/60 border border-indigo-400/50 text-white placeholder:text-indigo-200 text-xs focus:outline-none focus:ring-2 focus:ring-white min-w-[260px] leading-normal"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs tracking-tight rounded-xl shadow-md transition-all shrink-0"
          >
            {newsletterSuccess ? 'Subscribed!' : 'Get Free Drills'}
          </button>
        </form>
      </section>
    </div>
  );
};
