import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Button, message, Card, Typography } from 'antd';
import { realtimeService } from '../services/realtimeService';

const { Title } = Typography;
const { Option } = Select;

interface TradeData {
  symbol: string;
  quantity: number;
  price: number;
  side: 'buy' | 'sell';
}

const TradeForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: TradeData) => {
    try {
      setLoading(true);
      
      // 发送交易指令
      const result = await realtimeService.sendTrade(values);
      console.log('交易结果:', result);
      
      message.success('交易指令发送成功');
      form.resetFields();
    } catch (error) {
      console.error('交易失败:', error);
      message.error('交易指令发送失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={<Title level={4} style={{ margin: 0 }}>交易下单</Title>}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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
          name="side"
          label="交易方向"
          rules={[{ required: true, message: '请选择交易方向' }]}
        >
          <Select placeholder="请选择交易方向">
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
            loading={loading}
            block
          >
            提交交易
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TradeForm;