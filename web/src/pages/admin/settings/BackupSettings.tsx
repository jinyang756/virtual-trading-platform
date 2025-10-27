import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Form, Input, Select, Tag, Switch, TimePicker, InputNumber } from 'antd';
import { DownloadOutlined, CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

interface BackupData {
  id: string;
  name: string;
  type: 'auto' | 'manual';
  size: number;
  timestamp: string;
  status: 'completed' | 'failed';
}

interface BackupSettingsData {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  retention: number;
  storage: 'local' | 's3' | 'gcs';
}

const BackupSettings: React.FC = () => {
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [loading, setLoading] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/backups');
      const data = await response.json();
      setBackups(data);
    } catch (error) {
      message.error('获取备份列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    try {
      await fetch('/api/admin/backups', {
        method: 'POST',
      });
      message.success('备份创建成功');
      fetchBackups();
    } catch (error) {
      message.error('备份创建失败');
    }
  };

  const handleDeleteBackup = async (id: string) => {
    try {
      await fetch('/api/admin/backups/' + id, {
        method: 'DELETE',
      });
      message.success('备份删除成功');
      fetchBackups();
    } catch (error) {
      message.error('备份删除失败');
    }
  };

  const handleRestoreBackup = async (id: string) => {
    try {
      await fetch('/api/admin/backups/' + id + '/restore', {
        method: 'POST',
      });
      message.success('备份恢复成功');
    } catch (error) {
      message.error('备份恢复失败');
    }
  };

  const handleDownloadBackup = async (id: string) => {
    try {
      const response = await fetch('/api/admin/backups/' + id + '/download');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'backup-' + moment().format('YYYY-MM-DD') + '.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      message.error('下载失败');
    }
  };

  const handleSaveSettings = async (values: BackupSettingsData) => {
    try {
      await fetch('/api/admin/backups/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      message.success('备份设置已更新');
      setSettingsVisible(false);
    } catch (error) {
      message.error('更新失败');
    }
  };

  const columns = [
    {
      title: '备份名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '备份类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'auto' ? 'green' : 'blue'}>
          {type === 'auto' ? '自动' : '手动'}
        </Tag>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => {
        const units = ['B', 'KB', 'MB', 'GB'];
        let i = 0;
        let convertedSize = size;
        while (convertedSize >= 1024 && i < units.length - 1) {
          convertedSize /= 1024;
          i++;
        }
        return convertedSize.toFixed(2) + ' ' + units[i];
      },
    },
    {
      title: '创建时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : 'red'}>
          {status === 'completed' ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: BackupData) => (
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadBackup(record.id)}
          >
            下载
          </Button>
          <Button
            onClick={() => handleRestoreBackup(record.id)}
          >
            恢复
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteBackup(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <Space>
          <Button
            type="primary"
            icon={<CloudUploadOutlined />}
            onClick={handleCreateBackup}
          >
            创建备份
          </Button>
          <Button onClick={() => setSettingsVisible(true)}>
            备份设置
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={backups}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title="备份设置"
        open={settingsVisible}
        onOk={() => form.submit()}
        onCancel={() => setSettingsVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveSettings}
        >
          <Form.Item
            name="enabled"
            label="启用自动备份"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="frequency"
            label="备份频率"
          >
            <Select>
              <Select.Option value="daily">每日</Select.Option>
              <Select.Option value="weekly">每周</Select.Option>
              <Select.Option value="monthly">每月</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="time"
            label="备份时间"
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item
            name="retention"
            label="保留时间(天)"
          >
            <InputNumber min={1} max={365} />
          </Form.Item>

          <Form.Item
            name="storage"
            label="存储位置"
          >
            <Select>
              <Select.Option value="local">本地存储</Select.Option>
              <Select.Option value="s3">Amazon S3</Select.Option>
              <Select.Option value="gcs">Google Cloud Storage</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BackupSettings;