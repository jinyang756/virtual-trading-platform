import React, { useState, useEffect } from 'react';
import { Card, Form, Input, InputNumber, Select, Button, message, Table, Tag, Spin } from 'antd';
import { tradingService } from '../services/tradingService';
// 导入性能监控
import { performanceMonitor } from '../utils/performance';

const { Option } = Select;

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  volume: number;
}

interface TradeData {
  symbol: string;
  quantity: number;
  price: number;
  type: 'buy' | 'sell';
}

interface Position {
  id: string;
  name: string;
  amount: number;
  cost: number;
  price: number;
  pnl: number;
}

const TradingPanel: React.FC = () => {
  const [form] = Form.useForm();
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // 标记交易面板加载开始
    performanceMonitor.mark('trading-panel-load-start');
    
    fetchMarketData();
    fetchPositions();
    
    // 标记交易面板加载完成
    performanceMonitor.mark('trading-panel-load-end');
    performanceMonitor.measure('trading-panel-load-time', 'trading-panel-load-start', 'trading-panel-load-end');
    
    // 订阅市场数据更新
    const unsubscribe = tradingService.subscribeToMarketUpdates('', (data) => {
      // 标记市场数据更新
      performanceMonitor.mark('market-data-update');
      
      setMarketData(prevData => {
        const existingIndex = prevData.findIndex(item => item.symbol === data.symbol);
        if (existingIndex >= 0) {
          const newData = [...prevData];
          newData[existingIndex] = data;
          return newData;
        } else {
          return [...prevData, data];
        }
      });
    });

    // 订阅交易更新
    const unsubscribeTrade = tradingService.subscribeToTradeUpdates((data) => {
      // 标记交易更新
      performanceMonitor.mark('trade-update');
      
      // 交易成功后重新获取持仓数据
      fetchPositions();
    });

    return () => {
      unsubscribe();
      unsubscribeTrade();
    };
  }, []);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      // 标记市场数据获取开始
      performanceMonitor.mark('fetch-market-data-start');
      
      // 调用实际的API获取市场数据
      // 这里我们模拟一些市场数据
      const mockData = [
        { symbol: 'SH_FUTURE', price: 1000, change: 0.5, volume: 10000 },
        { symbol: 'HK_FUTURE', price: 800, change: -0.2, volume: 8000 },
        { symbol: 'NY_FUTURE', price: 1200, change: 1.2, volume: 15000 },
        { symbol: 'OIL_FUTURE', price: 85, change: 0.8, volume: 5000 },
        { symbol: 'GOLD_FUTURE', price: 1950, change: -0.3, volume: 3000 }
      ];
      setMarketData(mockData);
      
      // 标记市场数据获取完成
      performanceMonitor.mark('fetch-market-data-end');
      performanceMonitor.measure('fetch-market-data-time', 'fetch-market-data-start', 'fetch-market-data-end');
    } catch (error) {
      console.error('获取市场数据失败:', error);
      message.error('获取市场数据失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      setLoading(true);
      // 标记持仓数据获取开始
      performanceMonitor.mark('fetch-positions-start');
      
      // 调用实际的API获取持仓数据
      const response = await tradingService.getPositions();
      setPositions(response.data || []);
      
      // 标记持仓数据获取完成
      performanceMonitor.mark('fetch-positions-end');
      performanceMonitor.measure('fetch-positions-time', 'fetch-positions-start', 'fetch-positions-end');
    } catch (error) {
      console.error('获取持仓数据失败:', error);
      message.error('获取持仓数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceTrade = async (values: TradeData) => {
    try {
      setSubmitting(true);
      // 标记交易提交开始
      performanceMonitor.mark('place-trade-start');
      
      const tradeData = {
        symbol: values.symbol,
        quantity: values.quantity,
        price: values.price,
        type: values.type
      };

      const result = await tradingService.placeTrade(tradeData);
      console.log('交易结果:', result);
      
      message.success('交易成功');
      form.resetFields();
      
      // 标记交易提交完成
      performanceMonitor.mark('place-trade-end');
      performanceMonitor.measure('place-trade-time', 'place-trade-start', 'place-trade-end');
      
      // 重新获取持仓数据
      fetchPositions();
    } catch (error) {
      console.error('交易失败:', error);
      message.error('交易失败: ' + (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const marketColumns = [
    {
      title: '交易品种',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: '当前价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '涨跌幅',
      dataIndex: 'change',
      key: 'change',
      render: (change: number) => (
        <Tag color={change >= 0 ? 'green' : 'red'}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </Tag>
      ),
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      key: 'volume',
    },
  ];

  const positionColumns = [
    {
      title: '交易品种',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '持仓数量',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '平均价格',
      dataIndex: 'cost',
      key: 'cost',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '当前价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '浮动盈亏',
      dataIndex: 'pnl',
      key: 'pnl',
      render: (profit: number) => (
        <span style={{ color: profit >= 0 ? 'green' : 'red' }}>
          {profit >= 0 ? '+' : ''}{profit.toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <div className="trading-panel-container">
      <Card title="交易面板" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handlePlaceTrade}
        >
          <Form.Item
            name="symbol"
            label="交易品种"
            rules={[{ required: true, message: '请选择交易品种' }]}
          >
            <Select placeholder="请选择交易品种">
              <Option value="SH_FUTURE">聚财基金上海合约</Option>
              <Option value="HK_FUTURE">聚财基金香港合约</Option>
              <Option value="NY_FUTURE">聚财基金纽约合约</Option>
              <Option value="OIL_FUTURE">原油期货合约</Option>
              <Option value="GOLD_FUTURE">黄金期货合约</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="交易类型"
            rules={[{ required: true, message: '请选择交易类型' }]}
          >
            <Select placeholder="请选择交易类型">
              <Option value="buy">买入</Option>
              <Option value="sell">卖出</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="数量"
            rules={[{ required: true, message: '请输入交易数量' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入交易数量"
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入交易价格' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入交易价格"
              min={0}
              step={0.01}
              formatter={value => `¥${value}`}
              parser={value => value!.replace(/¥\s?|(,*)/g, '') as any}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitting}
              block
            >
              提交交易
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="市场行情" style={{ marginBottom: 24 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin tip="加载中..." />
          </div>
        ) : (
          <Table 
            columns={marketColumns} 
            dataSource={marketData} 
            rowKey="symbol" 
            pagination={false}
          />
        )}
      </Card>

      <Card title="持仓情况">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin tip="加载中..." />
          </div>
        ) : (
          <Table 
            columns={positionColumns} 
            dataSource={positions} 
            rowKey="id" 
            pagination={false}
          />
        )}
      </Card>
    </div>
  );
};

export default TradingPanel;