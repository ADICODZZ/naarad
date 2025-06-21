

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '../contexts/PreferencesContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import WhatsAppPreview from '../components/common/WhatsAppPreview';
import TagButton from '../components/common/TagButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ICONS, PagePath, EXAMPLE_NOTIFICATIONS, INTEREST_TAG_HIERARCHY, MainCategory, SubCategory, Tag as TagType, FollowUpQuestion as FollowUpQuestionType } from '../constants';
import { UserPreferences, SampleMessage, CategoryFollowUpAnswers, SelectableTagCategoryKey as STCKType, CategorySpecificPreferences, AiFollowUpQuestion, FollowUpAnswer } from '../types';
import { generateAiFollowUpQuestions, getTagLabel } from '../services/geminiService';

const InterestSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, updatePreference, setPreferences } = usePreferences();

  const [activeMainCategory, setActiveMainCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [activePreviewMessage, setActivePreviewMessage] = useState<SampleMessage>(EXAMPLE_NOTIFICATIONS.DEFAULT);
  
  const [newCustomInterestTag, setNewCustomInterestTag] = useState('');
  const [newInstructionTag, setNewInstructionTag] = useState('');
  
  const [activeOtherInput, setActiveOtherInput] = useState<string | null>(null);
  const [otherSportNameInput, setOtherSportNameInput] = useState(preferences.sports.otherSportName || '');


  const [isLoadingAiQuestions, setIsLoadingAiQuestions] = useState(false);
  const [aiQuestionsError, setAiQuestionsError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const mainCategoriesArray = Object.values(INTEREST_TAG_HIERARCHY);

  const handleMainCategorySelect = (category: MainCategory) => {
    setValidationErrors([]); // Clear errors on interaction
    if (activeMainCategory === category.id) {
      setActiveMainCategory(null); 
      setActiveSubCategory(null);
      setActivePreviewMessage(EXAMPLE_NOTIFICATIONS.DEFAULT);
    } else {
      setActiveMainCategory(category.id);
      setActiveSubCategory(null); 
      setActivePreviewMessage(EXAMPLE_NOTIFICATIONS[category.id.toUpperCase() as keyof typeof EXAMPLE_NOTIFICATIONS] || EXAMPLE_NOTIFICATIONS.DEFAULT);
    }
    setNewInstructionTag(''); 
    setAiQuestionsError(null); 
    setActiveOtherInput(null); 
    if (category.id !== 'sports') { // Reset sports-specific states if switching away from sports
      setOtherSportNameInput('');
      updatePreference('sports', { ...preferences.sports, otherSportName: undefined });
    } else {
      setOtherSportNameInput(preferences.sports.otherSportName || ''); // Restore if switching back to sports
    }
  };

  const handleSubCategorySelect = (subCategory: SubCategory) => {
     setValidationErrors([]); // Clear errors on interaction
     if (activeSubCategory === subCategory.id) {
      setActiveSubCategory(null); 
       if (subCategory.id === 'sports_other') {
        setOtherSportNameInput('');
        updatePreference('sports', { ...preferences.sports, otherSportName: undefined });
      }
    } else {
      setActiveSubCategory(subCategory.id);
      if (subCategory.id !== 'sports_other') { // Clear otherSportName if a specific sport is chosen
         setOtherSportNameInput('');
         updatePreference('sports', { ...preferences.sports, otherSportName: undefined });
      }
    }
  };

  const handleOtherSportNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationErrors([]);
    const newName = e.target.value;
    setOtherSportNameInput(newName);
    if (activeMainCategory === 'sports' && activeSubCategory === 'sports_other') {
      updatePreference('sports', { ...preferences.sports, otherSportName: newName });
    }
  };
  
  const handleTagToggle = (categoryKey: STCKType, tagId: string) => {
    setValidationErrors([]);
    setPreferences(prev => {
      const currentCategory = prev[categoryKey] as CategorySpecificPreferences; 
      const currentTags = currentCategory.selectedTags || [];
      let newTags = currentTags.includes(tagId)
        ? currentTags.filter(t => t !== tagId)
        : [...currentTags, tagId];
      
      if (categoryKey === 'youtube') {
        const durationSubCategory = INTEREST_TAG_HIERARCHY.YOUTUBE.subCategories?.find(sc => sc.id === 'youtube_duration');
        if (durationSubCategory && durationSubCategory.tags.some(t => t.id === tagId)) {
          const otherDurationTagIds = durationSubCategory.tags.map(t => t.id).filter(id => id !== tagId);
          newTags = newTags.filter(t => !otherDurationTagIds.includes(t));
        }
      }
      const updatedAiFollowUpQuestions = (newTags.length > 0 && currentCategory.aiFollowUpQuestions && currentCategory.aiFollowUpQuestions.length > 0) ? [] : currentCategory.aiFollowUpQuestions;

      return {
        ...prev,
        [categoryKey]: { ...currentCategory, selectedTags: newTags, aiFollowUpQuestions: updatedAiFollowUpQuestions }
      };
    });
    setAiQuestionsError(null); 
  };

  const handleFollowUpPredefinedTagToggle = (categoryKey: STCKType, questionId: string, tagLabel: string) => {
    setValidationErrors([]);
    setPreferences(prev => {
        const currentCategory = prev[categoryKey] as CategorySpecificPreferences;
        const currentAnswers = currentCategory.followUpAnswers || {};
        const currentQuestionAnswer = currentAnswers[questionId] || { selectedPredefinedTags: [], customAnswerViaOther: '' };
        
        const newSelectedTags = currentQuestionAnswer.selectedPredefinedTags.includes(tagLabel)
            ? currentQuestionAnswer.selectedPredefinedTags.filter(t => t !== tagLabel)
            : [...currentQuestionAnswer.selectedPredefinedTags, tagLabel];

        return {
            ...prev,
            [categoryKey]: {
                ...currentCategory,
                followUpAnswers: {
                    ...currentAnswers,
                    [questionId]: { ...currentQuestionAnswer, selectedPredefinedTags: newSelectedTags },
                }
            }
        };
    });
  };

  const handleFollowUpOtherTagToggle = (categoryKey: STCKType, questionId: string) => {
    setValidationErrors([]);
    const uniqueInputId = `${categoryKey}-${questionId}-other`;
    const isCurrentlyActive = activeOtherInput === uniqueInputId;
    setActiveOtherInput(isCurrentlyActive ? null : uniqueInputId);

    if (isCurrentlyActive) { 
        setPreferences(prev => {
            const currentCategory = prev[categoryKey] as CategorySpecificPreferences;
            const currentAnswers = currentCategory.followUpAnswers || {};
            const currentQuestionAnswer = currentAnswers[questionId] || { selectedPredefinedTags: [] };
            return {
                ...prev,
                [categoryKey]: {
                    ...currentCategory,
                    followUpAnswers: {
                        ...currentAnswers,
                        [questionId]: { ...currentQuestionAnswer, customAnswerViaOther: '' }, 
                    }
                }
            };
        });
    }
  };
  
  const handleFollowUpOtherInputChange = (categoryKey: STCKType, questionId: string, value: string) => {
    setValidationErrors([]);
    setPreferences(prev => {
        const currentCategory = prev[categoryKey] as CategorySpecificPreferences;
        const currentAnswers = currentCategory.followUpAnswers || {};
        const currentQuestionAnswer = currentAnswers[questionId] || { selectedPredefinedTags: [] };
        return {
            ...prev,
            [categoryKey]: {
                ...currentCategory,
                followUpAnswers: {
                    ...currentAnswers,
                    [questionId]: { ...currentQuestionAnswer, customAnswerViaOther: value },
                }
            }
        };
    });
  };


  const isTagSelected = (categoryKey: STCKType, tagId: string): boolean => {
    const currentCategory = preferences[categoryKey] as CategorySpecificPreferences; 
    return (currentCategory?.selectedTags || []).includes(tagId);
  };

  const handleAddCustomInterestTag = () => {
    setValidationErrors([]);
    if (newCustomInterestTag.trim() && !preferences.customInterestTags.includes(newCustomInterestTag.trim())) {
      updatePreference('customInterestTags', [...preferences.customInterestTags, newCustomInterestTag.trim()]);
    }
    setNewCustomInterestTag('');
  };

  const handleRemoveCustomInterestTag = (tagToRemove: string) => {
    setValidationErrors([]);
    updatePreference('customInterestTags', preferences.customInterestTags.filter(tag => tag !== tagToRemove));
  };
  
  const handlePopularCustomInterestTagClick = (tagLabel: string) => {
    setValidationErrors([]);
    if (!preferences.customInterestTags.includes(tagLabel)) {
      updatePreference('customInterestTags', [...preferences.customInterestTags, tagLabel]);
    } else {
       handleRemoveCustomInterestTag(tagLabel);
    }
  };

  const handleAddInstructionTag = (categoryKey: STCKType) => {
    setValidationErrors([]);
    if (newInstructionTag.trim()) {
      setPreferences(prev => {
        const currentCategory = prev[categoryKey] as CategorySpecificPreferences;
        const currentInstructionTags = currentCategory.instructionTags || [];
        if (!currentInstructionTags.includes(newInstructionTag.trim())) {
          return {
            ...prev,
            [categoryKey]: {
              ...currentCategory,
              instructionTags: [...currentInstructionTags, newInstructionTag.trim()],
            }
          };
        }
        return prev;
      });
    }
    setNewInstructionTag('');
  };

  const handleRemoveInstructionTag = (categoryKey: STCKType, tagToRemove: string) => {
    setValidationErrors([]);
    setPreferences(prev => {
      const currentCategory = prev[categoryKey] as CategorySpecificPreferences;
      return {
        ...prev,
        [categoryKey]: {
          ...currentCategory,
          instructionTags: (currentCategory.instructionTags || []).filter(tag => tag !== tagToRemove),
        }
      };
    });
  };

  const handlePopularInstructionTagClick = (categoryKey: STCKType, tagLabel: string) => {
     setValidationErrors([]);
     setPreferences(prev => {
      const currentCategory = prev[categoryKey] as CategorySpecificPreferences;
      const currentInstructionTags = currentCategory.instructionTags || [];
      if (!currentInstructionTags.includes(tagLabel)) {
        return {
          ...prev,
          [categoryKey]: { ...currentCategory, instructionTags: [...currentInstructionTags, tagLabel] }
        };
      } else {
         return {
          ...prev,
          [categoryKey]: { ...currentCategory, instructionTags: currentInstructionTags.filter(t => t !== tagLabel) }
        };
      }
    });
  };

  const handleFetchAiQuestions = async () => {
    setValidationErrors([]);
    if (!activeMainCategory || activeMainCategory === 'custom') return;
    const catKey = activeMainCategory as STCKType;
    const currentCategoryData = INTEREST_TAG_HIERARCHY[activeMainCategory.toUpperCase() as keyof typeof INTEREST_TAG_HIERARCHY];
    const categoryPrefs = preferences[catKey];

    if (!categoryPrefs || categoryPrefs.selectedTags.length === 0) {
      setAiQuestionsError("Please select some specific interests/tags for this category first.");
      setPreferences(prev => ({
        ...prev,
        [catKey]: { ...prev[catKey], aiFollowUpQuestions: [] }
      }));
      return;
    }
    
    setIsLoadingAiQuestions(true);
    setAiQuestionsError(null);
    try {
      const selectedTagLabels = categoryPrefs.selectedTags.map(getTagLabel); 
      const fetchedQuestions = await generateAiFollowUpQuestions(currentCategoryData.label, selectedTagLabels);
      
      setPreferences(prev => ({
        ...prev,
        [catKey]: {
          ...prev[catKey],
          aiFollowUpQuestions: fetchedQuestions.map(q => ({ ...q, answer: '' })) 
        }
      }));
    } catch (error) {
      console.error("Error fetching AI questions:", error);
      setAiQuestionsError("Sorry, couldn't fetch clarifying questions. Please try again.");
      setPreferences(prev => ({ ...prev, [catKey]: { ...prev[catKey], aiFollowUpQuestions: [] }}));
    } finally {
      setIsLoadingAiQuestions(false);
    }
  };

  const handleAiAnswerChange = (categoryKey: STCKType, questionId: string, answer: string) => {
    setValidationErrors([]);
    setPreferences(prev => {
      const currentCategory = prev[categoryKey] as CategorySpecificPreferences;
      const updatedAiQuestions = (currentCategory.aiFollowUpQuestions || []).map(q =>
        q.id === questionId ? { ...q, answer } : q
      );
      return {
        ...prev,
        [categoryKey]: {
          ...currentCategory,
          aiFollowUpQuestions: updatedAiQuestions,
        }
      };
    });
  };

  const validateSelections = (): boolean => {
    const errors: string[] = [];
    if (!activeMainCategory) {
      errors.push("Please select at least one broad category to continue.");
    } else {
      const mainCatData = INTEREST_TAG_HIERARCHY[activeMainCategory.toUpperCase() as keyof typeof INTEREST_TAG_HIERARCHY];
      if (mainCatData && mainCatData.id !== 'custom' && mainCatData.subCategories && mainCatData.subCategories.length > 0) {
        if (!activeSubCategory) {
          errors.push(`Please select a sub-category for ${mainCatData.label}.`);
        }
      }
      if (mainCatData && mainCatData.id !== 'custom') {
        const catKey = mainCatData.id as STCKType;
        const categoryPrefs = preferences[catKey];
        if (categoryPrefs && categoryPrefs.selectedTags && categoryPrefs.selectedTags.length > 0) {
          if (!categoryPrefs.aiFollowUpQuestions || categoryPrefs.aiFollowUpQuestions.length === 0) {
            // Check if loading was attempted and failed, which is okay
             if (!isLoadingAiQuestions && !aiQuestionsError && !(categoryPrefs.aiFollowUpQuestions && categoryPrefs.aiFollowUpQuestions.length > 0) ) {
                 // This specific check can be tricky: if questions are empty because they were never fetched, OR fetched and then cleared.
                 // For now, let's assume if tags are selected, engagement (click on "Get Deeper Questions") is desired.
                 // This part might need refinement based on exact desired UX flow for "engagement".
                 // A simpler check: if aiFollowUpQuestions is undefined OR empty AND no error state from fetching.
                 const attemptedAiFetch = (categoryPrefs.aiFollowUpQuestions !== undefined); // implies button was clicked or state was initialized
                 if(!attemptedAiFetch){
                    errors.push(`For ${mainCatData.label}, please engage with the "AI-Generated Rapid Fire" questions to help us understand your preferences better. Click "Get Deeper Questions from AI".`);
                 }
             }
          }
        } else if (mainCatData.id !== 'sports' || (mainCatData.id === 'sports' && (!categoryPrefs || categoryPrefs.selectedTags.length === 0) && !preferences.sports.otherSportName)) {
           // If it's not sports, or it is sports but no tags AND no otherSportName
            errors.push(`Please select some specific interests or tags for ${mainCatData.label}.`);
        }
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = () => {
    if (validateSelections()) {
      navigate(PagePath.FREQUENCY);
    }
  };
  
  const currentMainCategoryData = activeMainCategory ? INTEREST_TAG_HIERARCHY[activeMainCategory.toUpperCase() as keyof typeof INTEREST_TAG_HIERARCHY] : null;
  const currentSubCategoryData = currentMainCategoryData && activeSubCategory 
    ? currentMainCategoryData.subCategories?.find(sc => sc.id === activeSubCategory) || null
    : null;

  const currentCategoryAiQuestions = currentMainCategoryData && currentMainCategoryData.id !== 'custom'
    ? preferences[currentMainCategoryData.id as STCKType]?.aiFollowUpQuestions || []
    : [];
  const showAiSection = currentMainCategoryData && currentMainCategoryData.id !== 'custom' && (preferences[currentMainCategoryData.id as STCKType]?.selectedTags.length ?? 0) > 0;


  const renderActiveTagsList = (tags: string[], onRemove: (tag: string) => void, categoryColor: string) => (
    <div className="flex flex-wrap gap-2 mt-3">
      {tags.map(tag => (
        <div key={tag} className={`flex items-center bg-${categoryColor}/20 text-${categoryColor} text-xs font-medium px-3 py-1.5 rounded-full shadow-sm border border-${categoryColor}/30`}>
          <span>{tag}</span>
          <button 
            onClick={() => onRemove(tag)} 
            className={`ml-2 text-${categoryColor}/70 hover:text-${categoryColor}`}
            aria-label={`Remove tag ${tag}`}
          >
            {ICONS.TRASH}
          </button>
        </div>
      ))}
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/95 via-secondary to-gray-900 py-8 px-4 sm:px-6 lg:px-8 text-white page-fade-enter">
      <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl p-6 md:p-10 border border-white/10">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Tailor Your Information Feed
          </h1>
          <p className="text-lg text-primary-lighter/80 mt-4 max-w-2xl mx-auto">
            Select your interests to receive perfectly curated updates. The more specific you are, the better!
          </p>
        </header>

        {validationErrors.length > 0 && (
          <div className="mb-8 p-4 bg-red-800/70 border border-red-600 text-red-100 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">Please address the following:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-grow lg:w-2/3 space-y-10">
            {/* --- Section 1: Broad Categories --- */}
            <section>
              <h2 className="text-2xl font-semibold text-primary-lighter mb-6">1. Choose Broad Categories:</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {mainCategoriesArray.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleMainCategorySelect(category)}
                    className={`p-5 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 focus:outline-none focus:ring-4 
                      ${activeMainCategory === category.id 
                        ? `bg-${category.color} text-${category.textColor} ring-4 ring-white/90 scale-105 shadow-xl` 
                        : `bg-${category.color}/60 text-white hover:bg-${category.color}/80 focus:ring-${category.color}/50 focus:ring-offset-secondary/30`}
                    `}
                    aria-pressed={activeMainCategory === category.id}
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="text-4xl md:text-5xl">{category.icon}</span>
                      <span className="text-md md:text-lg font-semibold tracking-wide">{category.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* --- Section 2 & 3: Details & AI Rapid Fire --- */}
            {currentMainCategoryData && (
              <section className={`p-6 bg-white/10 rounded-xl shadow-lg transition-all duration-500 ease-in-out ${activeMainCategory ? 'opacity-100 max-h-[9000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                {currentMainCategoryData.id !== 'custom' ? ( 
                  <>
                    <h3 className="text-2xl font-semibold text-primary-lighter mb-6">
                      2. Refine <span className={`font-bold text-${currentMainCategoryData.color}`}>{currentMainCategoryData.label}</span> Details:
                    </h3>
                    
                    {currentMainCategoryData.subCategories && currentMainCategoryData.subCategories.length > 0 && (
                      <div className="space-y-4 mb-6">
                        <label className="block text-md font-medium text-primary-lighter/90 mb-2">Select sub-categories (optional):</label>
                        <div className="flex flex-wrap gap-3">
                          {currentMainCategoryData.subCategories.map(subCat => (
                            <TagButton
                              key={subCat.id}
                              label={subCat.label}
                              icon={subCat.icon || ICONS.TAG}
                              isSelected={activeSubCategory === subCat.id}
                              onClick={() => handleSubCategorySelect(subCat)}
                              color={`bg-${currentMainCategoryData.color}/20 hover:bg-${currentMainCategoryData.color}/40`}
                              textColor="text-white/90"
                              selectedColor={`bg-${currentMainCategoryData.color}`}
                              selectedTextColor={`text-${currentMainCategoryData.textColor}`}
                              size="md" 
                            />
                          ))}
                        </div>
                        {activeMainCategory === 'sports' && activeSubCategory === 'sports_other' && (
                          <Input
                            id="other-sport-name"
                            label="Specify 'Other Sport' Name:"
                            placeholder="e.g., Chess, Surfing, Archery"
                            value={otherSportNameInput}
                            onChange={handleOtherSportNameChange}
                            inputClassName="mt-2 bg-white/5 placeholder-gray-400/70 text-white border-white/20 focus:border-primary-lightest text-sm py-2"
                            labelClassName="!text-primary-lighter/80 !font-medium !text-sm"
                          />
                        )}
                      </div>
                    )}

                    {(currentSubCategoryData && currentSubCategoryData.tags.length > 0) || (currentMainCategoryData.tags && currentMainCategoryData.tags.length > 0 && !currentMainCategoryData.subCategories) ? (
                      <div className="space-y-4">
                        <label className="block text-md font-medium text-primary-lighter/90 mb-2">
                          {currentSubCategoryData ? `Popular tags for ${currentSubCategoryData.label}:` : `Popular tags for ${currentMainCategoryData.label}:`}
                        </label>
                        <div className="flex flex-wrap gap-3"> 
                          {(currentSubCategoryData?.tags || currentMainCategoryData.tags || []).map((tag: TagType) => (
                            <TagButton
                              key={tag.id}
                              label={tag.label}
                              icon={tag.icon}
                              isSelected={isTagSelected(currentMainCategoryData.id as STCKType, tag.id)}
                              onClick={() => handleTagToggle(currentMainCategoryData.id as STCKType, tag.id)}
                              color="bg-gray-600/50 hover:bg-gray-600/70"
                              textColor="text-gray-100"
                              selectedColor={`bg-${currentMainCategoryData.color}`}
                              selectedTextColor={`text-${currentMainCategoryData.textColor}`}
                              size="md" 
                            />
                          ))}
                        </div>
                      </div>
                    ) : activeSubCategory && (!currentSubCategoryData || currentSubCategoryData.tags.length === 0) && activeSubCategory !== 'sports_other' ? (
                        <p className="text-primary-lighter/70 italic">No specific tags for {currentSubCategoryData?.label}.</p>
                    ) : null }

                    {currentMainCategoryData.followUpQuestions && currentMainCategoryData.followUpQuestions.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <h3 className="text-xl font-semibold text-primary-lighter mb-2 flex items-center">
                          <span className={`text-${currentMainCategoryData.color} mr-2 text-2xl`}>{ICONS.LIGHTBULB}</span>
                           Fixed Follow-Up Questions for <span className={`font-bold text-${currentMainCategoryData.color}`}>{currentMainCategoryData.label}</span>:
                        </h3>
                        <p className="text-sm text-primary-lighter/80 mb-6 ml-8">
                          {currentMainCategoryData.followUpHelperText || `Answer a few questions to fine-tune your ${currentMainCategoryData.label} updates.`}
                        </p>
                        <div className="space-y-8 ml-8">
                          {currentMainCategoryData.followUpQuestions.map((question: FollowUpQuestionType) => {
                            const catKey = currentMainCategoryData.id as STCKType;
                            const currentAnswer = preferences[catKey]?.followUpAnswers?.[question.id] || { selectedPredefinedTags: [], customAnswerViaOther: '' };
                            const otherInputId = `${catKey}-${question.id}-other`;
                            const isOtherSelected = activeOtherInput === otherInputId;

                            let dynamicPredefinedTags = question.predefinedAnswerTags || [];
                            if (catKey === 'sports' && currentSubCategoryData) {
                                if (question.id === 'favTeam' && currentSubCategoryData.popularTeams) {
                                    dynamicPredefinedTags = currentSubCategoryData.popularTeams;
                                } else if (question.id === 'favPlayer' && currentSubCategoryData.popularPlayers) {
                                    dynamicPredefinedTags = currentSubCategoryData.popularPlayers;
                                }
                            }
                            // If 'Other Sport' is selected, or no specific popular tags for the sport, rely more on "Other"
                            if (catKey === 'sports' && (activeSubCategory === 'sports_other' || !currentSubCategoryData || (question.id === 'favTeam' && !currentSubCategoryData.popularTeams) || (question.id === 'favPlayer' && !currentSubCategoryData.popularPlayers))) {
                                dynamicPredefinedTags = question.predefinedAnswerTags?.filter(tag => !tag.id.startsWith('favTeam_') && !tag.id.startsWith('favPlayer_')) || []; // Keep generic fallbacks if any
                            }


                            return (
                              <div key={question.id}>
                                <label className="block text-md font-medium text-primary-lighter/90 mb-3">{question.text}</label>
                                <div className="flex flex-wrap gap-3">
                                  {dynamicPredefinedTags.map(tag => (
                                    <TagButton
                                      key={tag.id}
                                      label={tag.label}
                                      icon={tag.icon}
                                      isSelected={currentAnswer.selectedPredefinedTags.includes(tag.label)}
                                      onClick={() => handleFollowUpPredefinedTagToggle(catKey, question.id, tag.label)}
                                      color="bg-gray-600/50 hover:bg-gray-600/70"
                                      textColor="text-gray-100"
                                      selectedColor={`bg-${currentMainCategoryData.color}`}
                                      selectedTextColor={`text-${currentMainCategoryData.textColor}`}
                                    />
                                  ))}
                                  {question.hasOtherOption && (
                                    <TagButton
                                      label="Other (Specify)"
                                      icon={ICONS.OTHER}
                                      isSelected={isOtherSelected}
                                      onClick={() => handleFollowUpOtherTagToggle(catKey, question.id)}
                                      color="bg-gray-500/50 hover:bg-gray-500/70"
                                      textColor="text-gray-100"
                                      selectedColor={`bg-${currentMainCategoryData.color}/70`}
                                      selectedTextColor={`text-${currentMainCategoryData.textColor}`}
                                    />
                                  )}
                                </div>
                                {isOtherSelected && question.hasOtherOption && (
                                  <Input
                                    id={otherInputId}
                                    placeholder="Please specify your answer"
                                    value={currentAnswer.customAnswerViaOther || ''}
                                    onChange={(e) => handleFollowUpOtherInputChange(catKey, question.id, e.target.value)}
                                    inputClassName="mt-3 bg-white/5 placeholder-gray-400/70 text-white border-white/20 focus:border-primary-lightest text-sm py-2"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Category Specific Instructions (Tag-based) */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <h3 className="text-xl font-semibold text-primary-lighter/90 mb-3 flex items-center"> 
                           <span className={`mr-2 text-2xl text-${currentMainCategoryData.color}`}>{ICONS.SETTINGS}</span>
                            Specific Instructions for <span className={`font-bold text-${currentMainCategoryData.color}`}>{currentMainCategoryData.label}</span> (as Tags):
                        </h3>
                         {currentMainCategoryData.popularInstructionTags && currentMainCategoryData.popularInstructionTags.length > 0 && (
                            <>
                                <p className="text-sm text-primary-lighter/70 mb-3 ml-8">Suggested instructions (tap to add/remove):</p>
                                <div className="flex flex-wrap gap-3 mb-5 ml-8">
                                    {currentMainCategoryData.popularInstructionTags.map(tag => (
                                        <TagButton
                                            key={tag.id}
                                            label={tag.label}
                                            icon={tag.icon || ICONS.TAG}
                                            isSelected={(preferences[currentMainCategoryData.id as STCKType]?.instructionTags || []).includes(tag.label)}
                                            onClick={() => handlePopularInstructionTagClick(currentMainCategoryData.id as STCKType, tag.label)}
                                            color="bg-gray-600/50 hover:bg-gray-600/70"
                                            textColor="text-gray-100"
                                            selectedColor={`bg-${currentMainCategoryData.color}`}
                                            selectedTextColor={`text-${currentMainCategoryData.textColor}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                        <p className="text-sm text-primary-lighter/70 mb-2 ml-8">Your custom instructions:</p>
                        <div className="flex items-center gap-3 mb-3 ml-8 bg-white/10 p-3 rounded-lg border border-white/15 shadow-sm">
                            <Input
                                id={`new-instruction-tag-${currentMainCategoryData.id}`}
                                placeholder="Type custom instruction and press Add"
                                value={newInstructionTag}
                                onChange={(e) => setNewInstructionTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddInstructionTag(currentMainCategoryData.id as STCKType)}
                                inputClassName="!bg-transparent placeholder-gray-400/70 text-white !border-none focus:!ring-0 !py-2.5"
                                className="flex-grow !mb-0" // remove bottom margin from Input wrapper
                            />
                            <Button onClick={() => handleAddInstructionTag(currentMainCategoryData.id as STCKType)} size="md" variant="outline" className={`border-${currentMainCategoryData.color}/70 text-${currentMainCategoryData.color} hover:bg-${currentMainCategoryData.color}/20 !px-4 !py-2.5 shadow-md hover:shadow-lg`}>{ICONS.PLUS}</Button>
                        </div>
                         {preferences[currentMainCategoryData.id as STCKType]?.instructionTags && preferences[currentMainCategoryData.id as STCKType]?.instructionTags.length > 0 && (
                            <div className="ml-8">
                                {renderActiveTagsList(preferences[currentMainCategoryData.id as STCKType]?.instructionTags || [], (tag) => handleRemoveInstructionTag(currentMainCategoryData.id as STCKType, tag), currentMainCategoryData.color)}
                            </div>
                        )}
                    </div>

                    {/* AI-Generated Rapid Fire Questions Section */}
                    {showAiSection && (
                      <div className="mt-10 pt-8 border-t border-white/20">
                        <h3 className="text-2xl font-semibold text-primary-lighter mb-3 flex items-center">
                          <span className="text-yellow-400 mr-3 text-3xl animate-pulse" role="img" aria-label="AI Sparkle">🔥</span>
                           Part 3: AI-Generated Rapid Fire 
                           (<span className={`font-bold text-${currentMainCategoryData.color}`}>{currentMainCategoryData.label}</span>)
                        </h3>
                        <p className="text-sm text-primary-lighter/80 mb-5">
                          Let AI ask a few more questions to understand your preferences for <span className={`font-bold text-${currentMainCategoryData.color}`}>{currentMainCategoryData.label}</span> even better.
                        </p>
                        
                        {(currentCategoryAiQuestions.length === 0 && !isLoadingAiQuestions && !aiQuestionsError) && (
                            <Button 
                                onClick={handleFetchAiQuestions} 
                                variant="outline" 
                                className={`border-yellow-400/70 text-yellow-400 hover:bg-yellow-400/20 w-full md:w-auto`}
                                leftIcon={<span role="img" aria-label="AI Wand">✨</span>}
                            >
                                Get Deeper Questions from AI
                            </Button>
                        )}

                        {isLoadingAiQuestions && <LoadingSpinner text="AI is thinking of some questions..." />}
                        {aiQuestionsError && <p className="text-red-400 bg-red-900/50 p-3 rounded-md my-3">{aiQuestionsError}</p>}
                        
                        {!isLoadingAiQuestions && currentCategoryAiQuestions.length > 0 && (
                          <div className="space-y-6 mt-5 bg-white/5 p-5 rounded-lg">
                            {currentCategoryAiQuestions.map((qna) => (
                              <Input
                                key={qna.id}
                                label={qna.question}
                                id={`ai-q-${qna.id}`}
                                placeholder="Your answer here..."
                                value={qna.answer}
                                onChange={(e) => handleAiAnswerChange(currentMainCategoryData.id as STCKType, qna.id, e.target.value)}
                                labelClassName="!text-primary-lighter/90 !font-medium !text-sm"
                                inputClassName="bg-white/5 placeholder-gray-400/70 text-white border-white/20 focus:border-primary-lightest text-sm py-2"
                              />
                            ))}
                             <Button 
                                onClick={handleFetchAiQuestions} 
                                variant="ghost" 
                                size="sm"
                                className={`text-yellow-400/80 hover:text-yellow-300 hover:bg-yellow-400/10 mt-3`}
                                leftIcon={<span role="img" aria-label="AI Refresh">🔄</span>}
                                disabled={isLoadingAiQuestions}
                            >
                                {isLoadingAiQuestions ? 'Regenerating...' : 'Regenerate AI Questions'}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : ( 
                  <>
                    <h3 className="text-2xl font-semibold text-primary-lighter mb-5">
                      2. Define Your <span className={`font-bold text-${currentMainCategoryData.color}`}>Custom</span> Interests (as Tags):
                    </h3>
                    {currentMainCategoryData.tags && currentMainCategoryData.tags.length > 0 && (
                         <>
                            <p className="text-sm text-primary-lighter/70 mb-3">Suggested interests (tap to add/remove):</p>
                            <div className="flex flex-wrap gap-3 mb-6">
                                {currentMainCategoryData.tags.map(tag => (
                                    <TagButton
                                        key={tag.id}
                                        label={tag.label}
                                        icon={tag.icon || ICONS.CUSTOM}
                                        isSelected={preferences.customInterestTags.includes(tag.label)}
                                        onClick={() => handlePopularCustomInterestTagClick(tag.label)}
                                        color="bg-gray-600/50 hover:bg-gray-600/70"
                                        textColor="text-gray-100"
                                        selectedColor={`bg-${currentMainCategoryData.color}`}
                                        selectedTextColor={`text-${currentMainCategoryData.textColor}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                    <p className="text-sm text-primary-lighter/70 mb-2">Your unique interests:</p>
                    <div className="flex items-center gap-3 mb-3 bg-white/10 p-3 rounded-lg border border-white/15 shadow-sm">
                        <Input
                            id="new-custom-interest-tag"
                            placeholder="Type interest and press Add"
                            value={newCustomInterestTag}
                            onChange={(e) => setNewCustomInterestTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomInterestTag()}
                            inputClassName="!bg-transparent placeholder-gray-400/70 text-white !border-none focus:!ring-0 !py-2.5"
                            className="flex-grow !mb-0"
                        />
                        <Button onClick={handleAddCustomInterestTag} size="md" variant="outline" className={`border-${currentMainCategoryData.color}/70 text-${currentMainCategoryData.color} hover:bg-${currentMainCategoryData.color}/20 !px-4 !py-2.5 shadow-md hover:shadow-lg`}>{ICONS.PLUS}</Button>
                    </div>
                     {preferences.customInterestTags && preferences.customInterestTags.length > 0 && (
                        renderActiveTagsList(preferences.customInterestTags, handleRemoveCustomInterestTag, currentMainCategoryData.color)
                    )}
                  </>
                )}
              </section>
            )}
            
            <div className="mt-12 pt-8 border-t border-primary-lighter/20 flex justify-end">
              <Button onClick={handleSubmit} variant="primary" size="lg" className="bg-primary hover:bg-primary-dark text-white !py-3.5 px-10 shadow-lg hover:shadow-xl">
                Next: Set Update Frequency {ICONS.ARROW_RIGHT}
              </Button>
            </div>
          </div>

          <div className="flex-shrink-0 lg:w-1/3 mt-8 lg:mt-0">
            <div className="sticky top-8 space-y-5">
              <div>
                <h3 className="text-xl font-semibold text-primary-lighter mb-2 text-center lg:text-left">Live Preview</h3>
                <p className="text-sm text-primary-lighter/70 mb-4 text-center lg:text-left">See a sample WhatsApp update based on the currently selected category.</p>
              </div>
              <div className="border border-gray-400/20 rounded-xl overflow-hidden shadow-2xl bg-secondary/30">
                <WhatsAppPreview message={activePreviewMessage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestSelectionPage;