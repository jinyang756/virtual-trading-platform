import React from 'react';
import { Card, Input, Button } from 'antd';

const AIAssistant: React.FC = () => {
  return (
    <Card title="AI交易助手" className="shadow-sm">
      <div className="space-y-3">
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-700">您好！我是您的AI交易助手，有什么可以帮助您的吗？</div>
          <div className="text-xs text-gray-500 mt-1">今日市场波动较大，建议关注 BTC/USDT 和 ETH/USDT 合约机会。</div>
        </div>
        <div className="flex gap-2">
          <Input placeholder="请输入您的问题，例如：推荐一个5分钟二元期权策略" />
          <Button type="primary">发送</Button>
        </div>
      </div>
    </Card>
  );
};

export default AIAssistant;
