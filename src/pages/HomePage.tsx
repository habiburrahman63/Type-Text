import React from 'react';
import { LandingPage } from '../components/LandingPage.tsx';

interface HomePageProps {
  onStartLearning: () => void;
  onTakeTest: () => void;
  onExploreGames: () => void;
  onOpenTeacher?: () => void;
}

export const HomePage: React.FC<HomePageProps> = (props) => {
  return <LandingPage {...props} />;
};
export default HomePage;
