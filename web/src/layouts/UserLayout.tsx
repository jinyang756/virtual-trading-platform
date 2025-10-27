import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Badge } from 'antd';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  FundOutlined,
  LineChartOutlined,
  StockOutlined,
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';

const { Header, Content, Sider } = Layout;

const UserLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const menuItems = [
    {
      key: '/',
      icon: <UserOutlined />,
      label: <Link to="/">个人中心</Link>,
    },
    {
      key: '/funds',
      icon: <FundOutlined />,
      label: <Link to="/funds">基金交易</Link>,
    },
    {
      key: '/binary-options',
      icon: <LineChartOutlined />,
      label: <Link to="/binary-options">期权交易</Link>,
    },
    {
      key: '/contracts',
      icon: <StockOutlined />,
      label: <Link to="/contracts">合约交易</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    }
    // 处理其他菜单项...
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
      >
        <div className="logo" style={{ 
          height: '32px', 
          margin: '16px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '6px',
        }} />
        
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
          <Space size={24}>
            <Badge count={notifications.length}>
              <BellOutlined style={{ fontSize: '18px' }} />
            </Badge>
            
            <Dropdown menu={{ 
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}>
              <Space className="cursor-pointer">
                <Avatar icon={<UserOutlined />} />
                <span>{user?.username}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;