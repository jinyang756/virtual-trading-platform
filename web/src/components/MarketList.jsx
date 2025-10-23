import React from 'react';
import { MarketCard } from './ui';

export function MarketList({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map(item => (
        <MarketCard key={item.id} data={item} />
      ))}
    </div>
  );
}

export default MarketList;