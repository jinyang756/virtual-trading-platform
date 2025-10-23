import React from 'react';

export default function MarketCard({ data }) {
  return (
    <div className="bg-white rounded shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-sm">{data.name}</h3>
          <p className="text-xs text-gray-500">代码：{data.code}</p>
        </div>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{data.type}</span>
      </div>
      <div className="mt-2">
        <p className="text-sm">价格：{data.price}</p>
        <p className={`text-sm ${data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {data.change >= 0 ? '+' : ''}{data.change}%
        </p>
      </div>
    </div>
  );
}