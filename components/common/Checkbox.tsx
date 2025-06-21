import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, id, checked, onChange, description, ...props }) => {
  const uniqueId = id || `checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="relative flex items-start py-1">
      <div className="flex items-center h-5">
        <input
          id={uniqueId}
          type="checkbox"
          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-offset-1 clickable"
          checked={checked}
          onChange={onChange}
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={uniqueId} className="font-medium text-gray-800 clickable">
          {label}
        </label>
        {description && <p className="text-gray-500 text-xs">{description}</p>}
      </div>
    </div>
  );
};

export default Checkbox;
