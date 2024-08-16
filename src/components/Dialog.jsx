import React from 'react';

const Dialog = ({ msg, header, isOpen, onClose, onConfirm, onReject }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75'>
            <div className='bg-white p-6 rounded shadow-lg'>
                <h2 className='text-lg font-bold mb-4'>{header}</h2>
                <p className='mb-4'>{msg}</p>
                <div className='flex justify-end'>
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2'
                        onClick={onConfirm}
                    >
                        Accept
                    </button>
                    <button
                        className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                        onClick={onReject}
                    >
                        Reject
                    </button>
                </div>
                <button className='absolute top-2 right-2' onClick={onClose}>
                    X
                </button>
            </div>
        </div>
    );
};

export default Dialog;
