import React, { useState, useEffect } from 'react';
import { Card, Table, Spin, Alert, DatePicker, Button } from 'antd';
import { performanceMonitor } from '../utils/performance';
import { performanceService } from '../services/performanceService';

const { RangePicker } = DatePicker;

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
}

interface PerformanceReport {
  totalMetrics: number;
  averageMetrics: Record<string, number>;
  trends: Record<string, any>;
  dateRange: {
    start: string;
    end: string;
  };
}

const PerformanceReport: React.FC = () => {
  const [reportData, setReportData] = useState<PerformanceReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  useEffect(() => {
    fetchPerformanceReport();
  }, []);

  const fetchPerformanceReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 标记性能报告获取开始
      performanceMonitor.mark('fetch-performance-report-start');
      
      // 调用后端API获取性能报告
      const report = await performanceService.getPerformanceReport();
      setReportData(report);
      
      // 标记性能报告获取完成
      performanceMonitor.mark('fetch-performance-report-end');
      performanceMonitor.measure('fetch-performance-report-time', 'fetch-performance-report-start', 'fetch-performance-report-end');
    } catch (err) {
      setError('获取性能报告失败: ' + (err as Error).message);
      console.error('获取性能报告失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const metricColumns = [
    {
      title: '指标名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '平均值',
      dataIndex: 'value',
      key: 'value',
      render: (value: number, record: PerformanceMetric) => `${value.toFixed(2)} ${record.unit}`,
    },
  ];

  const trendColumns = [
    {
      title: '指标名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '当前值',
      dataIndex: 'recent',
      key: 'recent',
      render: (value: number) => `${value.toFixed(2)} ms`,
    },
    {
      title: '之前值',
      dataIndex: 'previous',
      key: 'previous',
      render: (value: number) => `${value.toFixed(2)} ms`,
    },
    {
      title: '变化值',
      dataIndex: 'change',
      key: 'change',
      render: (value: number) => (
        <span style={{ color: value >= 0 ? 'green' : 'red' }}>
          {value >= 0 ? '+' : ''}{value.toFixed(2)} ms
        </span>
      ),
    },
    {
      title: '变化百分比',
      dataIndex: 'changePercent',
      key: 'changePercent',
      render: (value: number) => (
        <span style={{ color: value >= 0 ? 'green' : 'red' }}>
          {value >= 0 ? '+' : ''}{value.toFixed(2)}%
        </span>
      ),
    },
  ];

  const getMetricName = (key: string) => {
    const metricNames: Record<string, string> = {
      dnsTime: 'DNS查询时间',
      tcpTime: 'TCP连接时间',
      requestTime: '请求响应时间',
      domParseTime: 'DOM解析时间',
      totalLoadTime: '页面加载总时间',
      'app-load-time': '应用加载时间',
      'trading-panel-load-time': '交易面板加载时间',
      'fetch-market-data-time': '获取市场数据时间',
      'fetch-positions-time': '获取持仓数据时间',
      'place-trade-time': '交易提交时间'
    };
    
    return metricNames[key] || key;
  };

  const getMetricUnit = (key: string) => {
    const timeMetrics = [
      'dnsTime', 'tcpTime', 'requestTime', 'domParseTime', 
      'totalLoadTime', 'app-load-time', 'trading-panel-load-time',
      'fetch-market-data-time', 'fetch-positions-time', 'place-trade-time'
    ];
    
    return timeMetrics.includes(key) ? 'ms' : '';
  };

  const formatMetricData = () => {
    if (!reportData?.averageMetrics) return [];
    
    return Object.entries(reportData.averageMetrics).map(([key, value]) => ({
      key,
      name: getMetricName(key),
      value,
      unit: getMetricUnit(key)
    }));
  };

  const formatTrendData = () => {
    if (!reportData?.trends) return [];
    
    return Object.entries(reportData.trends).map(([key, trend]) => ({
      key,
      name: getMetricName(key),
      ...trend
    }));
  };

  return (
    <div className="performance-report-container">
      <Card title="性能报告" style={{ marginBottom: 24 }}>
        {error && (
          <Alert 
            message="错误" 
            description={error} 
            type="error" 
            showIcon 
            style={{ marginBottom: 24 }} 
          />
        )}
        
        <div style={{ marginBottom: 24 }}>
          <RangePicker 
            style={{ marginRight: 16 }} 
            onChange={(dates, dateStrings) => {
              if (dates && dates.length === 2) {
                setDateRange([dateStrings[0], dateStrings[1]]);
              } else {
                setDateRange(null);
              }
            }}
          />
          <Button 
            type="primary" 
            onClick={fetchPerformanceReport}
            loading={loading}
          >
            刷新报告
          </Button>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin tip="加载中..." />
          </div>
        ) : reportData ? (
          <>
            <Card title="总体统计" size="small" style={{ marginBottom: 24 }}>
              <p>总指标数: {reportData.totalMetrics}</p>
              <p>数据时间范围: {new Date(reportData.dateRange.start).toLocaleString()} - {new Date(reportData.dateRange.end).toLocaleString()}</p>
            </Card>
            
            <Card title="性能指标" size="small" style={{ marginBottom: 24 }}>
              <Table 
                columns={metricColumns} 
                dataSource={formatMetricData()} 
                pagination={false}
              />
            </Card>
            
            <Card title="趋势分析" size="small">
              <Table 
                columns={trendColumns} 
                dataSource={formatTrendData()} 
                pagination={false}
              />
            </Card>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>暂无性能数据</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PerformanceReport;