/**
 * 前端性能监控脚本
 * 收集页面加载性能指标并发送到后端
 */

class FrontendPerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    // 等待页面加载完成后再收集性能数据
    if (document.readyState === 'complete') {
      this.collectAndSendPerformanceData();
    } else {
      window.addEventListener('load', () => {
        this.collectAndSendPerformanceData();
      });
    }
  }

  /**
   * 收集性能数据并发送到后端
   */
  collectAndSendPerformanceData() {
    // 使用Performance API收集性能数据
    const perfData = this.collectPerformanceData();
    
    if (perfData) {
      this.sendPerformanceData(perfData);
    }
  }

  /**
   * 收集页面性能数据
   */
  collectPerformanceData() {
    // 检查浏览器是否支持Performance API
    if (!window.performance || !window.performance.getEntriesByType) {
      console.warn('Performance API not supported');
      return null;
    }

    // 获取导航性能数据
    const navigationEntries = window.performance.getEntriesByType('navigation');
    if (!navigationEntries || navigationEntries.length === 0) {
      return null;
    }

    const navigation = navigationEntries[0];
    
    // 获取核心Web Vitals指标
    const paintEntries = window.performance.getEntriesByType('paint');
    let fcp = null;
    let lcp = null;
    
    paintEntries.forEach(entry => {
      if (entry.name === 'first-contentful-paint') {
        fcp = entry.startTime;
      }
    });

    // 收集性能数据
    const perfData = {
      // 页面基本信息
      url: window.location.href,
      userAgent: navigator.userAgent,
      
      // 导航性能指标
      navigationStart: navigation.startTime,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
      loadEventEnd: navigation.loadEventEnd - navigation.startTime,
      firstPaint: navigation.firstPaint ? navigation.firstPaint - navigation.startTime : null,
      firstContentfulPaint: fcp,
      
      // 资源加载时间
      redirectTime: navigation.redirectEnd - navigation.redirectStart,
      dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcpTime: navigation.connectEnd - navigation.connectStart,
      requestTime: navigation.responseStart - navigation.requestStart,
      responseTime: navigation.responseEnd - navigation.responseStart,
      
      // 其他指标
      domInteractive: navigation.domInteractive - navigation.startTime,
      domComplete: navigation.domComplete - navigation.startTime,
      
      // 时间戳
      timestamp: new Date().toISOString()
    };

    return perfData;
  }

  /**
   * 发送性能数据到后端
   */
  sendPerformanceData(perfData) {
    // 发送到后端API
    fetch('/api/performance/frontend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(perfData)
    }).catch(error => {
      console.error('Failed to send performance data:', error);
    });
  }

  /**
   * 监控特定用户交互性能
   */
  monitorUserInteraction(elementId, actionName) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const start = performance.now();
    
    element.addEventListener('click', () => {
      const end = performance.now();
      const duration = end - start;
      
      // 发送用户交互性能数据
      this.sendUserInteractionData({
        action: actionName,
        elementId: elementId,
        duration: duration,
        timestamp: new Date().toISOString()
      });
    });
  }

  /**
   * 发送用户交互性能数据
   */
  sendUserInteractionData(interactionData) {
    fetch('/api/performance/user-interaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(interactionData)
    }).catch(error => {
      console.error('Failed to send user interaction data:', error);
    });
  }
}

// 初始化性能监控
document.addEventListener('DOMContentLoaded', () => {
  window.frontendPerformanceMonitor = new FrontendPerformanceMonitor();
});

// 导出类以供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FrontendPerformanceMonitor;
}