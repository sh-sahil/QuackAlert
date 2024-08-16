// components/TabContent.jsx
import React from 'react';

import GanttChart from './GanttChart';


const TabContent = ({ activeTab , earthquakeInfo,selectedLatLon,setRadius,setSelectedLatLon ,isChartLoading}) => {
 
  const renderContent = () => {
    
    switch (activeTab) {
      case 'globe':
        return <GanttChart isChartLoading={isChartLoading} earthquakeInfo={earthquakeInfo} setSelectedLatLon={setSelectedLatLon} setRadius={setRadius}/>;


      case 'dashboard':
        return <div>Dashboard Content</div>;
      case 'settings':
        return <div>Settings Content</div>;
      case 'contacts':
        return <div>Contacts Content</div>;
      case 'disabled':
        return <div>Disabled Content</div>;
      default:
        return <div>Select a tab</div>;
    }
  };

  return <div className="flex-1 bg-gray-800 p-4">{renderContent()}</div>;
};

export default TabContent;
