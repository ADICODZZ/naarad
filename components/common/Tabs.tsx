import React, { useState, createContext, useContext, ReactNode } from 'react';

interface TabProps {
  label: string;
  icon?: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}

// This component is mostly a placeholder for structure; Tabs will manage rendering.
export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

interface TabsContextType {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[];
  defaultIndex?: number;
  onTabChange?: (index: number) => void; // Callback when tab changes
  className?: string;
  tabListClassName?: string;
  tabPanelClassName?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  children,
  defaultIndex = 0,
  onTabChange,
  className = "",
  tabListClassName = "",
  tabPanelClassName = ""
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const tabs = React.Children.toArray(children) as React.ReactElement<TabProps>[];

  const handleTabClick = (index: number) => {
    if (tabs[index].props.disabled) return;
    setActiveIndex(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };

  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className={`w-full ${className}`}>
        <div className={`mb-6 border-b border-gray-300 flex space-x-1 sm:space-x-2 ${tabListClassName}`} role="tablist">
          {tabs.map((tab, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls={`tabpanel-${index}`}
              id={`tab-${index}`}
              onClick={() => handleTabClick(index)}
              disabled={tab.props.disabled}
              className={`
                flex items-center px-3 py-3 sm:px-5 sm:py-3.5 text-sm sm:text-base font-medium leading-5 rounded-t-lg
                focus:outline-none focus:ring-2 focus:ring-primary/70 transition-all duration-200 ease-in-out
                ${tab.props.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-primary hover:bg-primary/5'}
                ${activeIndex === index ? 'border-b-2 border-primary text-primary font-semibold' : 'border-b-2 border-transparent'}
                whitespace-nowrap
              `}
            >
              {tab.props.icon && <span className="mr-2 text-lg">{tab.props.icon}</span>}
              {tab.props.label}
            </button>
          ))}
        </div>
        <div>
          {tabs.map((tab, index) => (
            <div
              key={index}
              role="tabpanel"
              id={`tabpanel-${index}`}
              aria-labelledby={`tab-${index}`}
              className={`${activeIndex === index ? 'block' : 'hidden'} ${tabPanelClassName}`}
            >
              {tab.props.children}
            </div>
          ))}
        </div>
      </div>
    </TabsContext.Provider>
  );
};

export const useTabs = (): TabsContextType => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a Tabs component');
  }
  return context;
};
