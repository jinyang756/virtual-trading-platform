import React, { useState, useEffect } from 'react';

export function OrderList() {
  const [data, setData] = useState([]);

  // 模拟获取委托记录数据
  useEffect(() => {
    // 模拟API调用
    const fetchData = async () => {
      // 模拟数据
      const mockData = [
        { id: '1', name: '全球增长基金', type: '买入', price: 12.50, amount: 100, status: '已成交' },
        { id: '2', name: 'BTC永续合约', type: '卖出', price: 34000, amount: 0.5, status: '部分成交' },
        { id: '3', name: 'AAPL期权', type: '买入', price: 150, amount: 10, status: '未成交' }
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
            <th className="text-left p-2">状态</th>
          </tr>
        </thead>
        <tbody>
          {data.map(order => (
            <tr key={order.id} className="border-b">
              <td className="p-2">{order.name}</td>
              <td className="p-2">
                <span className={order.type === '买入' ? 'text-green-500' : 'text-red-500'}>
                  {order.type}
                </span>
              </td>
              <td className="p-2">{order.price}</td>
              <td className="p-2">{order.amount}</td>
              <td className="p-2">
                <span className={
                  order.status === '已成交' ? 'text-green-500' : 
                  order.status === '部分成交' ? 'text-yellow-500' : 'text-gray-500'
                }>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;