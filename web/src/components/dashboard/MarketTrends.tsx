import React from 'react';
import { Card } from 'antd';
import ReactECharts from 'echarts-for-react';

const MarketTrends: React.FC = () => {
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['上海市场', '香港市场'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    yAxis: { type: 'value' },
    series: [
      { name: '上海市场', type: 'line', smooth: true, data: [1.1, 1.3, 0.8, 1.5, 1.2, 1.6, 1.23] },
      { name: '香港市场', type: 'line', smooth: true, data: [2.0, 2.2, 1.6, 2.9, 2.4, 2.8, 2.56] }
    ]
  };

  return (
    <Card title="市场趋势" className="shadow-sm">
      <div className="h-80">
        <ReactECharts option={option} style={{ height: '100%' }} />
      </div>
    </Card>
  );
};

export default MarketTrends;
