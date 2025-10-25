import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Statistic, Table, Tag, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { realtimeService } from '../../services/realtimeService';

const { Title } = Typography;

interface ClientInfo {
  userId: string;
  username: string;
  connectedAt: string;
}

interface TradeData {
  orderId: string;
  symbol: string;
  quantity: number;
  price: number;
  side: string;
  timestamp: string;
}

const RealtimeDashboard: React.FC = () => {
  const [clientCount, setClientCount] = useState(0);
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [recentTrades, setRecentTrades] = useState<TradeData[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查连接状态
    setConnected(realtimeService.isConnected());
    
    // 模拟获取客户端信息和交易数据
    setTimeout(() => {
      setClientCount(5);
      setClients([
        { userId: '1', username: 'admin', connectedAt: new Date().toISOString() },
        { userId: '2', username: 'user1', connectedAt: new Date().toISOString() },
        { userId: '3', username: 'user2', connectedAt: new Date().toISOString() },
        { userId: '4', username: 'trader1', connectedAt: new Date().toISOString() },
        { userId: '5', username: 'investor1', connectedAt: new Date().toISOString() }
      ]);
      
      setRecentTrades([
        { orderId: 'order_1', symbol: 'SH_FUTURE', quantity: 10, price: 1000, side: 'buy', timestamp: new Date().toISOString() },
        { orderId: 'order_2', symbol: 'HK_FUTURE', quantity: 5, price: 800, side: 'sell', timestamp: new Date().toISOString() },
        { orderId: 'order_3', symbol: 'OIL_FUTURE', quantity: 20, price: 85, side: 'buy', timestamp: new Date().toISOString() }
      ]);
      
      setLoading(false);
    }, 1000);

    // 监听交易更新
    const unsubscribeTrade = realtimeService.onTradeUpdate((data: TradeData) => {
      setRecentTrades(prevTrades => [data, ...prevTrades].slice(0, 10));
    });

    // 清理函数
    return () => {
      unsubscribeTrade();
    };
  }, []);

  const clientColumns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '连接时间',
      dataIndex: 'connectedAt',
      key: 'connectedAt',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '状态',
      key: 'status',
      render: () => (
        <Tag icon={<CheckCircleOutlined />} color="success">
          在线
        </Tag>
      ),
    },
  ];

  const tradeColumns = [
    {
      title: '订单号',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: '交易品种',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '方向',
      dataIndex: 'side',
      key: 'side',
      render: (side: string) => (
        <Tag color={side === 'buy' ? 'green' : 'red'}>
          {side === 'buy' ? '买入' : '卖出'}
        </Tag>
      ),
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (time: string) => new Date(time).toLocaleTimeString(),
    },
  ];

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  return (
    <div className="realtime-dashboard-container">
      <Title level={2} style={{ marginBottom: 24 }}>实时数据监控</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="在线客户端"
              value={clientCount}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="连接状态"
              value={connected ? '已连接' : '未连接'}
              valueStyle={{ color: connected ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="最近交易"
              value={recentTrades.length}
              precision={0}
              valueStyle={{ color: '#722ed1' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="在线客户端" style={{ marginBottom: 24 }}>
            <Table 
              columns={clientColumns} 
              dataSource={clients} 
              rowKey="userId" 
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="最近交易">
            <Table 
              columns={tradeColumns} 
              dataSource={recentTrades} 
              rowKey="orderId" 
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RealtimeDashboard;