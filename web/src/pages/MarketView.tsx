import React, { useEffect, useState } from 'react';
import { Card, Table, Typography } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styled from '@emotion/styled';
import { formatMoney, formatPercent } from '../utils/format';

const { Title } = Typography;

// 样式组件
const StyledCard = styled(Card)`
  margin-bottom: 16px;
`;

interface MarketData {
  id: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  volume: number;
  turnover: number;
}

const MarketView: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取市场数据
  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/market/data');
      const data = await response.json();
      setMarketData(data);
    } catch (error) {
      console.error('获取市场数据失败:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMarketData();
    // 设置定时刷新
    const timer = setInterval(fetchMarketData, 60000); // 每分钟刷新一次
    return () => clearInterval(timer);
  }, []);

  const columns = [
    {
      title: '基金名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '最新价',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (price: number) => formatMoney(price),
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      render: (percent: number) => (
        <span style={{ color: percent > 0 ? '#52c41a' : percent < 0 ? '#ff4d4f' : 'inherit' }}>
          {formatPercent(percent)}
        </span>
      ),
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      key: 'volume',
      render: (volume: number) => formatMoney(volume, 0),
    },
    {
      title: '成交额',
      dataIndex: 'turnover',
      key: 'turnover',
      render: (turnover: number) => formatMoney(turnover),
    },
  ];

  return (
    <div>
      <Title level={2}>市场行情</Title>
      
      <StyledCard title="基金行情">
        <Table
          dataSource={marketData}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </StyledCard>

      <StyledCard title="市场趋势">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={marketData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="currentPrice" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </StyledCard>
    </div>
  );
};

export default MarketView;