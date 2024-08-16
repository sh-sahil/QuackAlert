import React from 'react';
import './LoadingOverlay.css'; // Custom styles for overlay

const LoadingOverlay = ({ isLoading, children }) => {
  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-bar"></div>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

export default LoadingOverlay;
