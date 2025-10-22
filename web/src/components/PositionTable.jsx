import React, { useState, useEffect } from 'react';

export function PositionTable() {
  const [data, setData] = useState([]);

  // 模拟获取持仓数据
  useEffect(() => {
    // 模拟API调用
    const fetchData = async () => {
      // 模拟数据
      const mockData = [
        { id: '1', name: '全球增长基金', amount: 100, cost: 12.50, price: 13.20, pnl: 70 },
        { id: '2', name: 'BTC永续合约', amount: 0.5, cost: 32000, price: 34000, pnl: 1000 },
        { id: '3', name: 'AAPL期权', amount: 10, cost: 150, price: 165, pnl: 150 }
      ];
      setData(mockData);
    };

    fetchData();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">名称</th>
            <th className="text-left p-2">数量</th>
            <th className="text-left p-2">成本价</th>
            <th className="text-left p-2">当前价</th>
            <th className="text-left p-2">盈亏</th>
          </tr>
        </thead>
        <tbody>
          {data.map(pos => (
            <tr key={pos.id} className="border-b">
              <td className="p-2">{pos.name}</td>
              <td className="p-2">{pos.amount}</td>
              <td className="p-2">{pos.cost}</td>
              <td className="p-2">{pos.price}</td>
              <td className={`p-2 ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {pos.pnl >= 0 ? '+' : ''}{pos.pnl}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PositionTable;