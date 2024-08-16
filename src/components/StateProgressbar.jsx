// StateProgressbar.js
import React from 'react';
import PropTypes from 'prop-types';

const StateProgressbar = ({ states, currentState }) => {
    return (
        <div className="flex justify-between items-center w-full p-4 bg-gray-200 rounded-lg">
            {states.map((state, index) => (
                <div key={index} className={`relative flex-1 text-center p-2 ${index <= currentState ? 'bg-green-500 text-white' : 'bg-gray-300'} rounded-lg mx-1`}>
                    {state}
                    {index < states.length - 1 && (
                        <div className={`absolute top-1/2 right-0 transform translate-x-1/2 w-4 h-1 ${index < currentState ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    )}
                </div>
            ))}
        </div>
    );
};

StateProgressbar.propTypes = {
    states: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentState: PropTypes.number.isRequired,
};

export default StateProgressbar;
