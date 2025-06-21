

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  as?: 'input' | 'textarea';
  inputClassName?: string; // To style the input element itself
  labelClassName?: string; // To style the label element
}

const Input: React.FC<InputProps> = ({ label, id, icon, error, className, as = 'input', inputClassName, labelClassName, ...props }) => {
  const ElementType = as;
  const baseInputStyles = `
    form-input block w-full sm:text-sm rounded-lg
    border border-gray-300 
    focus:ring-2 focus:ring-opacity-60
    transition-colors duration-150 ease-in-out shadow-sm
    placeholder-gray-500 
    ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5
    ${error 
        ? 'border-red-500 text-red-700 focus:ring-red-500 focus:border-red-500' 
        : 'text-gray-900 focus:ring-primary focus:border-primary hover:border-gray-400'
    }
    ${inputClassName || ''}
  `;
  // Default light theme: bg-white, text-gray-900. Dark theme overrides are handled via inputClassName.

  return (
    <div className={`w-full ${className || ''}`}>
      {label && (
        <label htmlFor={id} className={`block text-sm font-medium text-gray-700 mb-1.5 ${labelClassName || ''}`}>
          {label}
        </label>
      )}
      <div className="relative rounded-md">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 sm:text-sm">{icon}</span>
          </div>
        )}
        <ElementType
          id={id}
          className={baseInputStyles}
          {...(props as any)} // Type assertion needed for dynamic element type
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;