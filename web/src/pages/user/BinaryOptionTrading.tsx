import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  InputNumber,
  Space,
  message,
  Statistic,
  Radio,
  Progress,
  Tag,
  Modal
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useAuthStore } from '../../store/authStore';
import { formatMoney } from '../../utils/format';

interface PriceData {
  time: string;
  price: number;
}

interface OptionOrder {
  id: string;
  direction: 'up' | 'down';
  amount: number;
  duration: number;
  entryPrice: number;
  endPrice?: number;
  profit?: number;
  status: 'pending' | 'completed';
  remainingTime?: number;
}

const BinaryOptionTrading: React.FC = () => {
  const { user } = useAuthStore();
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [amount, setAmount] = useState<number>(100);
  const [duration, setDuration] = useState<number>(1);
  const [activeOrders, setActiveOrders] = useState<OptionOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  // 连接WebSocket获取实时价格
  useEffect(() => {
    ws.current = new WebSocket('ws://your-websocket-url');

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCurrentPrice(data.price);
      setPriceHistory(prev => [...prev.slice(-50), { time: data.time, price: data.price }]);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  // 获取活跃订单
  const fetchActiveOrders = async () => {
    try {
      const response = await fetch('/api/binary-options/active-orders');
      const data = await response.json();
      setActiveOrders(data);
    } catch (error) {
      message.error('获取订单失败');
    }
  };

  useEffect(() => {
    fetchActiveOrders();
    const interval = setInterval(updateOrdersTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 更新订单倒计时
  const updateOrdersTime = () => {
    setActiveOrders(prevOrders =>
      prevOrders.map(order => ({
        ...order,
        remainingTime: order.remainingTime ? order.remainingTime - 1 : undefined
      }))
    );
  };

  // 处理下单
  const handlePlaceOrder = async (direction: 'up' | 'down') => {
    try {
      setLoading(true);
      
      // 验证金额
      if (amount < 100 || amount > 10000) {
        message.error('单笔交易金额需在100-10000元之间');
        return;
      }

      const response = await fetch('/api/binary-options/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direction,
          amount,
          duration,
          entryPrice: currentPrice,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const newOrder = await response.json();
      setActiveOrders(prev => [...prev, newOrder]);
      message.success('下单成功');
    } catch (error) {
      message.error(error.message || '下单失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="实时行情">
            <div className="mb-4">
              <Statistic
                title="当前价格"
                value={currentPrice}
                precision={2}
                prefix="$"
                valueStyle={{ color: '#cf1322', fontSize: 36 }}
              />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#8884d8"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="交易面板">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <div className="mb-2">选择周期</div>
                <Radio.Group
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  buttonStyle="solid"
                >
                  <Radio.Button value={1}>1分钟</Radio.Button>
                  <Radio.Button value={5}>5分钟</Radio.Button>
                  <Radio.Button value={10}>10分钟</Radio.Button>
                </Radio.Group>
              </div>

              <div>
                <div className="mb-2">交易金额</div>
                <InputNumber
                  style={{ width: '100%' }}
                  min={100}
                  max={10000}
                  step={100}
                  value={amount}
                  onChange={value => setAmount(value)}
                  formatter={value => \`￥ \${value}\`.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')}
                  parser={value => value!.replace(/￥\\s?|(,*)/g, '')}
                />
              </div>

              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button
                  type="primary"
                  danger
                  icon={<ArrowUpOutlined />}
                  onClick={() => handlePlaceOrder('up')}
                  loading={loading}
                  style={{ width: '48%' }}
                >
                  看涨
                </Button>
                <Button
                  type="primary"
                  icon={<ArrowDownOutlined />}
                  onClick={() => handlePlaceOrder('down')}
                  loading={loading}
                  style={{ width: '48%', backgroundColor: '#52c41a' }}
                >
                  看跌
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="活跃订单">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOrders.map(order => (
                <Card
                  key={order.id}
                  size="small"
                  extra={
                    <Tag color={order.status === 'pending' ? 'processing' : 'success'}>
                      {order.status === 'pending' ? '进行中' : '已完成'}
                    </Tag>
                  }
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      方向：
                      <Tag color={order.direction === 'up' ? 'red' : 'green'}>
                        {order.direction === 'up' ? '看涨' : '看跌'}
                      </Tag>
                    </div>
                    <div>金额：{formatMoney(order.amount)}</div>
                    <div>
                      入场价：{order.entryPrice}
                      {order.endPrice && (
                        <span>
                          {' '}/ 结算价：{order.endPrice}
                        </span>
                      )}
                    </div>
                    {order.status === 'pending' && order.remainingTime && (
                      <>
                        <div>
                          <ClockCircleOutlined /> 剩余时间：
                          {Math.floor(order.remainingTime / 60)}:
                          {String(order.remainingTime % 60).padStart(2, '0')}
                        </div>
                        <Progress
                          percent={
                            ((order.duration * 60 - order.remainingTime) /
                              (order.duration * 60)) *
                            100
                          }
                          showInfo={false}
                          status="active"
                        />
                      </>
                    )}
                    {order.profit !== undefined && (
                      <div
                        style={{
                          color: order.profit >= 0 ? '#52c41a' : '#f5222d',
                          fontWeight: 'bold',
                        }}
                      >
                        盈亏：
                        {order.profit >= 0 ? '+' : ''}
                        {formatMoney(order.profit)}
                      </div>
                    )}
                  </Space>
                </Card>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BinaryOptionTrading;