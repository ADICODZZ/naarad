
import React from 'react';
import { PRIMARY_CTA_COLOR, PRIMARY_CTA_HOVER_COLOR } from '../../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/70 transition-all duration-200 ease-in-out flex items-center justify-center shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 cursor-pointer';
  
  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = `${PRIMARY_CTA_COLOR} text-white ${PRIMARY_CTA_HOVER_COLOR} focus:ring-primary`;
      break;
    case 'secondary':
      variantStyles = 'bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-600';
      break;
    case 'danger':
      variantStyles = 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      break;
    case 'outline':
      variantStyles = 'border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary shadow-none hover:shadow-sm';
      break;
    case 'ghost':
      variantStyles = 'text-primary hover:bg-primary/10 focus:ring-primary shadow-none';
      break;
  }

  let sizeStyles = '';
  let iconSize = 'h-5 w-5';
  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1.5 text-sm';
      iconSize = 'h-4 w-4';
      break;
    case 'md':
      sizeStyles = 'px-5 py-2.5 text-base';
      break;
    case 'lg':
      sizeStyles = 'px-7 py-3 text-lg';
      iconSize = 'h-6 w-6';
      break;
  }

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${isLoading ? 'opacity-75 cursor-not-allowed pointer-events-none' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className={`animate-spin mr-3 ${iconSize} text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {leftIcon && !isLoading && <span className={`mr-2 ${iconSize}`}>{leftIcon}</span>}
      {children}
      {rightIcon && !isLoading && <span className={`ml-2 ${iconSize}`}>{rightIcon}</span>}
    </button>
  );
};

export default Button;