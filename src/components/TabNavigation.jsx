// components/TabNavigation.jsx
import React from 'react';

const TabNavigation = ({ tabs, activeTab, onTabClick }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        {tabs.map((tab) => (
          <li key={tab.id} className="me-2">
            <a
              href="#"
              className={` p-1 inline-flex items-center justify-center  border-b-2 rounded-t-lg group ${activeTab === tab.id ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              onClick={() => onTabClick(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.icon}
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabNavigation;
