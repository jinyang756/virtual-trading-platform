import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  HomeOutlined,
  LineChartOutlined,
  TrademarkOutlined,
  UserOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';

const { Header, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  background: #fff;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
`;

const Logo = styled.div`
  width: 200px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
`;

const StyledContent = styled(Content)`
  padding: 24px;
  background: #f0f2f5;
`;

const ContentWrapper = styled.div`
  background: #fff;
  padding: 24px;
  min-height: 280px;
  border-radius: 4px;
`;

const MainLayout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/market',
      icon: <LineChartOutlined />,
      label: <Link to="/market">行情</Link>,
    },
    {
      key: '/trading',
      icon: <TrademarkOutlined />,
      label: <Link to="/trading">交易</Link>,
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">我的</Link>,
    },
  ];

  return (
    <StyledLayout>
      <StyledHeader>
        <Logo>聚财众发虚拟交易平台</Logo>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </StyledHeader>
      <StyledContent>
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </StyledContent>
    </StyledLayout>
  );
};

export default MainLayout;
