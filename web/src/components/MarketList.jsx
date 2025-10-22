import React from 'react';

export function MarketList({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map(item => (
        <div key={item.id} className="p-4 border rounded shadow">
          <h3 className="font-bold">{item.name}</h3>
          <p>净值：{item.nav}</p>
          <p className={item.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}>
            {item.changePercent >= 0 ? '+' : ''}{item.changePercent}%
          </p>
        </div>
      ))}
    </div>
  );
}

export default MarketList;