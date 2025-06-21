

export enum UpdateFrequency {
  REAL_TIME = "Real-time",
  MORNING_DIGEST = "Morning Digest",
  EVENING_SUMMARY = "Evening Summary",
  CUSTOM = "Custom",
}

export interface FollowUpAnswer {
  selectedPredefinedTags: string[]; // Stores labels of selected predefined tags
  customAnswerViaOther?: string;   // Stores text if "Other" tag was selected and filled
}

export interface CategoryFollowUpAnswers {
  [questionId: string]: FollowUpAnswer;
}

export interface AiFollowUpQuestion {
  id: string; // Unique ID for the question-answer pair
  question: string; // The AI-generated question
  answer: string; // User's answer
}

// Consolidate specific preference structures
export interface CategorySpecificPreferences {
  selectedTags: string[]; // For main topic/sub-category tags
  followUpAnswers?: CategoryFollowUpAnswers;
  instructionTags?: string[]; 
  aiFollowUpQuestions?: AiFollowUpQuestion[]; 
  otherSportName?: string; // For Sports category if 'Other Sport' is selected
}

export interface UserPreferences {
  email: string;
  whatsappNumber: string;
  isWhatsAppConfirmed: boolean;
  sports: CategorySpecificPreferences;
  moviesTV: CategorySpecificPreferences;
  news: CategorySpecificPreferences;
  youtube: CategorySpecificPreferences;
  customInterestTags: string[]; 
  frequency: UpdateFrequency;
  customFrequencyTime?: string;
  platform: "WhatsApp";
  alertsPaused: boolean;
}

export const initialPreferencesData: UserPreferences = {
  email: "",
  whatsappNumber: "",
  isWhatsAppConfirmed: false,
  sports: { selectedTags: [], followUpAnswers: {}, instructionTags: [], aiFollowUpQuestions: [], otherSportName: undefined },
  moviesTV: { selectedTags: [], followUpAnswers: {}, instructionTags: [], aiFollowUpQuestions: [] },
  news: { selectedTags: [], followUpAnswers: {}, instructionTags: [], aiFollowUpQuestions: [] },
  youtube: { selectedTags: [], followUpAnswers: {}, instructionTags: [], aiFollowUpQuestions: [] },
  customInterestTags: [],
  frequency: UpdateFrequency.MORNING_DIGEST,
  platform: "WhatsApp",
  alertsPaused: false,
};

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}
export interface GroundingChunk {
  web: GroundingChunkWeb;
}
export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

export interface SampleMessage {
  summaryText: string;
  imageUrl?: string; 
  imageSuggestion?: string; 
  actionText?: string; 
}

export const GENERAL_DETAILS_PLACEHOLDER = "e.g., Prefer summaries over links, avoid spoilers for new movie releases, focus on positive news only, send Premier League updates only if my team wins...";

export const CUSTOM_INTERESTS_INPUT_EXAMPLES = "e.g., Knitting patterns, Ancient Roman history, Indie game development";
export const CUSTOM_INTERESTS_DETAILS_EXAMPLES = "For Knitting: advanced stitch tutorials only. For Roman History: focus on the late Republic period. For Indie Games: new releases on Steam and itch.io.";

export type SelectableTagCategoryKey = 'sports' | 'moviesTV' | 'news' | 'youtube';