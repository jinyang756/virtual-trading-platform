import React from 'react';
import { Card, List, Tag } from 'antd';

const products = Array.from({ length: 10 }).map((_, i) => ({
  name: `稳健私募基金 ${i + 1}`,
  yield: (8.5 + i * 0.7).toFixed(1),
}));

const FundProducts: React.FC = () => {
  return (
    <Card title="私募基金产品" className="shadow-sm">
      <List
        dataSource={products}
        renderItem={(item) => (
          <List.Item>
            <div className="flex justify-between w-full">
              <span className="text-gray-700">{item.name}</span>
              <div>
                <Tag color="green">年化 {item.yield}%</Tag>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default FundProducts;
