import React from 'react';

const FundCard = ({ name, nav, change }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md p-4">
      <h3 className="font-bold text-gray-800">{name}</h3>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-lg font-semibold">¥{nav}</span>
        <span className={`px-2 py-1 rounded text-sm font-medium ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {change}
        </span>
      </div>
    </div>
  );
};

export default FundCard;