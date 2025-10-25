export class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.isInitialized = false;
    this.init();
  }

  init() {
    // 避免重复初始化
    if (this.isInitialized) {
      return;
    }

    // 监听页面加载性能
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.collectLoadMetrics();
      });
    } else {
      // DOM已经加载完成
      this.collectLoadMetrics();
    }

    // 监听用户交互性能
    this.observeUserTiming();
    
    // 监听页面卸载事件，确保数据发送
    window.addEventListener('beforeunload', () => {
      this.sendMetrics();
    });

    this.isInitialized = true;
  }

  collectLoadMetrics() {
    // 确保performance API可用
    if (!window.performance || !window.performance.getEntriesByType) {
      console.warn('Performance API not available');
      return;
    }

    // 等待navigation数据可用
    setTimeout(() => {
      const navigationEntries = performance.getEntriesByType('navigation');
      if (!navigationEntries || navigationEntries.length === 0) {
        console.warn('No navigation entries found');
        return;
      }

      const navigation = navigationEntries[0];

      this.metrics = {
        // 基本信息
        url: window.location.href,
        userAgent: navigator.userAgent,
        
        // DNS查询时间
        dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
        
        // TCP连接时间
        tcpTime: navigation.connectEnd - navigation.connectStart,
        
        // 请求响应时间
        requestTime: navigation.responseEnd - navigation.requestStart,
        
        // DOM解析时间
        domParseTime: navigation.domContentLoadedEventEnd - navigation.domLoading,
        
        // 页面加载总时间
        totalLoadTime: navigation.loadEventEnd - navigation.navigationStart,
        
        // 首字节时间
        ttfb: navigation.responseStart - navigation.requestStart,
        
        // DOM交互就绪时间
        domInteractive: navigation.domInteractive - navigation.navigationStart
      };

      // 发送指标数据
      this.sendMetrics();
    }, 1000); // 等待1秒确保所有数据都已收集
  }

  observeUserTiming() {
    // 检查PerformanceObserver是否可用
    if (!window.PerformanceObserver) {
      console.warn('PerformanceObserver not available');
      return;
    }

    // 使用PerformanceObserver监控用户计时
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'measure') {
          // 确保metrics对象存在
          if (!this.metrics.customMetrics) {
            this.metrics.customMetrics = {};
          }
          this.metrics.customMetrics[entry.name] = entry.duration;
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['measure', 'mark'] });
    } catch (e) {
      // 降级处理，某些浏览器可能不支持entryTypes
      try {
        observer.observe({ entryTypes: ['measure'] });
        observer.observe({ entryTypes: ['mark'] });
      } catch (e2) {
        console.warn('PerformanceObserver observe failed:', e2);
      }
    }
  }

  sendMetrics() {
    // 检查是否有数据需要发送
    if (Object.keys(this.metrics).length === 0) {
      return;
    }

    // 发送性能数据到服务器
    fetch('/api/performance/metrics/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.metrics)
    }).then(response => {
      if (!response.ok) {
        console.error('Failed to send performance metrics:', response.status, response.statusText);
      }
    }).catch(error => {
      console.error('Failed to send performance metrics:', error);
    });
  }

  // 手动标记性能点
  mark(name) {
    // 检查performance.mark是否可用
    if (window.performance && window.performance.mark) {
      try {
        performance.mark(name);
      } catch (e) {
        console.warn('Performance mark failed:', e);
      }
    }
  }

  // 测量两个标记之间的时间
  measure(name, startMark, endMark) {
    // 检查performance.measure是否可用
    if (window.performance && window.performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
      } catch (e) {
        console.warn('Performance measure failed:', e);
      }
    }
  }
  
  // 记录自定义指标
  recordCustomMetric(name, value) {
    if (!this.metrics.customMetrics) {
      this.metrics.customMetrics = {};
    }
    this.metrics.customMetrics[name] = value;
  }
}

// 创建单例实例
export const performanceMonitor = new PerformanceMonitor();

// 确保在模块热替换时不会创建多个实例
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    // 清理工作
  });
}