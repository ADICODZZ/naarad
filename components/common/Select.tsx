import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  error?: string;
  icon?: React.ReactNode; // Optional icon for the select
}

const Select: React.FC<SelectProps> = ({ label, id, options, error, className, icon, ...props }) => {
  return (
    <div className={`w-full ${className || ''}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <span className="text-gray-400 sm:text-sm">{icon}</span>
          </div>
        )}
        <select
          id={id}
          className={`
            block w-full ${icon ? 'pl-10' : 'pl-3'} pr-10 py-2.5 text-base border-gray-300 
            focus:outline-none focus:ring-primary focus:border-primary focus:ring-2 focus:ring-opacity-50
            sm:text-sm rounded-lg shadow-sm clickable
            placeholder-gray-400
            ${error ? 'border-red-500 text-red-700 focus:ring-red-500 focus:border-red-500' : 'text-gray-900'}
          `}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
