// 性能数据服务
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3002';

interface PerformanceMetric {
  [key: string]: number;
}

interface PerformanceData {
  timestamp: string;
  userId: string;
  userAgent: string;
  metrics: PerformanceMetric;
}

interface PerformanceReport {
  totalMetrics: number;
  averageMetrics: PerformanceMetric;
  trends: Record<string, {
    recent: number;
    previous: number;
    change: number;
    changePercent: number;
  }>;
  dateRange: {
    start: string;
    end: string;
  };
}

class PerformanceService {
  /**
   * 发送性能数据到后端
   * @param metrics 性能指标数据
   */
  async sendMetrics(metrics: any): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/api/performance/metrics/performance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metrics),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('性能数据发送成功:', result);
    } catch (error) {
      console.error('发送性能数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取性能报告
   * @param date 日期参数（可选）
   */
  async getPerformanceReport(date?: string): Promise<PerformanceReport> {
    try {
      const url = date 
        ? `${API_BASE}/api/performance/metrics/performance/report?date=${date}`
        : `${API_BASE}/api/performance/metrics/performance/report`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('获取性能报告失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有性能数据
   */
  async getAllPerformanceData(): Promise<PerformanceData[]> {
    try {
      // 这里应该调用后端API获取所有性能数据
      // 暂时返回空数组
      return [];
    } catch (error) {
      console.error('获取所有性能数据失败:', error);
      throw error;
    }
  }
}

export const performanceService = new PerformanceService();