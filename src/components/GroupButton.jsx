import React, { useState } from 'react';
import PropTypes from 'prop-types';

const GroupButton = ({ buttons, onButtonClick }) => {
  const [selectedLabel, setSelectedLabel] = useState(buttons[0].label);

  const handleButtonClick = (label, value) => {
    setSelectedLabel(label);
    onButtonClick(value);
  };

  return (
    <div className="inline-flex rounded-md shadow-sm">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(button.label, button.value)}
          className={`px-3 py-1.5 text-sm font-medium border rounded-md ${
            button.label === selectedLabel
              ? 'text-white border border-solid border-slate-600 outline-4 outline-offset-2 outline-emerald-300 bg-blue-600' // Highlighted button style
              : 'text-gray-900 border-gray-200 bg-gray-50'  // Default button style
          } hover:bg-opacity-90 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-white`}
          style={{ backgroundColor: button.color || 'gray' }}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

GroupButton.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      color: PropTypes.string,
    })
  ).isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

export default GroupButton;
