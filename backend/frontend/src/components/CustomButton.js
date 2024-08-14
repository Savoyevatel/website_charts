import React from 'react';

const CustomButton = ({ onClick, children }) => {
  return (
    <button
      className="x-6 inline-block py-3 w-full sm:w-fit rounded-full mr-4 bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-200 text-white"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default CustomButton;