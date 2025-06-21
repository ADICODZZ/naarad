

import React from 'react';
import { SampleMessage, SelectableTagCategoryKey } from './types'; 

export const PRIMARY_CTA_COLOR = "bg-primary"; 
export const PRIMARY_CTA_HOVER_COLOR = "hover:bg-primary-dark"; 
export const SECONDARY_COLOR = "bg-teal-500";
export const SECONDARY_HOVER_COLOR = "hover:bg-teal-600";

export const PagePath = {
  LOGIN: '/login',
  INTERESTS: '/interests',
  FREQUENCY: '/frequency',
  REVIEW: '/review',
  DASHBOARD: '/dashboard',
};

export const ICONS = {
  SPORTS: '⚽', 
  MOVIES: '🎬', 
  NEWS: '📰',   
  YOUTUBE: '📺', 
  CUSTOM: '✍️',   
  SETTINGS: '⚙️', 
  CLOCK: '⏰',   
  CHECK: '✅',   
  EDIT: '✏️',   
  USER: '👤',   
  WHATSAPP: <span className="text-xl" role="img" aria-label="whatsapp">💬</span>,
  EMAIL: '📧',  
  PHONE: '📱',  
  ARROW_RIGHT: <span className="ml-1" role="img" aria-label="right arrow">→</span>,
  ARROW_LEFT: <span className="mr-1" role="img" aria-label="left arrow">←</span>,
  SAVE: '💾',   
  CANCEL: '❌',  
  PAUSE: '⏸️',  
  PLAY: '▶️',   
  SUMMARY: '📋', 
  TEST: '🧪',   
  LOADING: '⏳', 
  INFO: 'ℹ️', 
  BELL: '🔔', 
  STAR: '⭐', 
  LIGHTBULB: '💡',
  PLUS: '➕',
  TAG: '🏷️',
  OTHER: '✍️', // Icon for "Other (Specify)"
  IMAGE_PLACEHOLDER: <span className="text-6xl text-gray-400" role="img" aria-label="image placeholder">🖼️</span>, 
  READ_MORE: '📖',
  TRASH: '🗑️',
  GOOGLE: (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.58L5.84 9.4c.87-2.6 3.3-4.02 6.16-4.02z" />
    </svg>
  ),
  APPLE: (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.32 12.75c-.03-2.26-1.73-3.63-1.82-3.69a3.63 3.63 0 00-2.82-1.37c-1.32 0-2.5.78-3.17 1.51a4.1 4.1 0 00-1.22-.03c-1.35 0-2.7.82-3.42 1.58-1.58 1.6-2.37 4.25-1.76 6.6.5 1.92 1.73 3.45 3.14 4.2a4.5 4.5 0 003.28.73c.25 0 .5-.03.75-.07.22-.03.45-.07.66-.13.81-.2 1.4-.4 2.07-1.17.66-.78.92-1.14.92-1.17s-.04-.08-.04-.13c0-.05.46-1.39.48-1.43.03-.05.05-.1.05-.15s-.02-.1-.05-.15c-.02-.05-.05-.08-.08-.13a.56.56 0 00-.34-.17c-.11 0-.22.03-.3.08-.08.05-.14.1-.18.15-.04.05-.07.1-.08.15L19.32 12.75zM14.97 4.41a4.63 4.63 0 011.76-.3c.73 0 1.4.17 2 .45.02-1.82-1.2-3.03-1.33-3.13a2.95 2.95 0 00-2.22-1.06c-1.42 0-2.6.7-3.25 1.4-.02.03-.03.05-.05.08a2.69 2.69 0 011.18 1.05c.4-.41.85-.72 1.38-.9.1-.03.2-.06.3-.09z" />
    </svg>
  ),
  WHATSAPP_LOGO: ( 
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5C21 16.7467 16.7467 21 11.5 21C10.573 21 9.68403 20.8543 8.85273 20.5817L3 22L4.41827 16.1473C4.14572 15.316 4 14.427 4 13.5C4 8.25329 8.25329 4 13.5 4C18.7467 4 23 8.25329 23 13.5C23 14.9338 22.6243 16.2648 21.9668 17.4183M21 11.5C21 10.7941 20.8805 10.1069 20.6587 9.45707" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 11H9.01M12 11H12.01M15 11H15.01" strokeWidth="2.5" />
    </svg>
  )
};

