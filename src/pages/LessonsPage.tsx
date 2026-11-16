import React from 'react';
import { CurriculumView } from '../components/CurriculumView.tsx';

interface LessonsPageProps {
  initialLessonId?: string;
}

export const LessonsPage: React.FC<LessonsPageProps> = ({ initialLessonId }) => {
  return <CurriculumView initialLessonId={initialLessonId} />;
};
export default LessonsPage;
