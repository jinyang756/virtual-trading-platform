import React from 'react';

export function TradeTabs({ tab, onChange }) {
  return (
    <div className="flex gap-4 border-b">
      {['委托', '成交'].map(t => (
        <button 
          key={t} 
          onClick={() => onChange(t)} 
          className={`px-4 py-2 ${tab === t ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default TradeTabs;