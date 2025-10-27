import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Table, Tag, Badge, Tabs, Button, Space, message, Statistic, List, Avatar } from 'antd';
import { 
  InfoCircleOutlined, 
  TrademarkOutlined, 
  WarningOutlined, 
  UserOutlined,
  WalletOutlined,
  HistoryOutlined,
  BellOutlined
} from '@ant-design/icons';
import { NotificationType, NotificationStatus, NOTIFICATION_TYPES, NOTIFICATION_STATUS } from '../../types/notification';
import { formatMoney } from '../../utils/format';
import { useAuthStore } from '../../store/authStore';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  status: NotificationStatus;
  timestamp: string;
  read: boolean;
}

interface UserData {
  totalAssets: number;
  availableBalance: number;
  frozenAmount: number;
  unrealizedPnL: number;
  marginAmount: number;
}

const NOTIFICATION_MAP = NOTIFICATION_TYPES;
const STATUS_MAP = NOTIFICATION_STATUS;

interface TradeRecord {
  id: string;
  type: 'fund' | 'option' | 'contract';
  action: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  total: number;
  status: NotificationStatus;
  timestamp: string;
}

interface ExtendedNotification extends Notification {
  isRead: boolean;
}

const ProductTypes = {
  fund: { text: '基金', color: 'blue' },
  option: { text: '期权', color: 'green' },
  contract: { text: '合约', color: 'purple' },
} as const;

type ProductType = keyof typeof ProductTypes;

const UserCenter: React.FC = () => {
  const { user } = useAuthStore();
  const [balance, setBalance] = useState(0);
  const [tradeRecords, setTradeRecords] = useState<TradeRecord[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取账户信息
  const fetchAccountInfo = async () => {
    try {
      const response = await fetch('/api/user/account');
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      message.error('获取账户信息失败');
    }
  };

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

  // 获取系统通知
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/user/notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      message.error('获取系统通知失败');
    }
  };

  useEffect(() => {
    fetchAccountInfo();
    fetchTradeRecords();
    fetchNotifications();
  }, []);

  // 标记通知为已读
  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/user/notifications/${id}/read`, {
        method: 'POST'
      });
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      message.error('操作失败');
    }
  };

  const tradeColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: ProductType) => {
        const config = ProductTypes[type];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => (
        <Tag color={action === 'buy' ? 'red' : 'green'}>
          {action === 'buy' ? '买入' : '卖出'}
        </Tag>
      ),
    },
    {
      title: '代码',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: '数量/手数',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatMoney(price),
    },
    {
      title: '总额',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => formatMoney(total),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          success: { text: '成功', color: 'success' },
          failed: { text: '失败', color: 'error' },
          pending: { text: '处理中', color: 'processing' },
        };
        return (
          <Badge 
            status={statusMap[status].color} 
            text={statusMap[status].text}
          />
        );
      },
    },
  ];

  const getNotificationIcon = (type: NotificationType) => {
    const icons: Record<NotificationType, JSX.Element> = {
      system: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
      trade: <TrademarkOutlined style={{ color: '#52c41a' }} />,
      risk: <WarningOutlined style={{ color: '#faad14' }} />,
    };
    return icons[type];
  };

  return (
    <div className="p-6">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Row gutter={16} align="middle">
              <Col>
                <Avatar size={64} icon={<UserOutlined />} />
              </Col>
              <Col>
                <Title level={4}>{user?.username}</Title>
                <Text type="secondary">账户ID: {user?.id}</Text>
              </Col>
              <Col offset={2}>
                <Card>
                  <Statistic
                    title="账户余额"
                    value={balance}
                    precision={2}
                    prefix={<WalletOutlined />}
                    suffix="元"
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card>
            <Tabs defaultActiveKey="trades">
              <TabPane
                tab={
                  <span>
                    <HistoryOutlined />
                    交易记录
                  </span>
                }
                key="trades"
              >
                <Table
                  columns={tradeColumns}
                  dataSource={tradeRecords}
                  rowKey="id"
                  loading={loading}
                />
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <BellOutlined />
                    系统通知
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <Badge 
                        count={notifications.filter(n => !n.isRead).length} 
                        offset={[10, -5]}
                      />
                    )}
                  </span>
                }
                key="notifications"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={notifications}
                  renderItem={item => (
                    <List.Item
                      extra={
                        !item.isRead && (
                          <Button 
                            type="link" 
                            onClick={() => markAsRead(item.id)}
                          >
                            标记已读
                          </Button>
                        )
                      }
                    >
                      <List.Item.Meta
                        avatar={getNotificationIcon(item.type)}
                        title={
                          <Space>
                            {item.title}
                            {!item.isRead && <Badge dot />}
                          </Space>
                        }
                        description={
                          <div>
                            <div>{item.content}</div>
                            <small style={{ color: '#999' }}>
                              {new Date(item.timestamp).toLocaleString()}
                            </small>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserCenter;