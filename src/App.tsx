import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar, ActiveView } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { CurriculumView } from './components/CurriculumView';
import { TypingTestView } from './components/TypingTestView';
import { GamesHub } from './components/games/GamesHub';
import { DigitalLiteracyView } from './components/DigitalLiteracyView';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

function MainApp() {
  const { user } = useApp();
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [targetLessonId, setTargetLessonId] = useState<string | undefined>(undefined);

  // Check URL query parameters (e.g. ?autostart=1 or ?view=test)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        setActiveView('curriculum');
      } else if (params.get('view')) {
        const v = params.get('view') as ActiveView;
        if (['landing', 'dashboard', 'curriculum', 'test', 'games', 'literacy', 'teacher', 'admin'].includes(v)) {
          setActiveView(v);
        }
      }
    }
  }, []);

  const handleStartCurriculum = (lessonId?: string) => {
    setTargetLessonId(lessonId);
    setActiveView('curriculum');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar
        activeView={activeView}
        setActiveView={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeView === 'landing' && (
          <LandingPage
            onStartLearning={() => handleStartCurriculum()}
            onTakeTest={() => handleNavigate('test')}
            onExploreGames={() => handleNavigate('games')}
          />
        )}

        {activeView === 'dashboard' && (
          <StudentDashboard
            onNavigateToCurriculum={handleStartCurriculum}
            onNavigateToTest={() => handleNavigate('test')}
          />
        )}

        {activeView === 'curriculum' && (
          <CurriculumView initialLessonId={targetLessonId} />
        )}

        {activeView === 'test' && (
          <TypingTestView />
        )}

        {activeView === 'games' && (
          <GamesHub />
        )}

        {activeView === 'literacy' && (
          <DigitalLiteracyView />
        )}

        {activeView === 'teacher' && (
          <TeacherDashboard />
        )}

        {activeView === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
