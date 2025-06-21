

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '../contexts/PreferencesContext';
import Button from '../components/common/Button';
import SectionCard from '../components/common/SectionCard';
import { ICONS, PagePath, INTEREST_TAG_HIERARCHY, FollowUpQuestion as FollowUpQuestionTypeConstant, Tag as TagType } from '../constants';
import { UserPreferences, SelectableTagCategoryKey, CategorySpecificPreferences, AiFollowUpQuestion, FollowUpAnswer } from '../types';


const getTagTextColor = (backgroundColor: string): string => {
  if (backgroundColor.includes('orange')) return 'text-orange-700';
  if (backgroundColor.includes('pink')) return 'text-pink-700';
  if (backgroundColor.includes('purple')) return 'text-purple-700';
  if (backgroundColor.includes('teal')) return 'text-teal-700';
  if (backgroundColor.includes('blue')) return 'text-blue-700';
  if (backgroundColor.includes('primary-lightest')) return 'text-green-800';
  return 'text-primary-darker'; // Default for other primary shades or unmapped
};

const DisplayDetailTag: React.FC<{ label: string; icon?: React.ReactNode, color?: string, className?: string }> = ({ label, icon, color = 'primary-lightest', className = '' }) => {
  const textColorClass = getTagTextColor(color);
  return (
    <span className={`bg-${color} ${textColorClass} px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border border-primary/20 inline-flex items-center gap-1.5 ${className}`}>
      {icon && <span className="text-sm">{icon}</span>}
      {label}
    </span>
  );
};


const PreferenceItem: React.FC<{icon: React.ReactNode, label: string, value: string | React.ReactNode}> = ({ icon, label, value}) => (
  <div className="flex items-start py-3 border-b border-gray-200/70 last:border-b-0">
    <span className="text-primary text-xl mr-3.5 mt-0.5">{icon}</span>
    <div>
      <strong className="font-medium text-gray-700">{label}:</strong>
      <div className="text-gray-600 mt-1">{typeof value === 'string' ? value : <>{value}</>}</div>
    </div>
  </div>
);


