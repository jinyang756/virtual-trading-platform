import React from 'react';
import { Card, Tag } from 'antd';

const OptionsRecommendations: React.FC = () => {
  return (
    <Card title="二元期权推荐" className="shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="text-gray-600">1分钟期</div>
          <div className="text-2xl font-semibold mt-1">85%</div>
          <Tag color="green" className="mt-2">高收益</Tag>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-gray-600">5分钟期</div>
          <div className="text-2xl font-semibold mt-1">78%</div>
          <Tag color="blue" className="mt-2">平衡</Tag>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-gray-600">10分钟期</div>
          <div className="text-2xl font-semibold mt-1">72%</div>
          <Tag color="orange" className="mt-2">稳健</Tag>
        </div>
      </div>
    </Card>
  );
};

export default OptionsRecommendations;
