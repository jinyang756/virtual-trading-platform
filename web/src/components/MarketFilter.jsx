import React from 'react';

export function MarketFilter({ type, onChange }) {
  return (
    <div className="flex gap-2">
      {['基金', '合约', '期权'].map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-4 py-2 rounded ${type === t ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default MarketFilter;