const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, updatePreference, resetPreferences } = usePreferences();
  const [alertsPausedState, setAlertsPausedState] = useState(preferences.alertsPaused);

  const handleToggleAlerts = () => {
    const newPausedState = !alertsPausedState;
    setAlertsPausedState(newPausedState);
    updatePreference('alertsPaused', newPausedState);
  };

  const handleLogout = () => {
    resetPreferences(); 
    navigate(PagePath.LOGIN); 
  };

 const getTagDisplayDetails = (tagId: string): { label: string, icon?: string | React.ReactNode } => {
    for (const mainCatKey in INTEREST_TAG_HIERARCHY) {
      const mainCat = INTEREST_TAG_HIERARCHY[mainCatKey as keyof typeof INTEREST_TAG_HIERARCHY];
      const processTags = (tags: TagType[] | undefined) => {
        const foundTag = tags?.find(t => t.id === tagId);
        if (foundTag) return { label: foundTag.label, icon: foundTag.icon };
        return null;
      };

      if (mainCat.tags) {
        const result = processTags(mainCat.tags);
        if (result) return result;
      }
      if (mainCat.subCategories) {
        for (const subCat of mainCat.subCategories) {
          const result = processTags(subCat.tags);
          if (result) return result;
        }
      }
    }
    return { label: tagId }; 
  };
  
  const getFollowUpQuestionText = (categoryKey: SelectableTagCategoryKey, questionId: string): string => {
    const mainCat = INTEREST_TAG_HIERARCHY[categoryKey.toUpperCase() as keyof typeof INTEREST_TAG_HIERARCHY];
    const question = mainCat?.followUpQuestions?.find((q: FollowUpQuestionTypeConstant) => q.id === questionId);
    return question ? question.text : questionId;
  };
  
  const renderCategoryPreferences = (
    categoryKey: SelectableTagCategoryKey, 
    categoryIcon: React.ReactNode, 
    categoryLabel: string
  ) => {
    const categoryData = preferences[categoryKey] as CategorySpecificPreferences;
    const { selectedTags = [], followUpAnswers = {}, instructionTags = [], aiFollowUpQuestions = [], otherSportName } = categoryData;

    const hasSelectedTags = selectedTags.length > 0;
    const hasOtherSportName = categoryKey === 'sports' && otherSportName && otherSportName.trim() !== '';
    
    let hasFollowUpAnswers = false;
    if (followUpAnswers) {
        for (const qId in followUpAnswers) {
            const answerObj = followUpAnswers[qId];
            if ((answerObj.selectedPredefinedTags && answerObj.selectedPredefinedTags.length > 0) || (answerObj.customAnswerViaOther && answerObj.customAnswerViaOther.trim() !== '')) {
                hasFollowUpAnswers = true;
                break;
            }
        }
    }
    const hasInstructionTags = instructionTags.length > 0;
    const hasAiFollowUpAnswers = aiFollowUpQuestions.some(qna => qna.answer.trim() !== '');

    if (!hasSelectedTags && !hasFollowUpAnswers && !hasInstructionTags && !hasAiFollowUpAnswers && !hasOtherSportName) return null;

    return (
      <PreferenceItem 
        icon={categoryIcon}
        label={categoryLabel}
        value={
          <div className="space-y-3 mt-1">
            {hasSelectedTags && (
              <div>
                <strong className="text-xs text-gray-500 block mb-1.5">Topics/Interests:</strong>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tagId => {
                    const { label, icon } = getTagDisplayDetails(tagId);
                    const categoryColor = INTEREST_TAG_HIERARCHY[categoryKey.toUpperCase() as keyof typeof INTEREST_TAG_HIERARCHY]?.color;
                    const lightColor = categoryColor ? `${categoryColor}-light` : 'primary-lightest';
                    return <DisplayDetailTag key={`${categoryKey}-tag-${tagId}`} label={label} icon={icon} color={lightColor}/>;
                  })}
                </div>
              </div>
            )}
            {hasOtherSportName && (
                <div>
                    <strong className="text-xs text-gray-500 block mb-1.5">Specified Other Sport:</strong>
                    <DisplayDetailTag label={otherSportName!} icon={ICONS.OTHER} color="accent-orange-light"/>
                </div>
            )}
            {hasFollowUpAnswers && (
              <div className="pt-2 border-t border-gray-200/50 mt-2.5">
                <strong className="text-xs text-gray-500 block mb-1.5">Fixed Follow-ups:</strong>
                 <div className="space-y-2">
                  {Object.entries(followUpAnswers).map(([questionId, answerObj]) => {
                    const questionText = getFollowUpQuestionText(categoryKey, questionId);
                    const answerParts: React.ReactNode[] = [];
                     if (answerObj.selectedPredefinedTags && answerObj.selectedPredefinedTags.length > 0) {
                        answerObj.selectedPredefinedTags.forEach(tagLabel => {
                            answerParts.push(<DisplayDetailTag key={`${categoryKey}-ff-${questionId}-${tagLabel}`} label={tagLabel} color="accent-pink-light" className="mr-1 mb-1"/>);
                        });
                    }
                    if (answerObj.customAnswerViaOther && answerObj.customAnswerViaOther.trim() !== '') {
                        answerParts.push(<DisplayDetailTag key={`${categoryKey}-ff-${questionId}-other`} label={`Other: ${answerObj.customAnswerViaOther.trim()}`} color="accent-purple-light" className="mr-1 mb-1"/>);
                    }


                    if (answerParts.length === 0) return null;
                    
                    return (
                      <div key={`${categoryKey}-followup-${questionId}`} className="text-xs ml-1">
                        <strong className="text-gray-600 block mb-0.5">{questionText}:</strong>
                        <div className="flex flex-wrap items-center">{answerParts}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
             {hasInstructionTags && (
              <div className="pt-2 border-t border-gray-200/50 mt-2.5">
                <strong className="text-xs text-gray-500 block mb-1.5">Specific Instructions (Tags):</strong>
                 <div className="flex flex-wrap gap-2">
                    {instructionTags.map(tag => (
                        <DisplayDetailTag key={`${categoryKey}-instr-${tag}`} label={tag} icon={ICONS.LIGHTBULB} color="accent-teal-light"/>
                    ))}
                </div>
              </div>
            )}
             {hasAiFollowUpAnswers && (
              <div className="pt-2 border-t border-gray-200/50 mt-2.5">
                <strong className="text-xs text-gray-500 block mb-1.5">AI-Generated Follow-ups:</strong>
                <div className="space-y-1.5">
                  {aiFollowUpQuestions.filter(qna => qna.answer.trim() !== '').map((qna) => (
                      <div key={`${categoryKey}-ai-followup-${qna.id}`} className="text-xs ml-1">
                        <strong className="text-gray-600">{qna.question}:</strong>
                        <span className="ml-1.5 text-gray-500 italic">"{qna.answer}"</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        }
      />
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-lightest via-green-50 to-teal-100 py-10 px-4 sm:px-6 lg:px-8 page-fade-enter">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-secondary tracking-tight">Your Dashboard</h1>
              <p className="text-lg text-gray-600 mt-1">Manage your personalized WhatsApp updates.</p>
            </div>
            <Button onClick={handleLogout} variant="danger" size="md" className="!py-2.5 px-5 shadow-md hover:shadow-lg" leftIcon={ICONS.CANCEL}>
              Logout
            </Button>
          </div>
        </header>

        <SectionCard 
            title="Alert Status" 
            icon={<span className={`text-3xl ${alertsPausedState ? 'text-orange-500' : 'text-primary'}`}>{alertsPausedState ? ICONS.PAUSE : ICONS.PLAY}</span>} 
            className="mb-8 bg-white/95 backdrop-blur-md shadow-xl-dark border border-gray-200/70"
            titleClassName="!text-2xl !text-gray-700 font-semibold"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-5">
            <p className={`text-xl font-semibold ${alertsPausedState ? 'text-orange-600' : 'text-green-700'}`}>
              {alertsPausedState ? 'Updates are Currently Paused' : 'Updates are Active & Running'}
            </p>
            <Button 
              onClick={handleToggleAlerts} 
              variant={alertsPausedState ? 'primary' : 'secondary'} 
              size="md" 
              className={`w-full sm:w-auto !py-3 px-6 shadow-lg hover:shadow-xl ${alertsPausedState ? 'bg-primary hover:bg-primary-dark' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
              leftIcon={alertsPausedState ? ICONS.PLAY : ICONS.PAUSE}
            >
              {alertsPausedState ? 'Resume Updates' : 'Pause Updates'}
            </Button>
          </div>
           {alertsPausedState && (
            <p className="mt-4 text-sm text-gray-600 bg-orange-50 p-3 rounded-md border border-orange-200">
              Your personalized updates are paused. You won't receive any WhatsApp messages until you resume them.
            </p>
          )}
        </SectionCard>

        <SectionCard 
            title="Current Preferences" 
            icon={<span className="text-primary text-3xl">{ICONS.SETTINGS}</span>} 
            className="mb-8 bg-white/95 backdrop-blur-md shadow-xl-dark border border-gray-200/70"
            titleClassName="!text-2xl !text-gray-700 font-semibold"
            headerActions={
                 <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(PagePath.INTERESTS)} 
                    className="border-primary/80 text-primary hover:bg-primary/10 !py-2 px-4"
                    leftIcon={ICONS.EDIT}
                  >
                    Edit All
                  </Button>
            }
        >
          <p className="text-sm text-gray-600 mb-6">These are the active settings defining your updates. Click "Edit All" to modify.</p>
          <div className="space-y-1 text-sm text-gray-700 mb-8">
            <PreferenceItem icon={ICONS.EMAIL} label="Email" value={preferences.email} />
            <PreferenceItem icon={ICONS.WHATSAPP} label="WhatsApp Number" value={preferences.whatsappNumber} />
            
            {renderCategoryPreferences('sports', ICONS.SPORTS, 'Sports Preferences')}
            {renderCategoryPreferences('moviesTV', ICONS.MOVIES, 'Movies & TV Preferences')}
            {renderCategoryPreferences('news', ICONS.NEWS, 'News Preferences')}
            {renderCategoryPreferences('youtube', ICONS.YOUTUBE, 'YouTube Preferences')}
            
            {preferences.customInterestTags.length > 0 && (
              <PreferenceItem
                icon={ICONS.CUSTOM}
                label="Custom Interests"
                value={
                  <div className="flex flex-wrap gap-2 mt-1">
                     {preferences.customInterestTags.map(tag => (
                        <DisplayDetailTag key={`custom-interest-${tag}`} label={tag} icon={ICONS.STAR} color="accent-purple-light"/>
                    ))}
                  </div>
                }
              />
            )}

            <PreferenceItem
              icon={ICONS.CLOCK}
              label="Update Settings"
              value={
                <>
                  <p><strong>Frequency:</strong> {preferences.frequency}
                    {preferences.frequency === "Custom" && preferences.customFrequencyTime && ` at ${preferences.customFrequencyTime}`}
                  </p>
                  <p><strong>Platform:</strong> {preferences.platform}</p>
                </>
              }
            />
          </div>
        </SectionCard>
        
        <SectionCard 
          title="Update History & Analytics" 
          icon={<span className="text-primary text-3xl">📊</span>} 
          className="opacity-80 bg-white/80 backdrop-blur-md shadow-lg border border-gray-200/50 hover:opacity-100"
          titleClassName="!text-xl !text-gray-600"
        >
          <div className="text-center py-5">
            <p className="text-gray-500 font-medium text-lg">Coming Soon!</p>
            <p className="text-gray-500 mt-1">Track updates received and insights into your most engaged topics.</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default DashboardPage;