import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Select, 
  Button, 
  Tag, 
  Space, 
  Row, 
  Col,
  Modal,
  Form,
  InputNumber,
  message,
  Progress,
  Tooltip 
} from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer
} from 'recharts';
import { 
  RiseOutlined, 
  FallOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { formatMoney, formatPercent } from '../../utils/format';

interface FundData {
  id: string;
  code: string;
  name: string;
  type: string;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  nav: number;
  dailyReturn: number;
  weeklyReturn: number;
  monthlyReturn: number;
  yearlyReturn: number;
  minInvestment: number;
}

interface PerformanceData {
  date: string;
  nav: number;
  benchmark: number;
}

const FundTrading: React.FC = () => {
  const { user } = useAuthStore();
  const [funds, setFunds] = useState<FundData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFund, setSelectedFund] = useState<FundData | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [orderVisible, setOrderVisible] = useState(false);
  const [form] = Form.useForm();

  // 获取基金列表
  const fetchFunds = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/funds/active');
      const data = await response.json();
      setFunds(data);
    } catch (error) {
      message.error('获取基金列表失败');
    }
    setLoading(false);
  };

  // 获取基金业绩数据
  const fetchPerformance = async (fundId: string) => {
    try {
      const response = await fetch(\`/api/funds/\${fundId}/performance\`);
      const data = await response.json();
      setPerformanceData(data);
    } catch (error) {
      message.error('获取业绩数据失败');
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  // 处理基金购买
  const handleBuy = async (values: { amount: number }) => {
    if (!selectedFund) return;

    try {
      // 验证下单金额
      if (values.amount < selectedFund.minInvestment) {
        message.error(\`最小投资金额为\${formatMoney(selectedFund.minInvestment)}\`);
        return;
      }

      const response = await fetch('/api/funds/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fundId: selectedFund.id,
          amount: values.amount,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      message.success('购买申请提交成功');
      setOrderVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.message || '购买失败');
    }
  };

  const getRiskLevelTag = (level: number) => {
    const levels = {
      1: { color: 'green', text: '低风险' },
      2: { color: 'cyan', text: '中低风险' },
      3: { color: 'blue', text: '中风险' },
      4: { color: 'orange', text: '中高风险' },
      5: { color: 'red', text: '高风险' },
    };
    return <Tag color={levels[level].color}>{levels[level].text}</Tag>;
  };

  const getReturnTag = (value: number) => {
    const color = value >= 0 ? '#f50' : '#52c41a';
    const icon = value >= 0 ? <RiseOutlined /> : <FallOutlined />;
    return (
      <Tag color={color}>
        {icon} {formatPercent(value)}
      </Tag>
    );
  };

  const columns = [
    {
      title: '基金代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '基金名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (level: number) => getRiskLevelTag(level),
      filters: [
        { text: '低风险', value: 1 },
        { text: '中低风险', value: 2 },
        { text: '中风险', value: 3 },
        { text: '中高风险', value: 4 },
        { text: '高风险', value: 5 },
      ],
      onFilter: (value: number, record: FundData) => record.riskLevel === value,
    },
    {
      title: '单位净值',
      dataIndex: 'nav',
      key: 'nav',
      render: (nav: number) => formatMoney(nav, 4),
    },
    {
      title: '日收益率',
      dataIndex: 'dailyReturn',
      key: 'dailyReturn',
      render: (value: number) => getReturnTag(value),
      sorter: (a: FundData, b: FundData) => a.dailyReturn - b.dailyReturn,
    },
    {
      title: '近一月',
      dataIndex: 'monthlyReturn',
      key: 'monthlyReturn',
      render: (value: number) => getReturnTag(value),
      sorter: (a: FundData, b: FundData) => a.monthlyReturn - b.monthlyReturn,
    },
    {
      title: '近一年',
      dataIndex: 'yearlyReturn',
      key: 'yearlyReturn',
      render: (value: number) => getReturnTag(value),
      sorter: (a: FundData, b: FundData) => a.yearlyReturn - b.yearlyReturn,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: FundData) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setSelectedFund(record);
              fetchPerformance(record.id);
              setDetailVisible(true);
            }}
          >
            详情
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setSelectedFund(record);
              setOrderVisible(true);
            }}
          >
            购买
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card title="基金列表">
        <Table
          columns={columns}
          dataSource={funds}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title="基金详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={800}
        footer={null}
      >
        {selectedFund && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="业绩走势">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip />
                      <Line
                        type="monotone"
                        dataKey="nav"
                        name="净值"
                        stroke="#8884d8"
                      />
                      <Line
                        type="monotone"
                        dataKey="benchmark"
                        name="基准"
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              
              <Col span={24}>
                <Card title="产品说明">
                  <p>{selectedFund.description}</p>
                </Card>
              </Col>

              <Col span={24}>
                <Card
                  title={
                    <span>
                      <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                      {' '}风险提示
                    </span>
                  }
                >
                  <p>
                    1. 基金投资存在风险，本金可能受到损失；
                  </p>
                  <p>
                    2. 基金的过往业绩并不预示其未来表现；
                  </p>
                  <p>
                    3. 投资者投资于基金前应认真阅读基金合同和招募说明书。
                  </p>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      <Modal
        title="基金购买"
        open={orderVisible}
        onOk={() => form.submit()}
        onCancel={() => setOrderVisible(false)}
      >
        {selectedFund && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleBuy}
          >
            <Form.Item label="基金名称">
              <Input disabled value={selectedFund.name} />
            </Form.Item>
            
            <Form.Item label="单位净值">
              <Input disabled value={formatMoney(selectedFund.nav, 4)} />
            </Form.Item>

            <Form.Item
              name="amount"
              label="购买金额"
              rules={[
                { required: true, message: '请输入购买金额' },
                {
                  type: 'number',
                  min: selectedFund.minInvestment,
                  message: \`最小投资金额为\${formatMoney(selectedFund.minInvestment)}\`,
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={selectedFund.minInvestment}
                precision={2}
                formatter={value => \`￥ \${value}\`.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')}
                parser={value => value!.replace(/￥\\s?|(,*)/g, '')}
              />
            </Form.Item>

            <div className="text-sm text-gray-500 mb-4">
              <InfoCircleOutlined /> 申购资金将于下一个交易日确认
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default FundTrading;