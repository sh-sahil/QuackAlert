import React, { useState, useRef } from 'react';

const RangeSelector = ({ min = 100, max = 1500, step = 1, onValueChange }) => {
  const [value, setValue] = useState(max);
  const [isHovering, setIsHovering] = useState(false);
  const rangeRef = useRef(null);

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    onValueChange(newValue); // Notify parent component about the value change
 
    
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Tooltip position
  const tooltipLeft = rangeRef.current
    ? `calc(${((value - min) / (max - min)) * 100}% - 1rem)`
    : '0';

  return (
    <div
      className="relative mb-6"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <label htmlFor="labels-range-input" className="sr-only">Labels range</label>
      <input
        id="labels-range-input"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        ref={rangeRef}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
      {/* Tooltip */}
      {isHovering && (
        <div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded-lg px-2 py-1"
          style={{ left: tooltipLeft }}
        >
          {value}km
        </div>
      )}
      {/* Min, Max, and Step Labels */}
      <span className="text-sm text-gray-500 dark:text-gray-400 absolute left-0 -bottom-6">{`${min}km`}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400 absolute left-1/3 transform -translate-x-1/2 -bottom-6">{`${Math.round(min + (max - min) / 3)}km`}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400 absolute left-2/3 transform -translate-x-1/2 -bottom-6">{`${Math.round(min + 2 * (max - min) / 3)}km`}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400 absolute right-0 -bottom-6">{`${max}km`}</span>
    </div>
  );
};

export default RangeSelector;