export const WHATSAPP_PREVIEW_SENDER = "Your Updates";

export const WHATSAPP_PREVIEW_TIME = (): string => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
};


export const EXAMPLE_NOTIFICATIONS: Record<string, SampleMessage> = {
  DEFAULT: {
    summaryText: "Welcome! Select an interest to see a personalized sample update.",
    imageUrl: "✨", 
    actionText: "Learn More"
  },
  SPORTS: {
    summaryText: "⚽ Great news for cricket fans! Virat Kohli just scored a century in the ongoing test match against Australia. What a performance!",
    imageUrl: "🏏", 
    actionText: "Full Match Report"
  },
  MOVIES_TV: {
    summaryText: "🎬 Sci-Fi fans, rejoice! 'Dune: Part Two' is now streaming on Max. Critics are calling it a visual masterpiece.",
    imageUrl: "🏜️", 
    actionText: "Watch Trailer"
  },
  NEWS: {
    summaryText: "📰 Tech Update: A new AI model has been released that can generate realistic images from text prompts. This could revolutionize digital art!",
    imageUrl: "🤖", 
    actionText: "Discover AI Art"
  },
  YOUTUBE: {
    summaryText: "📺 MKBHD just dropped a new video reviewing the latest smartphone. He says the camera is a game-changer!",
    imageUrl: "📱", 
    actionText: "Watch Review Now"
  },
  CUSTOM: {
    summaryText: "✍️ Based on your custom interest in 'Ancient Roman History', a new documentary exploring the fall of the Republic has just been released.",
    imageUrl: "🏛️", 
    actionText: "Explore Documentary"
  },
};

export interface Tag {
  id: string;
  label: string;
  icon?: string | React.ReactNode;
  color?: string; 
}

export interface FollowUpQuestion {
  id: string;
  text: string;
  predefinedAnswerTags?: Tag[];
  hasOtherOption?: boolean;
  helperText?: string; // Optional: can still be used for overarching guidance
}

export interface SubCategory {
  id: string;
  label: string;
  icon?: string | React.ReactNode;
  tags: Tag[];
  description?: string;
  popularTeams?: Tag[]; // For Sports
  popularPlayers?: Tag[]; // For Sports
}

export interface MainCategory {
  id: SelectableTagCategoryKey | 'custom'; 
  label: string;
  icon: string | React.ReactNode;
  color: string; 
  textColor: string; 
  subCategories?: SubCategory[];
  tags?: Tag[]; 
  followUpQuestions?: FollowUpQuestion[]; 
  followUpHelperText?: string;
  popularInstructionTags?: Tag[];
}


export const INTEREST_TAG_HIERARCHY: Record<string, MainCategory> = {
  SPORTS: {
    id: 'sports',
    label: 'Sports',
    icon: ICONS.SPORTS,
    color: 'accent-orange',
    textColor: 'text-white',
    popularInstructionTags: [
        { id: 'sports_instr_winonly', label: 'Notify on wins only (my team)' },
        { id: 'sports_instr_scores', label: 'Include final scores' },
        { id: 'sports_instr_noplayergossip', label: 'No player gossip/rumors' },
        { id: 'sports_instr_highlights', label: 'Prefer highlights links' },
    ],
    subCategories: [
      { 
        id: 'sports_cricket', label: 'Cricket', icon: '🏏', 
        tags: [
          { id: 'cricket_ipl', label: 'IPL' }, { id: 'cricket_t20wc', label: 'T20 World Cup' },
          { id: 'cricket_test', label: 'Test Matches' }, { id: 'cricket_odi', label: 'ODI Matches' },
          { id: 'cricket_ashes', label: 'The Ashes' }, { id: 'cricket_bbl', label: 'Big Bash League' },
        ],
        popularTeams: [
            {id: 'cricket_team_rcb', label: 'Royal Challengers Bengaluru'}, {id: 'cricket_team_mi', label: 'Mumbai Indians'},
            {id: 'cricket_team_csk', label: 'Chennai Super Kings'}, {id: 'cricket_team_ind', label: 'Team India'},
            {id: 'cricket_team_aus', label: 'Team Australia'}, {id: 'cricket_team_eng', label: 'Team England'},
        ],
        popularPlayers: [
            {id: 'cricket_player_vk', label: 'Virat Kohli'}, {id: 'cricket_player_rs', label: 'Rohit Sharma'},
            {id: 'cricket_player_msd', label: 'MS Dhoni'}, {id: 'cricket_player_sc', label: 'Shubman Gill'},
            {id: 'cricket_player_jb', label: 'Jasprit Bumrah'}, {id: 'cricket_player_sp', label: 'Steve Smith'},
        ],
      },
      { 
        id: 'sports_football', label: 'Football (Soccer)', icon: '⚽', 
        tags: [
          { id: 'football_epl', label: 'Premier League' }, { id: 'football_laliga', label: 'La Liga' },
          { id: 'football_seriea', label: 'Serie A' }, { id: 'football_bundesliga', label: 'Bundesliga' },
          { id: 'football_ucl', label: 'Champions League' }, { id: 'football_worldcup', label: 'FIFA World Cup' },
          { id: 'football_isl', label: 'Indian Super League (ISL)'},
        ],
        popularTeams: [
            {id: 'football_team_mu', label: 'Manchester United'}, {id: 'football_team_rm', label: 'Real Madrid'},
            {id: 'football_team_fcb', label: 'FC Barcelona'}, {id: 'football_team_liv', label: 'Liverpool FC'},
            {id: 'football_team_bayern', label: 'Bayern Munich'}, {id: 'football_team_atkmb', label: 'ATK Mohun Bagan'},
        ],
        popularPlayers: [
            {id: 'football_player_lm', label: 'Lionel Messi'}, {id: 'football_player_cr7', label: 'Cristiano Ronaldo'},
            {id: 'football_player_km', label: 'Kylian Mbappé'}, {id: 'football_player_sc', label: 'Sunil Chhetri'},
            {id: 'football_player_neymar', label: 'Neymar Jr.'}, {id: 'football_player_haaland', label: 'Erling Haaland'},
        ],
      },
      { 
        id: 'sports_basketball', label: 'Basketball', icon: '🏀', 
        tags: [
          { id: 'bball_nba', label: 'NBA' }, { id: 'bball_euroleague', label: 'EuroLeague' },
          { id: 'bball_wnba', label: 'WNBA' }, { id: 'bball_fibawc', label: 'FIBA World Cup' },
        ],
        popularTeams: [
            {id: 'bball_team_lakers', label: 'Los Angeles Lakers'}, {id: 'bball_team_warriors', label: 'Golden State Warriors'},
            {id: 'bball_team_celtics', label: 'Boston Celtics'}, {id: 'bball_team_bulls', label: 'Chicago Bulls'},
        ],
        popularPlayers: [
            {id: 'bball_player_lbj', label: 'LeBron James'}, {id: 'bball_player_sc', label: 'Stephen Curry'},
            {id: 'bball_player_kd', label: 'Kevin Durant'}, {id: 'bball_player_giannis', label: 'Giannis Antetokounmpo'},
        ],
      },
      {
        id: 'sports_tennis', label: 'Tennis', icon: '🎾',
        tags: [
          { id: 'tennis_grandslam', label: 'Grand Slams' }, { id: 'tennis_wimbledon', label: 'Wimbledon' },
          { id: 'tennis_usopen', label: 'US Open' }, { id: 'tennis_ausopen', label: 'Australian Open' },
          { id: 'tennis_frenchopen', label: 'French Open (Roland Garros)' }, { id: 'tennis_atp', label: 'ATP Tour' }, { id: 'tennis_wta', label: 'WTA Tour' },
        ],
        popularPlayers: [
          { id: 'tennis_player_djokovic', label: 'Novak Djokovic' }, { id: 'tennis_player_nadal', label: 'Rafael Nadal' },
          { id: 'tennis_player_federer', label: 'Roger Federer' }, { id: 'tennis_player_alcaraz', label: 'Carlos Alcaraz' },
          { id: 'tennis_player_swiatek', label: 'Iga Świątek' }, { id: 'tennis_player_serena', label: 'Serena Williams' },
        ],
      },
      {
        id: 'sports_f1', label: 'Formula 1', icon: '🏎️',
        tags: [
          { id: 'f1_races', label: 'Race Weekends' }, { id: 'f1_qualifying', label: 'Qualifying Results' },
          { id: 'f1_constructors', label: 'Constructors Championship' }, { id: 'f1_drivers', label: 'Drivers Championship' },
        ],
        popularTeams: [
          { id: 'f1_team_mercedes', label: 'Mercedes-AMG Petronas' }, { id: 'f1_team_redbull', label: 'Oracle Red Bull Racing' },
          { id: 'f1_team_ferrari', label: 'Scuderia Ferrari' }, { id: 'f1_team_mclaren', label: 'McLaren F1 Team' },
        ],
        popularPlayers: [
          { id: 'f1_driver_hamilton', label: 'Lewis Hamilton' }, { id: 'f1_driver_verstappen', label: 'Max Verstappen' },
          { id: 'f1_driver_leclerc', label: 'Charles Leclerc' }, { id: 'f1_driver_norris', label: 'Lando Norris' },
        ],
      },
      {
        id: 'sports_golf', label: 'Golf', icon: '⛳',
        tags: [
          { id: 'golf_majors', label: 'Majors (Masters, PGA, US Open, The Open)' }, { id: 'golf_pgatour', label: 'PGA Tour' },
          { id: 'golf_liv', label: 'LIV Golf' }, { id: 'golf_rydercup', label: 'Ryder Cup' },
        ],
        popularPlayers: [
          { id: 'golf_player_woods', label: 'Tiger Woods' }, { id: 'golf_player_scheffler', label: 'Scottie Scheffler' },
          { id: 'golf_player_mcilroy', label: 'Rory McIlroy' }, { id: 'golf_player_rahm', label: 'Jon Rahm' },
        ],
      },
      {
        id: 'sports_badminton', label: 'Badminton', icon: '🏸',
        tags: [
          { id: 'badminton_bwf', label: 'BWF World Tour' }, { id: 'badminton_olympics', label: 'Olympics Badminton' },
          { id: 'badminton_nationals', label: 'National Championships' },
        ],
        popularPlayers: [
            {id: 'badminton_player_pvsindhu', label: 'PV Sindhu'}, {id: 'badminton_player_lsen', label: 'Lakshya Sen'},
            {id: 'badminton_player_va', label: 'Viktor Axelsen'}, {id: 'badminton_player_ays', label: 'An Se-young'},
        ]
      },
      {
        id: 'sports_kabaddi', label: 'Kabaddi', icon: '🤸',
        tags: [
          { id: 'kabaddi_pkl', label: 'Pro Kabaddi League (PKL)' }, { id: 'kabaddi_worldcup', label: 'Kabaddi World Cup' },
        ],
        popularTeams: [
            {id: 'kabaddi_team_patna', label: 'Patna Pirates'}, {id: 'kabaddi_team_bengaluru', label: 'Bengaluru Bulls'},
            {id: 'kabaddi_team_jaipur', label: 'Jaipur Pink Panthers'},
        ],
        popularPlayers: [
            {id: 'kabaddi_player_pardeep', label: 'Pardeep Narwal'}, {id: 'kabaddi_player_pawan', label: 'Pawan Sehrawat'},
        ]
      },
      {
        id: 'sports_esports', label: 'eSports', icon: '🎮',
        tags: [
          { id: 'esports_valorant', label: 'Valorant' }, { id: 'esports_csgo', label: 'Counter-Strike' },
          { id: 'esports_dota2', label: 'Dota 2' }, { id: 'esports_lol', label: 'League of Legends' },
          { id: 'esports_bgmi', label: 'BGMI (India)' },
        ]
        // Popular teams/players in eSports are very dynamic and numerous, might be better handled by general tags.
      },
      { 
        id: 'sports_other', label: 'Other Sport', icon: ICONS.OTHER, 
        tags: [ {id: 'other_sport_generic', label: 'General Updates'} ],
        // No predefined teams/players for 'Other'
      },
    ],
    followUpQuestions: [
      { id: 'favTeam', text: 'Which are your favorite teams?', 
        predefinedAnswerTags: [ // Fallback if specific sport has no popular teams
            {id: 'favTeam_myLocal', label: 'My Local Team'},
            {id: 'favTeam_national', label: 'National Team'},
        ],
        hasOtherOption: true,
      },
      { id: 'favPlayer', text: 'Any favorite players you follow closely?', 
        hasOtherOption: true, // Fallback if specific sport has no popular players
      },
      { id: 'updateType', text: 'What kind of updates do you prefer?', 
        predefinedAnswerTags: [
            {id: 'updateType_match', label: 'Match Updates'},
            {id: 'updateType_analysis', label: 'Analysis/Opinions'},
            {id: 'updateType_both', label: 'Both Updates & Analysis'},
        ],
        hasOtherOption: true,
      },
      { id: 'matchFormat', text: 'Any preferred match formats? (e.g., for Cricket)',
        predefinedAnswerTags: [
            {id: 'format_test', label: 'Test Matches'},
            {id: 'format_odi', label: 'ODI'},
            {id: 'format_t20', label: 'T20'},
            {id: 'format_league', label: 'League Matches'},
            {id: 'format_tournaments', label: 'Tournaments Only'},
        ],
        hasOtherOption: true,
      },
      { id: 'eventScope', text: 'Do you lean towards local or international events?',
        predefinedAnswerTags: [
            {id: 'scope_local', label: 'Local Events'},
            {id: 'scope_international', label: 'International Events'},
            {id: 'scope_both', label: 'Both Local & International'},
        ],
      },
    ],
    followUpHelperText: "These answers help us personalize your sports news further."
  },
  MOVIES_TV: {
    id: 'moviesTV',
    label: 'Movies & TV',
    icon: ICONS.MOVIES,
    color: 'accent-purple',
    textColor: 'text-white',
    popularInstructionTags: [
        { id: 'moviestv_instr_nospoilers', label: 'No spoilers for new releases' },
        { id: 'moviestv_instr_ratings', label: 'Include Rotten Tomatoes score' },
        { id: 'moviestv_instr_streamingonly', label: 'Alerts for streaming availability only' },
        { id: 'moviestv_instr_trailers', label: 'Include trailers' },
    ],
    subCategories: [
      { id: 'moviestv_genres', label: 'Genres', icon: '🎭', tags: [
        { id: 'genre_action', label: 'Action' }, { id: 'genre_comedy', label: 'Comedy' },
        { id: 'genre_drama', label: 'Drama' }, { id: 'genre_scifi', label: 'Sci-Fi' },
        { id: 'genre_horror', label: 'Horror' }, { id: 'genre_docu', label: 'Documentary' },
        { id: 'genre_romance', label: 'Romance' }, { id: 'genre_thriller', label: 'Thriller' },
        { id: 'genre_animation', label: 'Animation' }, { id: 'genre_family', label: 'Family' },
      ]},
      { id: 'moviestv_platforms', label: 'Streaming Platforms', icon: '📺', tags: [
        { id: 'platform_netflix', label: 'Netflix' }, { id: 'platform_prime', label: 'Amazon Prime' },
        { id: 'platform_disney', label: 'Disney+' }, { id: 'platform_hbo', label: 'HBO Max/Max' },
        { id: 'platform_apple', label: 'Apple TV+' }, { id: 'platform_hotstar', label: 'Hotstar (India)' },
        { id: 'platform_sonyliv', label: 'SonyLIV (India)' }, { id: 'platform_zee5', label: 'ZEE5 (India)' },
      ]},
       { id: 'moviestv_actors', label: 'Favorite Actors/Directors', icon: ICONS.USER, tags: [
        { id: 'actor_dicaprio', label: 'Leonardo DiCaprio' }, { id: 'actor_zendaya', label: 'Zendaya' },
        { id: 'director_nolan', label: 'Christopher Nolan' }, { id: 'actor_srk', label: 'Shah Rukh Khan' },
        { id: 'actor_amitabh', label: 'Amitabh Bachchan' }, { id: 'actor_alia', label: 'Alia Bhatt' },
      ]},
    ],
    followUpQuestions: [
      { id: 'contentFormat', text: 'How do you prefer to discover new content?',
        predefinedAnswerTags: [
            {id: 'discover_trailers', label: 'Trailers'},
            {id: 'discover_reviews', label: 'Reviews'},
            {id: 'discover_recommendations', label: 'Recommendations based on my taste'},
            {id: 'discover_news', label: 'Industry News/Announcements'},
        ],
        hasOtherOption: true,
      },
      { id: 'releaseAlerts', text: 'When should we notify you about new releases?',
        predefinedAnswerTags: [
            {id: 'release_theatrical', label: 'Theatrical Release'},
            {id: 'release_streaming', label: 'When it hits Streaming'},
            {id: 'release_both', label: 'Both Theatrical & Streaming'},
            {id: 'release_preorders', label: 'Pre-order / Early Access'},
        ],
      },
      { id: 'spoilerSensitivity', text: 'How sensitive are you to spoilers?',
        predefinedAnswerTags: [
            {id: 'spoiler_avoid', label: 'Avoid All Spoilers!'},
            {id: 'spoiler_minorOk', label: 'Minor Spoilers are OK'},
            {id: 'spoiler_dontCare', label: "Don't Mind Spoilers"},
        ],
        hasOtherOption: true, // e.g. "Only for specific shows"
      },
      { id: 'languagePreference', text: 'Any language preferences for movies/shows?',
        predefinedAnswerTags: [
            {id: 'lang_english', label: 'English'},
            {id: 'lang_hindi', label: 'Hindi'},
            {id: 'lang_regional', label: 'My Regional Language (Specify)'},
            {id: 'lang_originalaudio', label: 'Original Audio with Subtitles'},
        ],
        hasOtherOption: true,
      }
    ]
  },
  NEWS: {
    id: 'news',
    label: 'News',
    icon: ICONS.NEWS,
    color: 'accent-blue',
    textColor: 'text-white',
    popularInstructionTags: [
        { id: 'news_instr_summaries', label: 'Prefer short summaries' },
        { id: 'news_instr_fullarticles', label: 'Link to full articles' },
        { id: 'news_instr_positive', label: 'Focus on positive news' },
        { id: 'news_instr_nopolitics', label: 'No political news' },
    ],
    tags: [ 
      { id: 'news_tech', label: 'Technology', icon: '💻' }, { id: 'news_finance', label: 'Business & Finance', icon: '💹' },
      { id: 'news_world', label: 'World Affairs', icon: '🌍' }, { id: 'news_science', label: 'Science', icon: '🔬' },
      { id: 'news_health', label: 'Health & Wellness', icon: '⚕️' }, { id: 'news_politics', label: 'Politics (Global/National)', icon: '🏛️' },
      { id: 'news_environment', label: 'Environment', icon: '🌳' }, { id: 'news_education', label: 'Education', icon: '🎓' },
      { id: 'news_local', label: 'Local News (Specify area in details)', icon: '🏘️' },
    ],
    followUpQuestions: [
      { id: 'newsSources', text: 'Do you have preferred news sources or any to avoid?',
        predefinedAnswerTags: [
            {id: 'source_mainstream', label: 'Mainstream Sources'},
            {id: 'source_independent', label: 'Independent Media'},
            {id: 'source_specific', label: 'Specific publications (mention in Other)'},
        ],
        hasOtherOption: true, 
      },
      { id: 'topicDepth', text: 'How deep do you want to go on selected topics?',
        predefinedAnswerTags: [
            {id: 'depth_headlines', label: 'Headlines Only'},
            {id: 'depth_summaries', label: 'Brief Summaries (1-2 paras)'},
            {id: 'depth_detailed', label: 'Detailed Coverage / Analysis'},
        ],
      },
      { id: 'newsFormatPreference', text: 'What format do you prefer for news updates?',
        predefinedAnswerTags: [
            {id: 'format_bullet', label: 'Bullet Points'},
            {id: 'format_shortPara', label: 'Short Paragraphs'},
            {id: 'format_links', label: 'Links to Full Articles'},
            {id: 'format_visual', label: 'Include relevant images/videos'},
        ],
        hasOtherOption: true,
      },
      { id: 'newsFrequencyPerTopic', text: 'For very active topics, how often do you want updates?',
        predefinedAnswerTags: [
            {id: 'freq_breaking', label: 'As it happens (Breaking News)'},
            {id: 'freq_fewtimesaday', label: 'A few times a day'},
            {id: 'freq_dailycap', label: 'Once daily per topic'},
        ],
        hasOtherOption: true,
      }
    ]
  },
  YOUTUBE: {
    id: 'youtube',
    label: 'YouTube',
    icon: ICONS.YOUTUBE,
    color: 'accent-pink',
    textColor: 'text-white',
    popularInstructionTags: [
        { id: 'yt_instr_under15', label: 'Only videos under 15 mins' },
        { id: 'yt_instr_educational', label: 'Prioritize educational content' },
        { id: 'yt_instr_noheavygaming', label: 'Less focus on intense gaming' },
        { id: 'yt_instr_channeldigest', label: 'Daily digest for subscribed channels' },
    ],
    subCategories: [
      { id: 'youtube_channels', label: 'Favorite Channels/Creators', icon: ICONS.USER, tags: [
        { id: 'yt_mkbhd', label: 'MKBHD' }, { id: 'yt_kurzgesagt', label: 'Kurzgesagt' },
        { id: 'yt_mrbeast', label: 'MrBeast' }, { id: 'yt_pewdiepie', label: 'PewDiePie' },
        { id: 'yt_ted', label: 'TED Talks' }, { id: 'yt_natgeo', label: 'National Geographic' },
        { id: 'yt_technicalguruji', label: 'Technical Guruji (India)'}, { id: 'yt_bbkivines', label: 'BB Ki Vines (India)'},
      ]},
      { id: 'youtube_topics', label: 'Topics of Interest', icon: '📚', tags: [
        { id: 'yt_topic_coding', label: 'Coding Tutorials' }, { id: 'yt_topic_gaming', label: 'Gaming Highlights' },
        { id: 'yt_topic_cooking', label: 'Cooking Shows' }, { id: 'yt_topic_science', label: 'Science Explainers' },
        { id: 'yt_topic_music', label: 'Music (Live/Official)' }, { id: 'yt_topic_podcasts', label: 'Video Podcasts' },
        { id: 'yt_topic_reviews', label: 'Product Reviews' }, { id: 'yt_topic_travel', label: 'Travel Vlogs' },
      ]},
      { id: 'youtube_duration', label: 'Preferred Video Duration', icon: ICONS.CLOCK, tags: [
        { id: 'yt_dur_short', label: '< 5 minutes' }, { id: 'yt_dur_medium', label: '5-15 minutes' },
        { id: 'yt_dur_long', label: '15-30 minutes' }, { id: 'yt_dur_any', label: '> 30 minutes / Any' },
      ]},
    ],
    followUpQuestions: [
      { id: 'videoStyle', text: 'What style of YouTube videos do you enjoy most?',
        predefinedAnswerTags: [
            {id: 'style_educational', label: 'Educational/Informative'},
            {id: 'style_reviews', label: 'Reviews/Tutorials'},
            {id: 'style_vlogs', label: 'Vlogs/Lifestyle'},
            {id: 'style_comedy', label: 'Comedy/Skits'},
            {id: 'style_music', label: 'Music Videos/Performances'},
            {id: 'style_documentary', label: 'Documentary Style'},
            {id: 'style_interviews', label: 'Interviews/Podcasts'},
        ],
        hasOtherOption: true,
      },
      { id: 'notificationType', text: 'How do you want to be notified about new videos?',
        predefinedAnswerTags: [
            {id: 'notify_perVideo', label: 'For Every New Video (from favs)'},
            {id: 'notify_dailyDigest', label: 'Daily Digest of New Videos'},
            {id: 'notify_weeklyDigest', label: 'Weekly Digest'},
            {id: 'notify_trending', label: 'Only Highly Trending/Popular'},
        ],
      },
      { id: 'creatorInteraction', text: 'Are you interested in creator updates beyond videos?',
        predefinedAnswerTags: [
            {id: 'creator_community', label: 'Community Posts'},
            {id: 'creator_live', label: 'Live Streams'},
            {id: 'creator_shorts', label: 'YouTube Shorts'},
            {id: 'creator_noextra', label: 'Just the main videos'},
        ],
        hasOtherOption: true,
      }
    ]
  },
  CUSTOM: {
    id: 'custom',
    label: 'Custom',
    icon: ICONS.CUSTOM,
    color: 'accent-teal',
    textColor: 'text-white',
    tags: [ 
      { id: 'custom_pop_local', label: 'Local Events (My Area)' },
      { id: 'custom_pop_books', label: 'Book Summaries' },
      { id: 'custom_pop_recipes', label: 'New Recipes Weekly' },
      { id: 'custom_pop_deals', label: 'Tech Deals/Sales' },
      { id: 'custom_pop_history', label: 'Daily History Fact' },
      { id: 'custom_pop_language', label: 'Word of the Day (Language Learning)' },
      { id: 'custom_pop_quotes', label: 'Motivational Quotes' },
      { id: 'custom_pop_stock', label: 'Stock Market Movers (Specific Stocks)' },
    ],
  },
};