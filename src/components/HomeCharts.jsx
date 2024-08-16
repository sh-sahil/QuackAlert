// components/HomeCharts.jsx
import React, { useState } from 'react';
import TabNavigation from './TabNavigation';
import TabContent from './TabContent';
import GLOBE from '../assets/globe.png';
const tabs = [
  {
    id: 'globe',
    label: 'Global',
    icon: <img src={GLOBE} alt="Chart Icon" className="w-4 h-4 me-2" />, 
    
  },
  // {
  //   id: 'dashboard',
  //   label: 'Dashboard',
  //   icon: (
  //     <svg className="w-4 h-4 me-2 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
  //       <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
  //     </svg>
  //   ),
  // },
  // {
  //   id: 'settings',
  //   label: 'Settings',
  //   icon: (
  //     <svg className="w-4 h-4 me-2 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
  //       <path d="M5 11.424V1a1 1 0 1 0-2 0v10.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.228 3.228 0 0 0 0-6.152ZM19.25 14.5A3.243 3.243 0 0 0 17 11.424V1a1 1 0 0 0-2 0v10.424a3.227 3.227 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.243 3.243 0 0 0 2.25-3.076Zm-6-9A3.243 3.243 0 0 0 11 2.424V1a1 1 0 0 0-2 0v1.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0V8.576A3.243 3.243 0 0 0 13.25 5.5Z" />
  //     </svg>
  //   ),
  // },
  // {
  //   id: 'contacts',
  //   label: 'Contacts',
  //   icon: (
  //     <svg className="w-4 h-4 me-2 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
  //       <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
  //     </svg>
  //   ),
  // },
  // {
  //   id: 'disabled',
  //   label: 'Disabled',
  //   icon: null,
  // },
];


const HomeCharts = ({earthquakeInfo,selectedLatLon,setRadius,setSelectedLatLon,isChartLoading}) => {

  const [activeTab, setActiveTab] = useState('globe');

  const handleTabClick = (id) => {
    setActiveTab(id);
  };

  return (
    <div className="w-full flex flex-col h-full bg-gray-800 p-4">
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />

      <TabContent isChartLoading={isChartLoading} activeTab={activeTab} earthquakeInfo={earthquakeInfo} selectedLatLon={selectedLatLon} setSelectedLatLon={setSelectedLatLon}  setRadius={setRadius}/>

    </div>
  );
};

export default HomeCharts;
