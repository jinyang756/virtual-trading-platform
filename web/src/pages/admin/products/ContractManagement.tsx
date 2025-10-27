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
  Select 
} from 'antd';


interface ContractData {
  id: string;
  symbol: string;
  name: string;
  type: string;
  multiplier: number;
  margin: number;
  status: 'active' | 'inactive';
  tickSize: number;
  tradingHours: string;
}

export const ContractManagement: React.FC = (): JSX.Element => {
  const [form] = Form.useForm();
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editingContract, setEditingContract] = useState<ContractData | null>(null);

  // 获取合约列表
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/contracts');
      const data = await response.json();
      setContracts(data);
    } catch (error) {
      message.error('获取合约列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // 处理创建/编辑合约
  const handleSubmit = async (values: any) => {
    try {
      if (editingContract) {
        await fetch('/api/admin/contracts/' + editingContract.id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        message.success('合约更新成功');
      } else {
        await fetch('/api/admin/contracts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        message.success('合约创建成功');
      }
      setVisible(false);
      form.resetFields();
      fetchContracts();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 处理删除合约
  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/admin/contracts/' + id, {
        method: 'DELETE',
      });
      message.success('合约删除成功');
      fetchContracts();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '合约代码',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: '合约名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '合约类型',
      dataIndex: 'type',
      key: 'type',
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
          {status === 'active' ? '交易中' : '已下市'}
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
      render: (_: any, record: ContractData) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingContract(record);
              form.setFieldsValue(record);
              setVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该合约吗？"
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

  const contractTypes = [
    '股指期货',
    '国债期货',
    '商品期货',
    '期货期权',
    '商品期权',
  ];

  return (
    <div>
      <div className="mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingContract(null);
            form.resetFields();
            setVisible(true);
          }}
        >
          创建合约
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={contracts}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingContract ? '编辑合约' : '创建合约'}
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
            label="合约代码"
            rules={[{ required: true, message: '请输入合约代码' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="合约名称"
            rules={[{ required: true, message: '请输入合约名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="合约类型"
            rules={[{ required: true, message: '请选择合约类型' }]}
          >
            <Select>
              {contractTypes.map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
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
              formatter={(value): string => (Number(value) * 100).toFixed(2) + '%'}
              parser={(value): 0 | 1 => {
                const num = value ? Number(value.replace('%', '')) / 100 : 0;
                return num > 0.5 ? 1 : 0;
              }}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value="active">交易中</Select.Option>
              <Select.Option value="inactive">已下市</Select.Option>
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

export default ContractManagement;