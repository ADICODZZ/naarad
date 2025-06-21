

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserPreferences, SampleMessage, SelectableTagCategoryKey, CategorySpecificPreferences, AiFollowUpQuestion, FollowUpAnswer } from '../types';
import { INTEREST_TAG_HIERARCHY, FollowUpQuestion as FollowUpQuestionType } from '../constants'; 

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. Sample message generation will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "mock_api_key_placeholder" });

export const getTagLabel = (tagId: string): string => {
  for (const mainCatKey in INTEREST_TAG_HIERARCHY) {
    const mainCat = INTEREST_TAG_HIERARCHY[mainCatKey];
    if (mainCat.tags) {
      const foundTag = mainCat.tags.find(t => t.id === tagId);
      if (foundTag) return foundTag.label;
    }
    if (mainCat.subCategories) {
      for (const subCat of mainCat.subCategories) {
        const foundTag = subCat.tags.find(t => t.id === tagId);
        if (foundTag) return foundTag.label;
      }
    }
  }
  return tagId; 
};

const getFollowUpQuestionText = (categoryKey: SelectableTagCategoryKey, questionId: string): string => {
  const mainCat = INTEREST_TAG_HIERARCHY[categoryKey.toUpperCase() as keyof typeof INTEREST_TAG_HIERARCHY];
  const question = mainCat?.followUpQuestions?.find(q => q.id === questionId);
  return question ? question.text : questionId;
};

const formatPreferencesForPrompt = (preferences: UserPreferences): string => {
  let prompt = "User Preferences:\n";
  prompt += `- Email: ${preferences.email}\n`;
  prompt += `- WhatsApp Number: ${preferences.whatsappNumber}\n`;
  prompt += `- Frequency: ${preferences.frequency}${preferences.frequency === "Custom" && preferences.customFrequencyTime ? ` at ${preferences.customFrequencyTime}` : ''}\n`;

  const processCategory = (categoryKey: SelectableTagCategoryKey, categoryLabel: string) => {
    const categoryData = preferences[categoryKey] as CategorySpecificPreferences;
    let categoryHasContent = false;

    if (categoryData.selectedTags.length > 0) categoryHasContent = true;
    if (categoryKey === 'sports' && categoryData.otherSportName && categoryData.otherSportName.trim() !== '') {
        categoryHasContent = true;
    }
    if (categoryData.followUpAnswers) {
        for (const qId in categoryData.followUpAnswers) {
            const answerObj = categoryData.followUpAnswers[qId];
            if ((answerObj.selectedPredefinedTags && answerObj.selectedPredefinedTags.length > 0) || (answerObj.customAnswerViaOther && answerObj.customAnswerViaOther.trim() !== '')) {
                categoryHasContent = true;
                break;
            }
        }
    }
    if (categoryData.instructionTags && categoryData.instructionTags.length > 0) categoryHasContent = true;
    if (categoryData.aiFollowUpQuestions && categoryData.aiFollowUpQuestions.some(qna => qna.answer && qna.answer.trim() !== '')) categoryHasContent = true;
    
    if (categoryHasContent) {
        prompt += `- ${categoryLabel}:\n`;
        if (categoryData.selectedTags.length > 0) {
            prompt += `  - Interests/Topics: ${categoryData.selectedTags.map(getTagLabel).join(', ')}\n`;
        }
        if (categoryKey === 'sports' && categoryData.otherSportName && categoryData.otherSportName.trim() !== '') {
            prompt += `  - Specified Other Sport: ${categoryData.otherSportName.trim()}\n`;
        }
        if (categoryData.followUpAnswers) {
            let hasFollowUpOutput = false;
            let followUpPromptPart = "  - Additional Details (Fixed Q&A):\n";
            for (const questionId in categoryData.followUpAnswers) {
                const answerObj = categoryData.followUpAnswers[questionId];
                let answerParts: string[] = [];
                if (answerObj.selectedPredefinedTags && answerObj.selectedPredefinedTags.length > 0) {
                    answerParts.push(...answerObj.selectedPredefinedTags);
                }
                if (answerObj.customAnswerViaOther && answerObj.customAnswerViaOther.trim() !== '') {
                    answerParts.push(`Other: ${answerObj.customAnswerViaOther.trim()}`);
                }

                if (answerParts.length > 0) {
                    hasFollowUpOutput = true;
                    const questionText = getFollowUpQuestionText(categoryKey, questionId);
                    followUpPromptPart += `    - Q: ${questionText}\n    - A: ${answerParts.join('; ')}\n`;
                }
            }
            if (hasFollowUpOutput) {
                prompt += followUpPromptPart;
            }
        }
        if (categoryData.instructionTags && categoryData.instructionTags.length > 0) {
            prompt += `  - Specific Instructions (Tags): ${categoryData.instructionTags.join(', ')}\n`;
        }
        if (categoryData.aiFollowUpQuestions && categoryData.aiFollowUpQuestions.some(qna => qna.answer && qna.answer.trim() !== '')) {
            prompt += `  - Further Clarifications (AI Q&A):\n`;
            categoryData.aiFollowUpQuestions.forEach(qna => {
                if (qna.answer && qna.answer.trim() !== '') {
                    prompt += `    - Q: ${qna.question}\n    - A: ${qna.answer}\n`;
                }
            });
        }
    }
  };
  
  processCategory('sports', 'Sports');
  processCategory('moviesTV', 'Movies & TV');
  processCategory('news', 'News');
  processCategory('youtube', 'YouTube');
  
  if (preferences.customInterestTags.length > 0) {
    prompt += `- Custom Interests: ${preferences.customInterestTags.join(', ')}\n`;
  }
  
  return prompt;
};

