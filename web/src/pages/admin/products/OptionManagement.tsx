import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  message, 
  Space, 
  Popconfirm, 
  Tag, 
  Select,
  DatePicker 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

interface OptionData {
  id: string;
  symbol: string;
  underlyingAsset: string;
  type: 'call' | 'put';
  strikePrice: number;
  expiryDate: string;
  multiplier: number;
  margin: number;
  status: 'active' | 'inactive';
  tickSize: number;
  tradingHours: string;
}

export const OptionManagement: React.FC = (): JSX.Element => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState<OptionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editingOption, setEditingOption] = useState<OptionData | null>(null);

  // 获取期权列表
  const fetchOptions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/options');
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      message.error('获取期权列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  // 处理创建/编辑期权
  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        expiryDate: values.expiryDate.format('YYYY-MM-DD'),
      };

      if (editingOption) {
        await fetch('/api/admin/options/' + editingOption.id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        message.success('期权更新成功');
      } else {
        await fetch('/api/admin/options', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        message.success('期权创建成功');
      }
      setVisible(false);
      form.resetFields();
      fetchOptions();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 处理删除期权
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/options/${id}`, {
        method: 'DELETE',
      });
      message.success('期权删除成功');
      fetchOptions();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '期权代码',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: '标的资产',
      dataIndex: 'underlyingAsset',
      key: 'underlyingAsset',
    },
    {
      title: '期权类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'call' ? 'blue' : 'green'}>
          {type === 'call' ? '看涨' : '看跌'}
        </Tag>
      ),
    },
    {
      title: '行权价',
      dataIndex: 'strikePrice',
      key: 'strikePrice',
      render: (price: number) => price.toFixed(2),
    },
    {
      title: '到期日',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: '合约乘数',
      dataIndex: 'multiplier',
      key: 'multiplier',
    },
    {
      title: '保证金率',
      dataIndex: 'margin',
      key: 'margin',
      render: (margin: number) => (margin * 100).toFixed(2) + '%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '交易中' : '已到期'}
        </Tag>
      ),
    },
    {
      title: '最小变动价位',
      dataIndex: 'tickSize',
      key: 'tickSize',
    },
    {
      title: '交易时间',
      dataIndex: 'tradingHours',
      key: 'tradingHours',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: OptionData) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingOption(record);
              form.setFieldsValue({
                ...record,
                expiryDate: moment(record.expiryDate),
              });
              setVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该期权吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingOption(null);
            form.resetFields();
            setVisible(true);
          }}
        >
          创建期权
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={options}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingOption ? '编辑期权' : '创建期权'}
        open={visible}
        onOk={() => form.submit()}
        onCancel={() => setVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="symbol"
            label="期权代码"
            rules={[{ required: true, message: '请输入期权代码' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="underlyingAsset"
            label="标的资产"
            rules={[{ required: true, message: '请输入标的资产' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="期权类型"
            rules={[{ required: true, message: '请选择期权类型' }]}
          >
            <Select>
              <Select.Option value="call">看涨</Select.Option>
              <Select.Option value="put">看跌</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="strikePrice"
            label="行权价"
            rules={[{ required: true, message: '请输入行权价' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={2}
            />
          </Form.Item>
          <Form.Item
            name="expiryDate"
            label="到期日"
            rules={[{ required: true, message: '请选择到期日' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="multiplier"
            label="合约乘数"
            rules={[{ required: true, message: '请输入合约乘数' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item
            name="margin"
            label="保证金率"
            rules={[{ required: true, message: '请输入保证金率' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={1}
              step={0.01}
              formatter={(value: number | string | undefined): string => {
                if (value === undefined) return '';
                return (Number(value) * 100).toFixed(2) + '%';
              }}
              parser={(value) => (value ? Number(value.replace('%', '')) / 100 : 0)}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value="active">交易中</Select.Option>
              <Select.Option value="inactive">已到期</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="tickSize"
            label="最小变动价位"
            rules={[{ required: true, message: '请输入最小变动价位' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.0001}
              precision={4}
            />
          </Form.Item>
          <Form.Item
            name="tradingHours"
            label="交易时间"
            rules={[{ required: true, message: '请输入交易时间' }]}
          >
            <Input placeholder="例如：09:30-11:30,13:00-15:00" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OptionManagement;