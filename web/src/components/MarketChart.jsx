import React from 'react';
import EChartsReact from 'echarts-for-react';

export function MarketChart({ data }) {
  const chartData = data.map(item => ({
    name: item.name,
    value: item.nav
  }));

  const option = {
    tooltip: {},
    xAxis: { 
      type: 'category', 
      data: chartData.map(d => d.name) 
    },
    yAxis: { 
      type: 'value' 
    },
    series: [
      {
        data: chartData.map(d => d.value),
        type: 'bar'
      }
    ]
  };

  return <EChartsReact option={option} style={{ height: 300 }} />;
}

export default MarketChart;