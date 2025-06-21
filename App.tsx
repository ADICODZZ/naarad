import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import InterestSelectionPage from './pages/InterestSelectionPage';
import FrequencySettingsPage from './pages/FrequencySettingsPage';
import ReviewConfirmPage from './pages/ReviewConfirmPage';
import DashboardPage from './pages/DashboardPage';
import { usePreferences } from './contexts/PreferencesContext';

const App: React.FC = () => {
  const { preferences } = usePreferences();
  const isAuthenticated = preferences.email !== "" && preferences.whatsappNumber !== "";

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/interests" 
            element={isAuthenticated ? <InterestSelectionPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/frequency" 
            element={isAuthenticated ? <FrequencySettingsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/review" 
            element={isAuthenticated ? <ReviewConfirmPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;