export const generateSampleMessage = async (preferences: UserPreferences): Promise<SampleMessage> => {
  const fallbackMessage: SampleMessage = {
    summaryText: "Sample message generation is disabled or encountered an error. This is a mock update based on your selected tags!",
    imageUrl: "⚙️",
    actionText: "Try Again Later"
  };

  if (!API_KEY || API_KEY === "mock_api_key_placeholder") {
    return Promise.resolve(fallbackMessage);
  }
  
  const userPreferencesPrompt = formatPreferencesForPrompt(preferences);
  const fullPrompt = `Based on the following user preferences, generate a short, engaging, and highly personalized sample WhatsApp update message.
The response MUST be a JSON object with the following structure:
{
  "summaryText": "string (1-2 sentences, directly reflecting one or more user preferences, including any additional details provided like follow-up answers, instruction tags, or AI-generated Q&A)",
  "imageSuggestion": "string (a brief suggestion for a relevant emoji or a very short image description, e.g., 'cricket bat emoji', 'sci-fi movie poster concept')",
  "actionText": "string (a call to action, e.g., 'Read Full Story', 'Watch Trailer')"
}

${userPreferencesPrompt}

JSON Response:`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr) as SampleMessage;
      if (parsedData.imageSuggestion && !parsedData.imageUrl) {
        parsedData.imageUrl = parsedData.imageSuggestion; 
      }
      return parsedData;
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini:", e, "Raw response:", response.text);
      return { ...fallbackMessage, summaryText: "Received an unexpected format from AI. Here's a default sample." };
    }

  } catch (error) {
    console.error("Error generating sample message from Gemini:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
         return { ...fallbackMessage, summaryText: "Could not generate sample: API key is not valid." };
    }
    return { ...fallbackMessage, summaryText: "Sorry, we couldn't generate a sample message at this time." };
  }
};

export const generateAiFollowUpQuestions = async (categoryLabel: string, selectedTagLabels: string[]): Promise<{ id: string; question: string }[]> => {
  if (!API_KEY || API_KEY === "mock_api_key_placeholder") {
    console.warn("API_KEY not set, returning mock AI questions.");
    return Promise.resolve([
      { id: Date.now().toString() + "_mock1", question: `Mock Q1: For ${categoryLabel} and tags like '${selectedTagLabels.join(', ')}', what specific aspect interests you most?` },
      { id: Date.now().toString() + "_mock2", question: `Mock Q2: How frequently do you want updates related to these ${categoryLabel} topics?` },
    ]);
  }

  const tagPromptPart = selectedTagLabels.length > 0 ? `They have also expressed interest in the following specific topics/tags within this category: ${selectedTagLabels.join(', ')}.` : "They have not selected any specific tags yet for this category.";

  const prompt = `You are an assistant helping a user personalize their news feed.
The user has selected the main interest category: "${categoryLabel}".
${tagPromptPart}

Based on this, generate exactly 2-3 short, open-ended follow-up questions. These questions should help clarify:
1. The user's depth of interest (e.g., casual interest vs. avid follower, specific aspects they care about).
2. The type of content they prefer (e.g., just scores vs. detailed analysis, news vs. interviews, official announcements vs. rumors).

Return the questions as a JSON array of strings. For example:
["Question 1: What about X?", "Question 2: How often for Y?"]

Do not include any other text or explanation outside the JSON array.
If no specific tags are provided, generate generic clarifying questions for the category.

JSON Response:`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const questionsArray = JSON.parse(jsonStr) as string[];
    if (Array.isArray(questionsArray)) {
      return questionsArray.map((q, index) => ({
        id: `${Date.now()}_${index}_ai`,
        question: q,
      }));
    }
    throw new Error("AI response was not an array of strings.");
  } catch (error) {
    console.error("Error generating AI follow-up questions:", error);
    return [
      { id: Date.now().toString() + "_fallback1", question: `What specific aspects of ${categoryLabel}${selectedTagLabels.length > 0 ? ` (related to ${selectedTagLabels.join(', ')})` : ''} are you most interested in?` },
      { id: Date.now().toString() + "_fallback2", question: `Any particular type of news or update style you prefer for ${categoryLabel}?` },
    ];
  }
};