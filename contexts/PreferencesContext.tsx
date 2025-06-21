import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { UserPreferences, initialPreferencesData } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

interface PreferencesContextType {
  preferences: UserPreferences;
  setPreferences: Dispatch<SetStateAction<UserPreferences>>;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storedPreferences, setStoredPreferences] = useLocalStorage<UserPreferences>('userPreferences', initialPreferencesData);
  const [preferences, setPreferences] = useState<UserPreferences>(storedPreferences);

  useEffect(() => {
    setStoredPreferences(preferences);
  }, [preferences, setStoredPreferences]);

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    setPreferences(initialPreferencesData);
  };

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences, updatePreference, resetPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
