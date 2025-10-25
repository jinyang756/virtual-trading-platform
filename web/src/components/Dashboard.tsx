import React from 'react';
import { Layout, Menu, Card, Row, Col, Statistic, Button } from 'antd';
import { 
  DashboardOutlined, 
  BarChartOutlined, 
  FundOutlined, 
  UserOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import TradingPanel from './TradingPanel';
import PerformanceReport from './PerformanceReport';

const { Header, Sider, Content } = Layout;

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="总资产"
                    value={123456.78}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    prefix="¥"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="今日收益"
                    value={1234.56}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    prefix="¥"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="持仓数量"
                    value={8}
                    precision={0}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="交易次数"
                    value={24}
                    precision={0}
                  />
                </Card>
              </Col>
            </Row>
            
            <Card title="快速操作" style={{ marginBottom: 24 }}>
              <Button type="primary" size="large" style={{ marginRight: 16 }}>
                买入
              </Button>
              <Button size="large" style={{ marginRight: 16 }}>
                卖出
              </Button>
              <Button size="large">
                资金转账
              </Button>
            </Card>
            
            <Card title="市场概览">
              <p>市场行情图表将在这里显示</p>
            </Card>
          </div>
        );
      case 'trading':
        return <TradingPanel />;
      case 'performance':
        return <PerformanceReport />;
      case 'settings':
        return (
          <Card title="系统设置">
            <p>系统设置内容将在这里显示</p>
          </Card>
        );
      default:
        return <div>页面未找到</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
        <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(255,255,255,.2)' }} />
        <Menu 
          mode="inline" 
          defaultSelectedKeys={['dashboard']}
          selectedKeys={[activeTab]}
          onSelect={({ key }) => setActiveTab(key)}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            仪表板
          </Menu.Item>
          <Menu.Item key="trading" icon={<FundOutlined />}>
            交易面板
          </Menu.Item>
          <Menu.Item key="performance" icon={<BarChartOutlined />}>
            性能报告
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            系统设置
          </Menu.Item>
        </Menu>
      </Sider>
      
      <Layout>
        <Header style={{ background: '#fff', padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24 }}>
          <div></div>
          <div>
            <Button type="text" icon={<UserOutlined />}>
              用户名
            </Button>
            <Button type="text" icon={<LogoutOutlined />}>
              退出
            </Button>
          </div>
        </Header>
        
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;