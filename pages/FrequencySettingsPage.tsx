

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '../contexts/PreferencesContext';
import Button from '../components/common/Button';
import TagButton from '../components/common/TagButton'; 
import Input from '../components/common/Input';
import SectionCard from '../components/common/SectionCard';
import { ICONS, PagePath } from '../constants';
import { UpdateFrequency } from '../types';

const FrequencySettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, updatePreference } = usePreferences();
  const [customTime, setCustomTime] = useState(preferences.customFrequencyTime || "09:00");
  const [timeError, setTimeError] = useState('');

  const frequencyOptions = Object.values(UpdateFrequency);

  const handleFrequencyTagSelect = (newFrequency: UpdateFrequency) => {
    updatePreference('frequency', newFrequency);
    if (newFrequency !== UpdateFrequency.CUSTOM) {
      updatePreference('customFrequencyTime', undefined);
      setTimeError(''); // Clear time error if not custom
    } else {
      updatePreference('customFrequencyTime', customTime); // Ensure customTime from state is set
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setCustomTime(newTime);
    if (preferences.frequency === UpdateFrequency.CUSTOM) {
      updatePreference('customFrequencyTime', newTime);
    }
    if (newTime) {
        setTimeError('');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (preferences.frequency === UpdateFrequency.CUSTOM && !customTime) {
        setTimeError("Please specify a time for custom frequency.");
        return;
    }
    setTimeError('');
    navigate(PagePath.REVIEW);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-lightest via-green-50 to-teal-100 py-10 px-4 sm:px-6 lg:px-8 page-fade-enter">
      <div className="max-w-xl mx-auto">
        <header className="text-center mb-12">
           <span className="inline-block p-3 bg-primary text-white rounded-full shadow-lg mb-4 ring-4 ring-primary-lighter">
            {ICONS.CLOCK}
          </span>
          <h1 className="text-4xl font-bold text-secondary tracking-tight">Update Cadence</h1>
          <p className="text-lg text-gray-600 mt-3">Choose how often you'd like to receive your personalized updates.</p>
        </header>

        <form onSubmit={handleSubmit}>
          <SectionCard 
            title="Frequency & Timing" 
            icon={<span className="text-primary text-3xl">{ICONS.BELL}</span>} 
            className="bg-white/95 backdrop-blur-md shadow-xl-dark border border-gray-200/70"
            titleClassName="!text-2xl !text-gray-700 font-semibold"
          >
            <div className="mb-8">
              <label className="block text-md font-semibold text-gray-700 mb-4">How often should updates arrive?</label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {frequencyOptions.map(freq => (
                  <TagButton
                    key={freq}
                    label={freq}
                    isSelected={preferences.frequency === freq}
                    onClick={() => handleFrequencyTagSelect(freq)}
                    size="lg" // Larger buttons for better clickability
                    color="bg-gray-100 hover:bg-gray-200 border border-gray-300"
                    textColor="text-gray-700"
                    selectedColor="bg-primary ring-2 ring-primary-dark shadow-lg" // More prominent selected state
                    selectedTextColor="text-white"
                    className="!rounded-lg w-full justify-center !py-3" // Full width for grid
                  />
                ))}
              </div>
            </div>
            
            {preferences.frequency === UpdateFrequency.CUSTOM && (
              <div className="mt-6 p-4 bg-primary-lightest rounded-lg border border-primary/20 transition-all duration-300 ease-in-out">
                <Input
                    label="Preferred delivery time"
                    type="time"
                    id="customTime"
                    value={customTime}
                    onChange={handleTimeChange}
                    inputClassName="bg-white placeholder-gray-500 text-gray-900 border-gray-300 focus:border-primary focus:ring-primary"
                    labelClassName="text-gray-700 !font-medium text-md"
                    error={timeError}
                    required
                />
              </div>
            )}

             <div className="mt-10">
                <p className="block text-md font-semibold text-gray-700 mb-3">Delivery Platform:</p>
                <div className="bg-primary-lighter/60 p-4 rounded-lg border-2 border-primary/40 shadow-sm">
                    <div className="flex items-center">
                        <input
                            id="whatsapp-platform"
                            name="platform"
                            type="radio"
                            checked={preferences.platform === "WhatsApp"}
                            readOnly 
                            className="focus:ring-primary h-5 w-5 text-primary border-gray-400 cursor-not-allowed"
                        />
                        <label htmlFor="whatsapp-platform" className="ml-3 block text-md font-medium text-secondary flex items-center">
                            <span className="mr-2 text-xl">{ICONS.WHATSAPP}</span> WhatsApp
                        </label>
                    </div>
                    <p className="ml-9 mt-1 text-xs text-gray-600">(Currently the only platform. More coming soon!)</p>
                </div>
            </div>
          </SectionCard>

          <div className="mt-12 pt-8 border-t border-gray-300/70 flex justify-between items-center">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(PagePath.INTERESTS)} 
              className="border-primary/80 text-primary hover:bg-primary/10 !py-3 px-6"
              leftIcon={ICONS.ARROW_LEFT}
            >
              Back to Interests
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-white !py-3.5 px-8 shadow-lg hover:shadow-xl"
              rightIcon={ICONS.ARROW_RIGHT}
            >
              Review & Confirm
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FrequencySettingsPage;