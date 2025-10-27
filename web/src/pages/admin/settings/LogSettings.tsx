import React, { useState, useEffect } from 'react';
import { Table, Button, DatePicker, Space, Select, message, Tag } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;

import { LogEntry, LogLevel, LOG_LEVEL_COLORS } from '../../../types/logs';

export const LogSettings: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>();
  const [logLevel, setLogLevel] = useState<string>('all');
  const [category, setCategory] = useState<string>('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let url = '/api/admin/logs';
      const params = new URLSearchParams();
      
      if (dateRange) {
        params.append('startDate', dateRange[0].format('YYYY-MM-DD'));
        params.append('endDate', dateRange[1].format('YYYY-MM-DD'));
      }
      if (logLevel !== 'all') {
        params.append('level', logLevel);
      }
      if (category !== 'all') {
        params.append('category', category);
      }

      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      message.error('获取日志失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [dateRange, logLevel, category]);

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/logs/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateRange, logLevel, category }),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs-${moment().format('YYYY-MM-DD')}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      message.error('导出失败');
    }
  };

  const handleClearLogs = async () => {
    try {
      await fetch('/api/admin/logs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateRange, logLevel, category }),
      });
      message.success('日志清理成功');
      fetchLogs();
    } catch (error) {
      message.error('清理失败');
    }
  };

  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: LogLevel) => {
        return <Tag color={LOG_LEVEL_COLORS[level]}>{level.toUpperCase()}</Tag>;
      },
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: '详情',
      dataIndex: 'details',
      key: 'details',
      render: (text: string) => (
        <Button type="link" onClick={() => message.info(text)}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <Space>
          <RangePicker
            onChange={(dates) => setDateRange(dates as [moment.Moment, moment.Moment])}
          />
          <Select
            value={logLevel}
            onChange={setLogLevel}
            style={{ width: 120 }}
          >
            <Select.Option value="all">所有级别</Select.Option>
            <Select.Option value="info">信息</Select.Option>
            <Select.Option value="warning">警告</Select.Option>
            <Select.Option value="error">错误</Select.Option>
          </Select>
          <Select
            value={category}
            onChange={setCategory}
            style={{ width: 120 }}
          >
            <Select.Option value="all">所有分类</Select.Option>
            <Select.Option value="system">系统</Select.Option>
            <Select.Option value="user">用户</Select.Option>
            <Select.Option value="trade">交易</Select.Option>
          </Select>
        </Space>
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            导出日志
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={handleClearLogs}
          >
            清理日志
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default LogSettings;