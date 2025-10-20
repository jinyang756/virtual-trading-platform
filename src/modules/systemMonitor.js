/**
 * 系统监控和告警模块
 * 监控系统性能并发送告警
 */

class SystemMonitor {
  constructor() {
    this.metrics = {
      cpu: [],
      memory: [],
      disk: [],
      network: [],
      responseTime: [],
      errorRate: []
    };
    
    this.alerts = [];
    this.alertRules = [];
  }

  /**
   * 记录系统指标
   * @param {string} metricType - 指标类型
   * @param {number} value - 指标值
   * @param {Object} metadata - 元数据
   */
  recordMetric(metricType, value, metadata = {}) {
    if (!this.metrics[metricType]) {
      this.metrics[metricType] = [];
    }
    
    const metric = {
      value: value,
      timestamp: new Date(),
      ...metadata
    };
    
    this.metrics[metricType].push(metric);
    
    // 限制每个指标只保留最近1000个数据点
    if (this.metrics[metricType].length > 1000) {
      this.metrics[metricType] = this.metrics[metricType].slice(-1000);
    }
    
    // 检查是否触发告警
    this._checkAlerts(metricType, value, metadata);
  }

  /**
   * 添加告警规则
   * @param {string} metricType - 指标类型
   * @param {string} condition - 条件 (above/below/between)
   * @param {number} threshold - 阈值
   * @param {number} [threshold2] - 第二阈值（用于between条件）
   * @param {string} message - 告警消息
   * @param {string} severity - 告警严重程度 (low/medium/high/critical)
   */
  addAlertRule(metricType, condition, threshold, threshold2, message, severity = 'medium') {
    const rule = {
      id: this._generateRuleId(),
      metricType,
      condition,
      threshold,
      threshold2: condition === 'between' ? threshold2 : undefined,
      message,
      severity,
      enabled: true,
      createdAt: new Date()
    };
    
    this.alertRules.push(rule);
    return rule.id;
  }

  /**
   * 检查是否触发告警
   * @param {string} metricType - 指标类型
   * @param {number} value - 指标值
   * @param {Object} metadata - 元数据
   */
  _checkAlerts(metricType, value, metadata) {
    const triggeredRules = this.alertRules.filter(rule => {
      if (!rule.enabled || rule.metricType !== metricType) {
        return false;
      }
      
      switch (rule.condition) {
        case 'above':
          return value > rule.threshold;
        case 'below':
          return value < rule.threshold;
        case 'between':
          return value >= rule.threshold && value <= rule.threshold2;
        default:
          return false;
      }
    });
    
    // 触发告警
    triggeredRules.forEach(rule => {
      this._triggerAlert(rule, value, metadata);
    });
  }

