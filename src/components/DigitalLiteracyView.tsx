import React, { useState } from 'react';
import { DIGITAL_LITERACY_MODULES, DigitalLiteracyLesson } from '../data/curriculum';
import { useApp } from '../context/AppContext';
import { soundController } from '../utils/audio';
import { ShieldCheck, BookOpen, CheckCircle, HelpCircle, ArrowRight, Award, Sparkles } from 'lucide-react';

export const DigitalLiteracyView: React.FC = () => {
  const { addXp } = useApp();
  const [activeModule, setActiveModule] = useState<DigitalLiteracyLesson | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    if (submittedQuiz) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCheckQuiz = () => {
    if (!activeModule) return;
    setSubmittedQuiz(true);
    let correctCount = 0;
    activeModule.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    if (correctCount > 0) {
      soundController.playSuccess();
      addXp(correctCount * 30);
    }
  };

  const handleOpenModule = (mod: DigitalLiteracyLesson) => {
    setActiveModule(mod);
    setSelectedAnswers({});
    setSubmittedQuiz(false);
  };

  if (activeModule) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        <button
          onClick={() => setActiveModule(null)}
          className="self-start text-xs font-bold tracking-tight text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          ← Back to All Modules
        </button>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm flex flex-col gap-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              {activeModule.module}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight leading-tight">
              {activeModule.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
              <span>{activeModule.readTime}</span>
              <span>·</span>
              <span>Interactive Knowledge Check</span>
            </div>
          </div>

          {/* Module Content Paragraphs */}
          <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base border-t border-slate-100 dark:border-slate-800 pt-6">
            {activeModule.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Key Takeaways Box */}
          <div className="bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl p-5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Essential Takeaways
            </h4>
            <ul className="space-y-2 text-xs md:text-sm text-indigo-950 dark:text-indigo-200 list-disc list-inside leading-relaxed">
              {activeModule.keyTakeaways.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Interactive Knowledge Check Quiz */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Knowledge Check Quiz
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                  Verify your comprehension to earn +30 XP per question.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {activeModule.quiz.map((q, qIdx) => {
                const userAns = selectedAnswers[qIdx];
                const isAnswered = userAns !== undefined;
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div key={qIdx} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white mb-3 tracking-tight leading-snug">
                      {qIdx + 1}. {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50';

                        if (submittedQuiz) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500';
                          } else if (userAns === optIdx) {
                            btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200';
                          }
                        } else if (userAns === optIdx) {
                          btnStyle = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectAnswer(qIdx, optIdx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs md:text-sm transition-all flex items-center justify-between leading-normal ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {submittedQuiz && optIdx === q.correctIndex && (
                              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {submittedQuiz && (
                      <div className={`mt-3 p-3 rounded-xl text-xs leading-relaxed ${isCorrect ? 'bg-emerald-100/60 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-200/60 text-slate-700 dark:bg-slate-700/60 dark:text-slate-300'}`}>
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!submittedQuiz ? (
              <button
                onClick={handleCheckQuiz}
                disabled={Object.keys(selectedAnswers).length < activeModule.quiz.length}
                className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs tracking-tight rounded-xl shadow-md transition-all self-start"
              >
                Submit Answers
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveModule(null)}
                  className="py-3 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs tracking-tight rounded-xl transition-all"
                >
                  Return to Modules
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Beyond Typing Speed
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight leading-tight">
          Digital Literacy &amp; Cyber Skills
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1.5 max-w-2xl leading-relaxed">
          Comprehensive modern curriculum teaching hardware comprehension, cybersecurity defenses, digital citizenship, and AI literacy.
        </p>
      </div>

      {/* Hero Banner with Generated Asset */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-950 min-h-[220px] flex flex-col justify-end p-6 md:p-8">
        <img
          src="/src/assets/images/digital_literacy_cybersecurity_1793985550494.jpg"
          alt="Digital Literacy and Cybersecurity"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="relative z-10 max-w-xl">
          <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">
            21st Century Foundational Knowledge
          </span>
          <h3 className="text-2xl font-bold text-white mt-1 tracking-tight leading-snug">
            Empowering the Next Generation of Digital Creators
          </h3>
          <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
            Touch typing is the vehicle; digital discernment is the driver. Explore our interactive modules with embedded knowledge quizzes.
          </p>
        </div>
      </div>

      {/* Modules Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DIGITAL_LITERACY_MODULES.map(mod => (
          <div
            key={mod.id}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 text-xs">
                  {mod.module}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{mod.readTime}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {mod.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {mod.summary}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-6">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {mod.quiz.length} Quiz Questions
              </span>
              <button
                onClick={() => handleOpenModule(mod)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-tight rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                Read &amp; Quiz
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
