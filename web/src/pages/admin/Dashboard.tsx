import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, Typography, Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { adminApi } from '../../services/adminApi';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentTrades, setRecentTrades] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 并行请求数据
      const [statsRes, tradesRes] = await Promise.all([
        adminApi.getSystemStats(),
        adminApi.getTrades({ limit: 5, sort: 'desc' })
      ]);
      
      setStats(statsRes.data);
      setRecentTrades(tradesRes.data.trades || []);
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      'completed': { color: 'green', text: '已完成' },
      'pending': { color: 'orange', text: '处理中' },
      'cancelled': { color: 'red', text: '已取消' }
    };
    
    const config = statusMap[status] || { color: 'gray', text: '未知' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const tradeColumns = [
    { 
      title: '订单号', 
      dataIndex: 'id', 
      key: 'id' 
    },
    { 
      title: '用户ID', 
      dataIndex: 'userId', 
      key: 'userId' 
    },
    { 
      title: '交易品种', 
      dataIndex: 'symbol', 
      key: 'symbol' 
    },
    { 
      title: '数量', 
      dataIndex: 'quantity', 
      key: 'quantity' 
    },
    { 
      title: '金额', 
      dataIndex: 'amount', 
      key: 'amount', 
      render: (amount: number) => `$${amount.toFixed(2)}` 
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      render: getStatusTag 
    },
    { 
      title: '时间', 
      dataIndex: 'timestamp', 
      key: 'timestamp' 
    }
  ];

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  return (
    <div className="dashboard-container">
      <Title level={2}>管理仪表盘</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={stats?.users || 0}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={stats?.activeUsers || 0}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总交易数"
              value={stats?.totalTrades || 0}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总交易额"
              value={stats?.totalVolume || 0}
              precision={2}
              valueStyle={{ color: '#722ed1' }}
              formatter={(value) => `$${value}`}
            />
          </Card>
        </Col>
      </Row>
      
      <Card title="最近交易" style={{ marginBottom: 24 }}>
        <Table 
          columns={tradeColumns} 
          dataSource={recentTrades} 
          rowKey="id" 
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Dashboard;