import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  message, 
  Card,
  Row,
  Col,
  Typography,
  Tag
} from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { adminApi } from '../../services/adminApi';

const { Title } = Typography;

const FundManagement: React.FC = () => {
  const [funds, setFunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchForm] = Form.useForm();
  const [adjustForm] = Form.useForm();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    fetchFunds();
  }, [pagination.current]);

  const fetchFunds = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getFunds({
        page: pagination.current,
        limit: pagination.pageSize
      });
      
      setFunds(res.data.funds || []);
      setPagination({
        ...pagination,
        total: res.data.pagination?.total || 0
      });
    } catch (error) {
      message.error('获取资金列表失败');
      console.error('获取资金列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values: any) => {
    try {
      setLoading(true);
      // 这里可以添加搜索逻辑
      const res = await adminApi.getFunds({
        page: 1,
        limit: pagination.pageSize,
        ...values
      });
      
      setFunds(res.data.funds || []);
      setPagination({
        ...pagination,
        current: 1,
        total: res.data.pagination?.total || 0
      });
    } catch (error) {
      message.error('搜索资金失败');
      console.error('搜索资金失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustFunds = (user: any) => {
    setSelectedUser(user);
    adjustForm.setFieldsValue({
      userId: user.userId,
      username: user.username
    });
    setModalVisible(true);
  };

  const handleAdjustSubmit = async () => {
    try {
      const values = await adjustForm.validateFields();
      
      await adminApi.adjustFunds(
        values.userId,
        values.amount,
        values.reason
      );
      
      message.success('资金调整成功');
      setModalVisible(false);
      adjustForm.resetFields();
      fetchFunds();
    } catch (error) {
      message.error('资金调整失败');
      console.error('资金调整失败:', error);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    adjustForm.resetFields();
  };

  const handleTableChange = (page: number, pageSize?: number) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize || pagination.pageSize
    });
  };

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId'
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '账户余额',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => `$${balance.toFixed(2)}`
    },
    {
      title: '冻结资金',
      dataIndex: 'frozen',
      key: 'frozen',
      render: (frozen: number) => `$${frozen.toFixed(2)}`
    },
    {
      title: '可用余额',
      key: 'available',
      render: (_: any, record: any) => {
        const available = record.balance - record.frozen;
        return `$${available.toFixed(2)}`;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          onClick={() => handleAdjustFunds(record)}
        >
          调整资金
        </Button>
      )
    }
  ];

  return (
    <div className="fund-management-container">
      <Title level={2} style={{ marginBottom: 24 }}>资金管理</Title>

      <Card style={{ marginBottom: 24 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="userId" label="用户ID">
            <Input placeholder="请输入用户ID" />
          </Form.Item>
          
          <Form.Item name="username" label="用户名">
            <Input placeholder="请输入用户名" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={funds}
          loading={loading}
          rowKey="userId"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handleTableChange
          }}
        />
      </Card>

      <Modal
        title="调整用户资金"
        open={modalVisible}
        onOk={handleAdjustSubmit}
        onCancel={handleModalCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form form={adjustForm} layout="vertical">
          <Form.Item
            name="userId"
            label="用户ID"
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item
            name="username"
            label="用户名"
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item
            name="amount"
            label="调整金额"
            rules={[{ required: true, message: '请输入调整金额' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="正数为增加，负数为减少"
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
            />
          </Form.Item>
          
          <Form.Item
            name="reason"
            label="调整原因"
            rules={[{ required: true, message: '请输入调整原因' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入调整原因" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FundManagement;