  /**
   * 触发告警
   * @param {Object} rule - 告警规则
   * @param {number} value - 当前值
   * @param {Object} metadata - 元数据
   */
  _triggerAlert(rule, value, metadata) {
    const alert = {
      id: this._generateAlertId(),
      ruleId: rule.id,
      metricType: rule.metricType,
      currentValue: value,
      threshold: rule.threshold,
      message: rule.message.replace('{value}', value).replace('{threshold}', rule.threshold),
      severity: rule.severity,
      timestamp: new Date(),
      metadata: metadata
    };
    
    this.alerts.push(alert);
    
    // 限制告警数量
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000);
    }
    
    // 发送告警通知
    this._sendAlertNotification(alert);
  }

  /**
   * 发送告警通知
   * @param {Object} alert - 告警对象
   */
  _sendAlertNotification(alert) {
    // 根据严重程度选择通知方式
    switch (alert.severity) {
      case 'critical':
        console.error(`[严重告警] ${alert.message}`);
        // 实际项目中这里应该发送短信、邮件等紧急通知
        break;
      case 'high':
        console.warn(`[高优先级告警] ${alert.message}`);
        // 实际项目中这里应该发送邮件等通知
        break;
      case 'medium':
        console.log(`[中优先级告警] ${alert.message}`);
        // 实际项目中这里应该记录到告警系统
        break;
      case 'low':
        console.log(`[低优先级告警] ${alert.message}`);
        // 实际项目中这里可以记录到日志
        break;
      default:
        console.log(`[告警] ${alert.message}`);
    }
  }

  /**
   * 获取系统指标统计
   * @param {string} metricType - 指标类型
   * @param {number} minutes - 时间范围（分钟）
   * @returns {Object} 统计信息
   */
  getMetricStats(metricType, minutes = 60) {
    if (!this.metrics[metricType] || this.metrics[metricType].length === 0) {
      return {
        count: 0,
        avg: 0,
        min: 0,
        max: 0,
        latest: 0
      };
    }
    
    const timeThreshold = new Date(Date.now() - minutes * 60 * 1000);
    const recentMetrics = this.metrics[metricType].filter(metric => 
      metric.timestamp >= timeThreshold
    );
    
    if (recentMetrics.length === 0) {
      return {
        count: 0,
        avg: 0,
        min: 0,
        max: 0,
        latest: 0
      };
    }
    
    const values = recentMetrics.map(metric => metric.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const latest = values[values.length - 1];
    
    return {
      count: recentMetrics.length,
      avg: parseFloat(avg.toFixed(2)),
      min: parseFloat(min.toFixed(2)),
      max: parseFloat(max.toFixed(2)),
      latest: parseFloat(latest.toFixed(2))
    };
  }

  /**
   * 获取所有指标的当前状态
   * @returns {Object} 所有指标的状态
   */
  getAllMetricsStatus() {
    const status = {};
    
    for (const metricType in this.metrics) {
      status[metricType] = this.getMetricStats(metricType, 5); // 最近5分钟
    }
    
    return status;
  }

  /**
   * 获取未处理的告警
   * @param {string} severity - 告警严重程度
   * @returns {Array} 告警列表
   */
  getUnresolvedAlerts(severity = null) {
    let unresolved = this.alerts.filter(alert => !alert.resolved);
    
    if (severity) {
      unresolved = unresolved.filter(alert => alert.severity === severity);
    }
    
    return unresolved.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * 解决告警
   * @param {string} alertId - 告警ID
   * @returns {boolean} 是否成功
   */
  resolveAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date();
      return true;
    }
    return false;
  }

  /**
   * 获取系统健康状态
   * @returns {Object} 健康状态
   */
  getSystemHealth() {
    const health = {
      status: 'healthy', // healthy, warning, critical
      metrics: this.getAllMetricsStatus(),
      unresolvedAlerts: this.getUnresolvedAlerts().length,
      criticalAlerts: this.getUnresolvedAlerts('critical').length
    };
    
    // 根据未解决的严重告警数量确定系统状态
    if (health.criticalAlerts > 0) {
      health.status = 'critical';
    } else if (health.unresolvedAlerts > 5) {
      health.status = 'warning';
    }
    
    return health;
  }

  /**
   * 生成系统监控报告
   * @param {number} hours - 时间范围（小时）
   * @returns {Object} 监控报告
   */
  generateMonitorReport(hours = 24) {
    const report = {
      generatedAt: new Date(),
      period: {
        start: new Date(Date.now() - hours * 60 * 60 * 1000),
        end: new Date()
      },
      systemHealth: this.getSystemHealth(),
      metricsSummary: {},
      topAlerts: this.getUnresolvedAlerts().slice(0, 10)
    };
    
    // 汇总各指标统计
    for (const metricType in this.metrics) {
      report.metricsSummary[metricType] = this.getMetricStats(metricType, hours * 60);
    }
    
    return report;
  }

  /**
   * 生成告警规则ID
   * @returns {string} 规则ID
   */
  _generateRuleId() {
    return 'rule_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * 生成告警ID
   * @returns {string} 告警ID
   */
  _generateAlertId() {
    return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = SystemMonitor;