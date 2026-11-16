import React from 'react';
import { StudentDashboard } from '../components/StudentDashboard.tsx';

interface DashboardPageProps {
  onNavigateToCurriculum: (lessonId?: string) => void;
  onNavigateToTest: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  return <StudentDashboard {...props} />;
};
export default DashboardPage;
