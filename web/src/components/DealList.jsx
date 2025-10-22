import React, { useState, useEffect } from 'react';

export function DealList() {
  const [data, setData] = useState([]);

  // 模拟获取成交记录数据
  useEffect(() => {
    // 模拟API调用
    const fetchData = async () => {
      // 模拟数据
      const mockData = [
        { id: '1', name: '全球增长基金', type: '买入', price: 12.50, amount: 100, time: '2023-05-01 10:30:00' },
        { id: '2', name: 'BTC永续合约', type: '卖出', price: 34000, amount: 0.5, time: '2023-05-01 11:45:00' },
        { id: '3', name: 'AAPL期权', type: '买入', price: 150, amount: 10, time: '2023-05-01 14:20:00' }
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
            <th className="text-left p-2">类型</th>
            <th className="text-left p-2">价格</th>
            <th className="text-left p-2">数量</th>
            <th className="text-left p-2">成交时间</th>
          </tr>
        </thead>
        <tbody>
          {data.map(deal => (
            <tr key={deal.id} className="border-b">
              <td className="p-2">{deal.name}</td>
              <td className="p-2">
                <span className={deal.type === '买入' ? 'text-green-500' : 'text-red-500'}>
                  {deal.type}
                </span>
              </td>
              <td className="p-2">{deal.price}</td>
              <td className="p-2">{deal.amount}</td>
              <td className="p-2">{deal.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DealList;