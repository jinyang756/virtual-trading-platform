import React from 'react';
import { DollarCircleOutlined, WalletOutlined, FundOutlined, RiseOutlined } from '@ant-design/icons';
import StatCard from './StatCard';

const AssetOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="资产总览"
        value="$125,689.45"
        subtitle="24h"
        trend="+2.34%"
        icon={<DollarCircleOutlined />}
        accent="blue"
      />
      <StatCard
        title="可用余额"
        value="$45,689.23"
        icon={<WalletOutlined />}
        accent="green"
      />
      <StatCard
        title="持仓市值"
        value="$78,245.67"
        icon={<FundOutlined />}
        accent="purple"
      />
      <StatCard
        title="今日收益"
        value="+$1,245.89"
        icon={<RiseOutlined />}
        accent="orange"
      />
    </div>
  );
};

export default AssetOverview;
