import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  message,
  Space,
  Popconfirm,
  Tag,
  Select
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';interface FundData {
  id: string;
  name: string;
  code: string;
  type: string;
  nav: number;
  size: number;
  status: 'active' | 'inactive';
  startDate: string;
  manager: string;
}

interface FundData {
  id: string;
  name: string;
  type: string;
  nav: number;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const FundManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [funds, setFunds] = useState<FundData[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editingFund, setEditingFund] = useState<FundData | null>(null);

  // 获取基金列表
  const fetchFunds = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/funds');
      const data = await response.json();
      setFunds(data);
    } catch (error) {
      message.error('获取基金列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  // 处理创建/编辑基金
  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
      };

      if (editingFund) {
        await fetch('/api/admin/funds/' + editingFund.id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        message.success('基金更新成功');
      } else {
        await fetch('/api/admin/funds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        message.success('基金创建成功');
      }
      setVisible(false);
      form.resetFields();
      fetchFunds();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 处理删除基金
  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/admin/funds/' + id, {
        method: 'DELETE',
      });
      message.success('基金删除成功');
      fetchFunds();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '基金名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '基金代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '基金类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '最新净值',
      dataIndex: 'nav',
      key: 'nav',
      render: (nav: number) => nav.toFixed(4),
    },
    {
      title: '基金规模(万元)',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => size.toLocaleString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '运作中' : '已终止'}
        </Tag>
      ),
    },
    {
      title: '成立日期',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: '基金经理',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: FundData) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingFund(record);
              form.setFieldsValue({
                ...record,
                startDate: moment(record.startDate),
              });
              setVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该基金吗？"
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
            setEditingFund(null);
            form.resetFields();
            setVisible(true);
          }}
        >
          创建基金
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={funds}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingFund ? '编辑基金' : '创建基金'}
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
            name="name"
            label="基金名称"
            rules={[{ required: true, message: '请输入基金名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="基金代码"
            rules={[{ required: true, message: '请输入基金代码' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="基金类型"
            rules={[{ required: true, message: '请输入基金类型' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nav"
            label="初始净值"
            rules={[{ required: true, message: '请输入初始净值' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={4}
            />
          </Form.Item>
          <Form.Item
            name="size"
            label="基金规模(万元)"
            rules={[{ required: true, message: '请输入基金规模' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={2}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value="active">运作中</Select.Option>
              <Select.Option value="inactive">已终止</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="startDate"
            label="成立日期"
            rules={[{ required: true, message: '请选择成立日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="manager"
            label="基金经理"
            rules={[{ required: true, message: '请输入基金经理姓名' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FundManagement;