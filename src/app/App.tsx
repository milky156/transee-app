import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { RouteFinder } from './components/RouteFinder';
import { FareEstimator } from './components/FareEstimator';
import { TransportMap } from './components/TransportMap';

type Section = 'landing' | 'finder' | 'fare' | 'map';

export default function App() {
  const [currentSection, setCurrentSection] = useState<Section>('landing');
  const [quickDestination, setQuickDestination] = useState<string>('');

  const handleNavigate = (section: Section) => {
    setCurrentSection(section);
    setQuickDestination('');
  };

  const handleQuickDestination = (stopId: string) => {
    setQuickDestination(stopId);
    setCurrentSection('finder');
  };

  return (
    <div className="size-full">
      {currentSection === 'landing' && (
        <LandingPage
          onNavigate={handleNavigate}
          onQuickDestination={handleQuickDestination}
        />
      )}

      {currentSection === 'finder' && (
        <RouteFinder
          onBack={() => handleNavigate('landing')}
          initialDestination={quickDestination}
        />
      )}

      {currentSection === 'fare' && (
        <FareEstimator onBack={() => handleNavigate('landing')} />
      )}

      {currentSection === 'map' && (
        <TransportMap onBack={() => handleNavigate('landing')} />
      )}
    </div>
  );
}