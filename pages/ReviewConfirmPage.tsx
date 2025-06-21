

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '../contexts/PreferencesContext';
import Button from '../components/common/Button';
import SectionCard from '../components/common/SectionCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import WhatsAppPreview from '../components/common/WhatsAppPreview';
import { ICONS, PagePath, INTEREST_TAG_HIERARCHY, FollowUpQuestion as FollowUpQuestionTypeConstant, Tag as TagType } from '../constants';
import { generateSampleMessage } from '../services/geminiService';
import { UserPreferences, SampleMessage, SelectableTagCategoryKey, CategorySpecificPreferences, AiFollowUpQuestion, FollowUpAnswer } from '../types'; 
import { API_BASE_URL } from '../config'
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
  <div className="flex items-start py-2.5 border-b border-gray-200/70 last:border-b-0">
    <span className="text-primary text-xl mr-3 mt-0.5">{icon}</span>
    <div>
      <strong className="font-medium text-gray-700">{label}:</strong>
      <div className="text-gray-600 mt-1">{typeof value === 'string' ? value : <>{value}</>}</div>
    </div>
  </div>
);


const ReviewConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, resetPreferences } = usePreferences();
  const [sampleMessage, setSampleMessage] = useState<SampleMessage | null>(null);
  const [isLoadingSample, setIsLoadingSample] = useState<boolean>(true); 
  const [errorSample, setErrorSample] = useState<string>('');
  const userId = localStorage.getItem('userId');

  const fetchSampleMessage = async () => {
    setIsLoadingSample(true);
    setErrorSample('');
    try {
      const message = await generateSampleMessage(preferences);
      setSampleMessage(message);
    } catch (error: any) {
      console.error("Failed to generate sample message:", error);
      setErrorSample(error.message || "Could not fetch sample message.");
      setSampleMessage({ summaryText: "Your personalized update would appear here! (Error fetching live sample)", imageUrl: "⚠️"});
    } finally {
      setIsLoadingSample(false);
    }
  };
  
  const getTagDisplayDetails = (tagId: string): { label: string, icon?: string | React.ReactNode } => {
    for (const mainCatKey in INTEREST_TAG_HIERARCHY) {
      const mainCat = INTEREST_TAG_HIERARCHY[mainCatKey as keyof typeof INTEREST_TAG_HIERARCHY];
      const processTags = (tags: TagType[] | undefined ) => {
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

  const handleConfirm = () => {
  const userId = localStorage.getItem('userId'); // Retrieve stored userId
  console.log(userId, "<< userId");
  console.log("Preferences confirmed:", preferences);

  if (!userId) {
    console.error("User ID not found. Cannot submit preferences.");
    return;
  }

  // Save preferences to localStorage
  localStorage.setItem('preferences', JSON.stringify(preferences));

  // Send preferences to backend
  fetch(`${API_BASE_URL}/preferences/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences),
  })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to save preferences');
      return res.json();
    })
    .then((data) => {
      console.log('Backend response:', data);

      alert("Preferences Saved! You're all set. Redirecting to your dashboard...");
      navigate(PagePath.DASHBOARD);
    })
    .catch((err) => {
      console.error('Error saving preferences:', err);
      alert("Something went wrong while saving preferences.");
    });
};


  useEffect(() => {
    fetchSampleMessage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

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
                    return <DisplayDetailTag key={`${categoryKey}-tag-${tagId}`} label={label} icon={icon} color={lightColor} />;
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
      <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md shadow-xl-dark rounded-xl p-6 md:p-10 border border-gray-200/70">
        <header className="text-center mb-10">
           <span className="inline-block p-3 bg-primary text-white rounded-full shadow-lg mb-4 ring-4 ring-primary-lighter">
            {ICONS.CHECK}
          </span>
          <h1 className="text-4xl font-bold text-secondary tracking-tight">Final Review</h1>
          <p className="text-lg text-gray-600 mt-3">Almost there! Please double-check your preferences before confirming.</p>
        </header>

        <SectionCard 
            title="Your Personalization Summary" 
            icon={<span className="text-primary text-3xl">{ICONS.SUMMARY}</span>} 
            className="mb-8 bg-white shadow-card border border-gray-200/50"
            titleClassName="!text-2xl !text-gray-700 font-semibold"
        >
          <div className="space-y-1 text-sm text-gray-700">
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
            title="Sample Update Preview" 
            icon={<span className="text-primary text-3xl">{ICONS.TEST}</span>} 
            className="bg-white shadow-card border border-gray-200/50"
            titleClassName="!text-2xl !text-gray-700 font-semibold"
        >
            {isLoadingSample && <LoadingSpinner text="Crafting your sample update..." />}
            {errorSample && !isLoadingSample && (
                <div className="my-2 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
                    <p><strong>Error:</strong> {errorSample}</p>
                    <p>A default preview is shown below.</p>
                </div>
            )}
            {sampleMessage && ( 
            <div className="mt-2">
                <p className="text-sm text-gray-600 mb-3">Here's a sneak peek of a message you might receive based on your choices:</p>
                <div className="border border-gray-300/50 rounded-xl overflow-hidden shadow-md bg-accent">
                    <WhatsAppPreview message={sampleMessage} />
                </div>
                 <Button onClick={fetchSampleMessage} variant="outline" size="md" className="mt-6 w-full border-primary/70 text-primary hover:bg-primary/10" leftIcon={ICONS.LOADING} disabled={isLoadingSample}>
                    {isLoadingSample ? "Regenerating..." : "Regenerate Sample"}
                </Button>
            </div>
            )}
        </SectionCard>

        <div className="mt-12 pt-8 border-t border-gray-300/70 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(PagePath.FREQUENCY)} 
            className="w-full sm:w-auto border-primary/80 text-primary hover:bg-primary/10 !py-3 px-6"
            leftIcon={ICONS.ARROW_LEFT}
          >
            Edit Settings
          </Button>
          <Button 
            type="button" 
            variant="primary" 
            size="lg" 
            onClick={handleConfirm}
            className="w-full sm:w-auto bg-primary hover:bg-primary-dark !py-3.5 px-8 shadow-lg hover:shadow-xl"
            leftIcon={ICONS.CHECK}
          >
            Confirm & Activate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewConfirmPage;