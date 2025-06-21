
import React from 'react';
import { ICONS, WHATSAPP_PREVIEW_SENDER, WHATSAPP_PREVIEW_TIME } from '@/constants'; // Changed path
import { SampleMessage } from '../../types'; 

interface WhatsAppPreviewProps {
  message: SampleMessage | string;
  senderName?: string;
  timestamp?: string;
  isUserMessage?: boolean; // For future use if we want to show user's own messages
}

const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({
  message,
  senderName = WHATSAPP_PREVIEW_SENDER,
  timestamp,
  isUserMessage = false, // Default to received message style
}) => {
  const time = timestamp || WHATSAPP_PREVIEW_TIME();

  const { 
    summaryText, 
    imageUrl, 
    imageSuggestion, 
    actionText 
  } = typeof message === 'string' 
    ? { summaryText: message, imageUrl: undefined, imageSuggestion: undefined, actionText: undefined } 
    : message;

  const isPurelyEmoji = (str?: string): boolean => {
    if (!str) return false;
    const trimmedStr = str.trim();
    const emojiPattern = /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u;
    return emojiPattern.test(trimmedStr);
  };

  let imageElement: React.ReactNode = null;
  const commonImageContainerClass = "my-2 mx-auto max-h-40 flex items-center justify-center";

  if (imageUrl) {
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
      imageElement = <img src={imageUrl} alt="Preview" className={`${commonImageContainerClass} rounded-md object-contain`} />;
    } else if (isPurelyEmoji(imageUrl)) {
      imageElement = <div className={`${commonImageContainerClass} py-1 text-5xl`} role="img" aria-label="icon">{imageUrl}</div>;
    } else {
      imageElement = (
        <div className={`${commonImageContainerClass} py-1 text-gray-500 text-xs italic flex-col`}>
          <span className="opacity-70 text-4xl mb-1">{ICONS.IMAGE_PLACEHOLDER}</span>
          <span>(Image idea: {imageUrl})</span>
        </div>
      );
    }
  } else if (imageSuggestion) {
    if (isPurelyEmoji(imageSuggestion)) {
      imageElement = <div className={`${commonImageContainerClass} py-1 text-5xl`} role="img" aria-label="icon">{imageSuggestion}</div>;
    } else {
      imageElement = (
        <div className={`${commonImageContainerClass} py-1 text-gray-500 text-xs italic flex-col`}>
          <span className="opacity-70 text-4xl mb-1">{ICONS.IMAGE_PLACEHOLDER}</span>
          <span>(Suggested image: {imageSuggestion})</span>
        </div>
      );
    }
  }

  return (
    <div className="w-full max-w-xs sm:max-w-sm mx-auto bg-white rounded-xl shadow-xl overflow-hidden my-4 border border-gray-200">
      {/* Phone Header - More realistic */}
      <div className="bg-gray-100 p-2.5 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center">
           <span className="text-gray-600 hover:text-gray-800 cursor-pointer text-lg mr-1.5" role="img" aria-label="Back">‹</span>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-md font-semibold shadow-sm">
            {senderName.charAt(0).toUpperCase()}
          </div>
          <div className="ml-2">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{senderName}</p>
            <p className="text-xs text-gray-500 leading-tight">online</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-gray-500 text-xl">
          <span className="hover:text-gray-700 cursor-pointer" role="img" aria-label="Video call">📹</span>
          <span className="hover:text-gray-700 cursor-pointer" role="img" aria-label="Call">📞</span>
          <span className="hover:text-gray-700 cursor-pointer" role="img" aria-label="More options">⋮</span>
        </div>
      </div>

      {/* Chat Area - Using WhatsApp 'accent' color */}
      <div className="bg-accent p-3.5 h-80 overflow-y-auto flex flex-col space-y-2.5">
        <div className="text-center my-2">
          <span className="bg-gray-200/90 text-gray-600 text-[11px] px-2 py-0.5 rounded-md shadow-sm">TODAY</span>
        </div>

        {/* Message Bubble */}
        <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
          <div 
            className={`
              max-w-[80%] py-2 px-3 rounded-lg shadow-sm relative
              ${isUserMessage 
                ? 'bg-primary-light text-gray-800 rounded-br-none' 
                : 'bg-white text-gray-800 rounded-bl-none'}
            `}
          >
            {/* Small tail for message bubble (simplified) */}
            <div className={`absolute bottom-0 w-2 h-2 ${isUserMessage ? 'right-[-7px] bg-primary-light transform skew-y-[-20deg] shadow-sm' : 'left-[-7px] bg-white transform skew-y-[20deg] shadow-sm'}`} 
                 style={isUserMessage ? { clipPath: 'polygon(0 0, 100% 100%, 100% 0)'} : { clipPath: 'polygon(0 0, 0 100%, 100% 0)'}}>
            </div>
            
            {imageElement}
            <p className="text-sm whitespace-pre-wrap leading-snug">{summaryText || "Your personalized update will appear here!"}</p>
            {actionText && (
              <button 
                className="mt-2 w-full text-center text-sm font-medium text-secondary-light hover:underline py-1.5 px-2 bg-transparent rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-secondary-light/50"
                onClick={(e) => { e.preventDefault(); alert(`Action: ${actionText}`);}}
                aria-label={`Action: ${actionText}`}
              >
                {actionText} {/* Icon removed for cleaner look, like WhatsApp links */}
              </button>
            )}
            <div className={`text-[11px] mt-1 ${isUserMessage ? 'text-right text-green-700/80' : 'text-right text-gray-500/80'}`}>
              {time}
              {isUserMessage && <span className="ml-1 opacity-70">✓✓</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Input Bar - More realistic */}
      <div className="bg-gray-100 p-2 flex items-center border-t border-gray-200 space-x-2">
        <span className="text-gray-500 text-2xl p-1.5 hover:bg-gray-200 rounded-full cursor-pointer" role="img" aria-label="Emoji">😀</span>
        <input 
          type="text" 
          placeholder="Message" 
          className="flex-grow p-2.5 border-none bg-white rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent h-10" 
          disabled 
        />
        <span className="text-gray-500 text-xl p-1.5 hover:bg-gray-200 rounded-full cursor-pointer" role="img" aria-label="Attach">📎</span>
        {!isUserMessage && <span className="text-gray-500 text-xl p-1.5 hover:bg-gray-200 rounded-full cursor-pointer" role="img" aria-label="Camera">📸</span>}
         <button className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-primary-dark transition-colors" aria-label="Send/Microphone">
            <span className="text-xl" role="img">🎤</span>
         </button>
      </div>
    </div>
  );
};

export default WhatsAppPreview;
