import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  InputNumber,
  Button,
  Table,
  Space,
  Tag,
  Slider,
  Form,
  message,
  Tabs,
  Statistic
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CloseCircleOutlined,
  SettingOutlined
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
import { formatMoney, formatPercent } from '../../utils/format';

const { TabPane } = Tabs;
const { Option } = Select;

interface ContractData {
  id: string;
  symbol: string;
  name: string;
  exchange: 'SHANGHAI' | 'HONGKONG';
  lastPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  turnover: number;
  open: number;
  high: number;
  low: number;
  preClose: number;
  margin: number;
  multiplier: number;
  tickSize: number;
}

interface Position {
  id: string;
  contractId: string;
  direction: 'long' | 'short';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  margin: number;
  profit: number;
  profitPercent: number;
  stopLoss?: number;
  takeProfit?: number;
}

const ContractTrading: React.FC = () => {
  const { user } = useAuthStore();
  const [form] = Form.useForm();
  const [exchange, setExchange] = useState<'SHANGHAI' | 'HONGKONG'>('SHANGHAI');
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [leverage, setLeverage] = useState(1);
  const ws = useRef<WebSocket | null>(null);

  // 连接WebSocket获取实时价格
  useEffect(() => {
    ws.current = new WebSocket(\`ws://your-websocket-url/\${exchange}\`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateContractPrice(data);
    };

    return () => {
      ws.current?.close();
    };
  }, [exchange]);

  // 获取合约列表
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await fetch(\`/api/contracts?exchange=\${exchange}\`);
      const data = await response.json();
      setContracts(data);
      if (data.length > 0) {
        setSelectedContract(data[0]);
      }
    } catch (error) {
      message.error('获取合约列表失败');
    }
    setLoading(false);
  };

  // 获取持仓信息
  const fetchPositions = async () => {
    try {
      const response = await fetch('/api/contracts/positions');
      const data = await response.json();
      setPositions(data);
    } catch (error) {
      message.error('获取持仓信息失败');
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [exchange]);

  useEffect(() => {
    fetchPositions();
  }, []);

  // 更新合约价格
  const updateContractPrice = (data: any) => {
    setContracts(prevContracts =>
      prevContracts.map(contract =>
        contract.symbol === data.symbol
          ? { ...contract, ...data }
          : contract
      )
    );

    // 更新持仓盈亏
    if (positions.length > 0) {
      setPositions(prevPositions =>
        prevPositions.map(position =>
          position.contractId === data.symbol
            ? {
                ...position,
                currentPrice: data.lastPrice,
                profit: calculateProfit(
                  position.direction,
                  position.quantity,
                  position.entryPrice,
                  data.lastPrice,
                  position.multiplier
                ),
                profitPercent: calculateProfitPercent(
                  position.direction,
                  position.entryPrice,
                  data.lastPrice
                )
              }
            : position
        )
      );
    }
  };

  // 计算盈亏
  const calculateProfit = (
    direction: string,
    quantity: number,
    entryPrice: number,
    currentPrice: number,
    multiplier: number
  ) => {
    const diff = direction === 'long'
      ? currentPrice - entryPrice
      : entryPrice - currentPrice;
    return diff * quantity * multiplier;
  };

  const calculateProfitPercent = (
    direction: string,
    entryPrice: number,
    currentPrice: number
  ) => {
    return direction === 'long'
      ? (currentPrice - entryPrice) / entryPrice * 100
      : (entryPrice - currentPrice) / entryPrice * 100;
  };

  // 处理下单
  const handlePlaceOrder = async (values: any) => {
    if (!selectedContract) return;

    try {
      setOrderLoading(true);

      // 计算所需保证金
      const margin = calculateMargin(
        selectedContract.lastPrice,
        values.quantity,
        selectedContract.margin,
        leverage
      );

      const response = await fetch('/api/contracts/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: selectedContract.id,
          direction: values.direction,
          quantity: values.quantity,
          leverage,
          stopLoss: values.stopLoss,
          takeProfit: values.takeProfit,
          margin,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      message.success('下单成功');
      form.resetFields();
      fetchPositions();
    } catch (error) {
      message.error(error.message || '下单失败');
    } finally {
      setOrderLoading(false);
    }
  };

  // 处理平仓
  const handleClosePosition = async (positionId: string) => {
    try {
      await fetch(\`/api/contracts/positions/\${positionId}/close\`, {
        method: 'POST',
      });
      message.success('平仓成功');
      fetchPositions();
    } catch (error) {
      message.error('平仓失败');
    }
  };

  // 计算所需保证金
  const calculateMargin = (
    price: number,
    quantity: number,
    marginRate: number,
    leverage: number
  ) => {
    return price * quantity * marginRate / leverage;
  };

  const contractColumns = [
    {
      title: '代码',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '最新价',
      dataIndex: 'lastPrice',
      key: 'lastPrice',
      render: (price: number) => formatMoney(price),
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      render: (value: number) => (
        <Tag color={value >= 0 ? '#f50' : '#52c41a'}>
          {value >= 0 ? '+' : ''}{formatPercent(value)}
        </Tag>
      ),
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      key: 'volume',
      render: (value: number) => value.toLocaleString(),
    },
  ];

  const positionColumns = [
    {
      title: '合约',
      dataIndex: 'contractId',
      key: 'contractId',
    },
    {
      title: '方向',
      dataIndex: 'direction',
      key: 'direction',
      render: (direction: string) => (
        <Tag color={direction === 'long' ? '#f50' : '#52c41a'}>
          {direction === 'long' ? '多' : '空'}
        </Tag>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '开仓价',
      dataIndex: 'entryPrice',
      key: 'entryPrice',
      render: (price: number) => formatMoney(price),
    },
    {
      title: '当前价',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (price: number) => formatMoney(price),
    },
    {
      title: '保证金',
      dataIndex: 'margin',
      key: 'margin',
      render: (value: number) => formatMoney(value),
    },
    {
      title: '盈亏',
      key: 'profit',
      render: (_, record: Position) => (
        <Space>
          <span style={{ color: record.profit >= 0 ? '#52c41a' : '#f5222d' }}>
            {record.profit >= 0 ? '+' : ''}{formatMoney(record.profit)}
          </span>
          <span>({record.profitPercent >= 0 ? '+' : ''}{formatPercent(record.profitPercent)})</span>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Position) => (
        <Button
          danger
          icon={<CloseCircleOutlined />}
          onClick={() => handleClosePosition(record.id)}
        >
          平仓
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Tabs
              activeKey={exchange}
              onChange={(key) => setExchange(key as 'SHANGHAI' | 'HONGKONG')}
            >
              <TabPane tab="上海期货交易所" key="SHANGHAI" />
              <TabPane tab="香港期货交易所" key="HONGKONG" />
            </Tabs>
          </Card>
        </Col>

        <Col span={16}>
          <Card title="合约列表">
            <Table
              columns={contractColumns}
              dataSource={contracts}
              rowKey="symbol"
              loading={loading}
              pagination={false}
              onRow={(record) => ({
                onClick: () => setSelectedContract(record),
                style: { cursor: 'pointer' },
              })}
              rowClassName={(record) =>
                record.symbol === selectedContract?.symbol ? 'ant-table-row-selected' : ''
              }
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="交易面板">
            <Form
              form={form}
              layout="vertical"
              onFinish={handlePlaceOrder}
            >
              <Form.Item label="杠杆倍数">
                <Slider
                  min={1}
                  max={20}
                  value={leverage}
                  onChange={setLeverage}
                  marks={{
                    1: '1x',
                    5: '5x',
                    10: '10x',
                    20: '20x',
                  }}
                />
              </Form.Item>

              <Form.Item
                name="direction"
                label="交易方向"
                rules={[{ required: true, message: '请选择交易方向' }]}
              >
                <Select>
                  <Option value="long">做多</Option>
                  <Option value="short">做空</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="quantity"
                label="数量(手)"
                rules={[{ required: true, message: '请输入数量' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  precision={0}
                />
              </Form.Item>

              <Form.Item name="stopLoss" label="止损价">
                <InputNumber
                  style={{ width: '100%' }}
                  precision={2}
                />
              </Form.Item>

              <Form.Item name="takeProfit" label="止盈价">
                <InputNumber
                  style={{ width: '100%' }}
                  precision={2}
                />
              </Form.Item>

              {selectedContract && (
                <div className="mb-4">
                  <div>预计保证金：
                    {formatMoney(
                      calculateMargin(
                        selectedContract.lastPrice,
                        form.getFieldValue('quantity') || 0,
                        selectedContract.margin,
                        leverage
                      )
                    )}
                  </div>
                </div>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={orderLoading}
                  block
                >
                  下单
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="当前持仓">
            <Table
              columns={positionColumns}
              dataSource={positions}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContractTrading;