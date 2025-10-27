import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Avatar, Button, Modal, Form, Input, message, Tabs, Table } from 'antd';
import { UserOutlined, KeyOutlined, SecurityScanOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useAuthStore } from '../store/authStore';
import { formatMoney, formatDateTime } from '../utils/format';

const { TabPane } = Tabs;

// 样式组件
const StyledCard = styled(Card)`
  margin-bottom: 16px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const UserInfo = styled.div`
  margin-left: 24px;
`;

const UserName = styled.h2`
  margin: 0;
  color: rgba(0, 0, 0, 0.85);
`;

const UserEmail = styled.p`
  margin: 4px 0 0;
  color: rgba(0, 0, 0, 0.45);
`;

interface TradeRecord {
  id: string;
  type: 'buy' | 'sell';
  fundName: string;
  amount: number;
  price: number;
  total: number;
  status: string;
  createdAt: string;
}

const UserProfile: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [tradeRecords, setTradeRecords] = useState<TradeRecord[]>([]);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [form] = Form.useForm();

  // 获取交易记录
  const fetchTradeRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/trades');
      const data = await response.json();
      setTradeRecords(data);
    } catch (error) {
      message.error('获取交易记录失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTradeRecords();
  }, []);

  // 修改密码
  const handleChangePassword = async (values: any) => {
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('修改密码失败');
      }

      message.success('密码修改成功');
      setChangePasswordVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('修改密码失败');
    }
  };

  const tradeColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: 'buy' | 'sell') => (
        <span style={{ color: type === 'buy' ? '#52c41a' : '#ff4d4f' }}>
          {type === 'buy' ? '买入' : '卖出'}
        </span>
      ),
    },
    {
      title: '基金名称',
      dataIndex: 'fundName',
      key: 'fundName',
    },
    {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatMoney(amount, 2),
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatMoney(price, 4),
    },
    {
      title: '总额',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => formatMoney(total, 2),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => formatDateTime(time),
    },
  ];

  return (
    <div>
      <StyledCard>
        <ProfileHeader>
          <Avatar size={64} icon={<UserOutlined />} src={user?.avatar} />
          <UserInfo>
            <UserName>{user?.username}</UserName>
            <UserEmail>{user?.email}</UserEmail>
          </UserInfo>
        </ProfileHeader>

        <Tabs defaultActiveKey="1">
          <TabPane tab="账户信息" key="1">
            <Descriptions bordered>
              <Descriptions.Item label="用户名">{user?.username}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{user?.email}</Descriptions.Item>
              <Descriptions.Item label="注册时间">
                {formatDateTime(user?.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="账户余额">
                {formatMoney(user?.balance || 0)}
              </Descriptions.Item>
              <Descriptions.Item label="总资产">
                {formatMoney(user?.totalAssets || 0)}
              </Descriptions.Item>
            </Descriptions>
            
            <Button
              type="primary"
              icon={<KeyOutlined />}
              style={{ marginTop: 16 }}
              onClick={() => setChangePasswordVisible(true)}
            >
              修改密码
            </Button>
          </TabPane>
          
          <TabPane tab="交易记录" key="2">
            <Table
              dataSource={tradeRecords}
              columns={tradeColumns}
              rowKey="id"
              loading={loading}
            />
          </TabPane>
        </Tabs>
      </StyledCard>

      <Modal
        title="修改密码"
        open={changePasswordVisible}
        onCancel={() => setChangePasswordVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleChangePassword}>
          <Form.Item
            name="oldPassword"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password prefix={<SecurityScanOutlined />} placeholder="原密码" />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度不能小于6位' },
            ]}
          >
            <Input.Password prefix={<SecurityScanOutlined />} placeholder="新密码" />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<SecurityScanOutlined />} placeholder="确认新密码" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;