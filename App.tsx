import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // Changed from LoginPage
import InterestSelectionPage from './pages/InterestSelectionPage';
import FrequencySettingsPage from './pages/FrequencySettingsPage';
import ReviewConfirmPage from './pages/ReviewConfirmPage';
import DashboardPage from './pages/DashboardPage';
import { usePreferences } from './contexts/PreferencesContext';
import { PagePath } from './constants';

const App: React.FC = () => {
  const { preferences } = usePreferences();
  const isAuthenticated = preferences.email !== "" && preferences.whatsappNumber !== "";

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path={PagePath.LANDING} element={<LandingPage />} /> 
          <Route 
            path={PagePath.INTERESTS} 
            element={isAuthenticated ? <InterestSelectionPage /> : <Navigate to={PagePath.LANDING} />} 
          />
          <Route 
            path={PagePath.FREQUENCY} 
            element={isAuthenticated ? <FrequencySettingsPage /> : <Navigate to={PagePath.LANDING} />} 
          />
          <Route 
            path={PagePath.REVIEW} 
            element={isAuthenticated ? <ReviewConfirmPage /> : <Navigate to={PagePath.LANDING} />} 
          />
          <Route 
            path={PagePath.DASHBOARD} 
            element={isAuthenticated ? <DashboardPage /> : <Navigate to={PagePath.LANDING} />} 
          />
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? PagePath.DASHBOARD : PagePath.LANDING} />} 
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;