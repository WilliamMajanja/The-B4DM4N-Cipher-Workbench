import React from 'react';
import { AnalysisTab } from '../../types.ts';

interface TabButtonProps {
    title: string;
    tabName: AnalysisTab;
    activeTab: AnalysisTab;
    setActiveTab: (tab: AnalysisTab) => void;
    disabled?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ title, tabName, activeTab, setActiveTab, disabled }) => {
    const isActive = activeTab === tabName;
    return (
        <button
            onClick={() => setActiveTab(tabName)}
            disabled={disabled}
            className={`py-2 px-4 font-semibold -mb-px border-b-2 transition-colors duration-200 ${
                isActive 
                ? 'text-green-400 border-green-400' 
                : 'text-gray-400 border-transparent hover:text-green-300'
            } ${disabled ? 'text-gray-600 cursor-not-allowed border-transparent' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tabName}-panel`}
        >
            {title}
        </button>
    );
};

export default TabButton;
