import React from 'react';

interface TagButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  color?: string; // e.g., 'bg-accent-blue'
  textColor?: string; // e.g., 'text-accent-blue-light'
  selectedColor?: string; // e.g., 'bg-primary'
  selectedTextColor?: string; // e.g., 'text-white'
  size?: 'sm' | 'md' | 'lg';
}

const TagButton: React.FC<TagButtonProps> = ({
  label,
  isSelected,
  onClick,
  icon,
  color = 'bg-gray-200 hover:bg-gray-300',
  textColor = 'text-gray-700',
  selectedColor = 'bg-primary hover:bg-primary-dark',
  selectedTextColor = 'text-white',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = `
    font-medium rounded-full 
    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/70 
    transition-all duration-200 ease-in-out flex items-center justify-center 
    transform hover:-translate-y-px active:translate-y-0 active:scale-95
    cursor-pointer
  `;

  let sizeStyles = '';
  let iconSizeClass = 'w-4 h-4';
  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1 text-xs';
      iconSizeClass = 'w-3 h-3';
      break;
    case 'md':
      sizeStyles = 'px-4 py-2 text-sm';
      break;
    case 'lg':
      sizeStyles = 'px-6 py-3 text-base';
      iconSizeClass = 'w-5 h-5';
      break;
  }

  const currentBgColor = isSelected ? selectedColor : color;
  const currentTextColor = isSelected ? selectedTextColor : textColor;
  // Tailwind config defines 'shadow-tag' and 'shadow-tag-selected'
  const currentBoxShadow = isSelected ? 'shadow-tag-selected scale-105' : 'shadow-tag hover:shadow-md';


  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseStyles} ${currentBgColor} ${currentTextColor} ${currentBoxShadow} ${sizeStyles} ${className}`}
      aria-pressed={isSelected}
      {...props}
    >
      {icon && <span className={`mr-2 ${iconSizeClass}`}>{icon}</span>}
      {label}
    </button>
  );
};

export default TagButton;