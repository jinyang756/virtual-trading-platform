import React, { useState, useEffect } from 'react';

export function FavoritesSection() {
  const [data, setData] = useState({});

  // 模拟获取收藏数据
  useEffect(() => {
    // 模拟API调用
    const fetchData = async () => {
      // 模拟数据
      const mockData = {
        '基金': [
          { id: '1', name: '全球增长基金', code: 'JJ001' },
          { id: '2', name: '医疗保健基金', code: 'JJ002' }
        ],
        '合约': [
          { id: '3', name: 'BTC永续合约', code: 'HY001' },
          { id: '4', name: 'ETH季度合约', code: 'HY002' }
        ],
        '期权': [
          { id: '5', name: 'AAPL期权', code: 'QX001' },
          { id: '6', name: 'TSLA期权', code: 'QX002' }
        ]
      };
      setData(mockData);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">我的收藏</h3>
      {['基金', '合约', '期权'].map(type => (
        <div key={type}>
          <h4 className="text-sm text-gray-600">{type}</h4>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {data[type]?.map(item => (
              <div key={item.id} className="p-2 border rounded min-w-[120px] bg-white">
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">{item.code}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FavoritesSection;