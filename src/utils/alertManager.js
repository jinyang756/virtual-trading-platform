const nodemailer = require('nodemailer');
const winston = require('winston');
const alertConfig = require('../../config/alertConfig');

// 创建告警日志记录器
const alertLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/alerts.log' })
  ]
});

class AlertManager {
  constructor() {
    this.alertHistory = new Map(); // 存储告警历史，用于抑制重复告警
    this.transporter = null;
    
    // 初始化邮件传输器
    if (alertConfig.notification.email.enabled) {
      this.transporter = nodemailer.createTransporter(alertConfig.notification.email.smtp);
    }
  }

  /**
   * 检查是否应该发送告警（基于抑制规则）
   */
  shouldSendAlert(alertKey) {
    const now = Date.now();
    const alertInfo = this.alertHistory.get(alertKey);
    
    // 如果没有告警历史，应该发送
    if (!alertInfo) {
      this.alertHistory.set(alertKey, {
        count: 1,
        lastSent: now
      });
      return true;
    }
    
    // 检查是否超过最大告警次数
    if (alertInfo.count >= alertConfig.suppression.maxAlerts) {
      return false;
    }
    
    // 检查是否在抑制间隔内
    if (now - alertInfo.lastSent < alertConfig.suppression.interval) {
      return false;
    }
    
    // 更新告警历史
    alertInfo.count++;
    alertInfo.lastSent = now;
    this.alertHistory.set(alertKey, alertInfo);
    
    return true;
  }

  /**
   * 发送告警
   */
  async sendAlert(alertData) {
    const {
      type,
      severity,
      title,
      message,
      details
    } = alertData;
    
    // 生成告警键值，用于抑制重复告警
    const alertKey = `${type}:${severity}:${title}`;
    
    // 检查是否应该发送告警
    if (!this.shouldSendAlert(alertKey)) {
      console.log(`Alert suppressed: ${title}`);
      return;
    }
    
    // 记录告警日志
    alertLogger.info('Alert triggered', {
      type,
      severity,
      title,
      message,
      details,
      timestamp: new Date().toISOString()
    });
    
    console.log(`ALERT [${severity.toUpperCase()}]: ${title} - ${message}`);
    
    // 发送邮件通知
    if (alertConfig.notification.email.enabled) {
      await this.sendEmailAlert(alertData);
    }
    
    // 发送短信通知
    if (alertConfig.notification.sms.enabled) {
      await this.sendSmsAlert(alertData);
    }
    
    // 发送Webhook通知
    if (alertConfig.notification.webhook.enabled) {
      await this.sendWebhookAlert(alertData);
    }
  }

  /**
   * 发送邮件告警
   */
  async sendEmailAlert(alertData) {
    const {
      type,
      severity,
      title,
      message,
      details
    } = alertData;
    
    try {
      const mailOptions = {
        from: alertConfig.notification.email.from,
        to: alertConfig.notification.email.to,
        subject: `[${severity.toUpperCase()}] ${title}`,
        html: `
          <h2>${title}</h2>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Severity:</strong> ${severity}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          ${details ? `<p><strong>Details:</strong></p><pre>${JSON.stringify(details, null, 2)}</pre>` : ''}
        `
      };
      
      await this.transporter.sendMail(mailOptions);
      console.log('Email alert sent successfully');
    } catch (error) {
      console.error('Failed to send email alert:', error);
      alertLogger.error('Failed to send email alert', {
        error: error.message,
        alertData
      });
    }
  }

  /**
   * 发送短信告警
   */
  async sendSmsAlert(alertData) {
    // 短信告警实现
    console.log('SMS alert would be sent:', alertData);
    // 实际实现需要根据选择的短信服务提供商进行开发
  }

  /**
   * 发送Webhook告警
   */
  async sendWebhookAlert(alertData) {
    try {
      const response = await fetch(alertConfig.notification.webhook.url, {
        method: alertConfig.notification.webhook.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: `*[${alertData.severity.toUpperCase()}] ${alertData.title}*\n${alertData.message}\nTime: ${new Date().toISOString()}`
        })
      });
      
      if (!response.ok) {
        throw new Error(`Webhook request failed with status ${response.status}`);
      }
      
      console.log('Webhook alert sent successfully');
    } catch (error) {
      console.error('Failed to send webhook alert:', error);
      alertLogger.error('Failed to send webhook alert', {
        error: error.message,
        alertData
      });
    }
  }

  /**
   * 检查API响应时间并触发告警
   */
  async checkApiResponseTime(duration, endpoint) {
    if (duration > alertConfig.apiResponseTime.critical) {
      await this.sendAlert({
        type: 'api_response_time',
        severity: 'critical',
        title: 'API响应时间严重延迟',
        message: `API端点 ${endpoint} 响应时间 ${duration}ms 超过严重阈值 ${alertConfig.apiResponseTime.critical}ms`,
        details: {
          endpoint,
          duration,
          threshold: alertConfig.apiResponseTime.critical
        }
      });
    } else if (duration > alertConfig.apiResponseTime.warning) {
      await this.sendAlert({
        type: 'api_response_time',
        severity: 'warning',
        title: 'API响应时间警告',
        message: `API端点 ${endpoint} 响应时间 ${duration}ms 超过警告阈值 ${alertConfig.apiResponseTime.warning}ms`,
        details: {
          endpoint,
          duration,
          threshold: alertConfig.apiResponseTime.warning
        }
      });
    }
  }

  /**
   * 检查数据库查询时间并触发告警
   */
  async checkDbQueryTime(duration, query) {
    if (duration > alertConfig.dbQueryTime.critical) {
      await this.sendAlert({
        type: 'db_query_time',
        severity: 'critical',
        title: '数据库查询严重延迟',
        message: `数据库查询 "${query}" 执行时间 ${duration}ms 超过严重阈值 ${alertConfig.dbQueryTime.critical}ms`,
        details: {
          query,
          duration,
          threshold: alertConfig.dbQueryTime.critical
        }
      });
    } else if (duration > alertConfig.dbQueryTime.warning) {
      await this.sendAlert({
        type: 'db_query_time',
        severity: 'warning',
        title: '数据库查询时间警告',
        message: `数据库查询 "${query}" 执行时间 ${duration}ms 超过警告阈值 ${alertConfig.dbQueryTime.warning}ms`,
        details: {
          query,
          duration,
          threshold: alertConfig.dbQueryTime.warning
        }
      });
    }
  }

  /**
   * 检查前端页面加载时间并触发告警
   */
  async checkPageLoadTime(duration, url) {
    if (duration > alertConfig.pageLoadTime.critical) {
      await this.sendAlert({
        type: 'page_load_time',
        severity: 'critical',
        title: '页面加载严重延迟',
        message: `页面 ${url} 加载时间 ${duration}ms 超过严重阈值 ${alertConfig.pageLoadTime.critical}ms`,
        details: {
          url,
          duration,
          threshold: alertConfig.pageLoadTime.critical
        }
      });
    } else if (duration > alertConfig.pageLoadTime.warning) {
      await this.sendAlert({
        type: 'page_load_time',
        severity: 'warning',
        title: '页面加载时间警告',
        message: `页面 ${url} 加载时间 ${duration}ms 超过警告阈值 ${alertConfig.pageLoadTime.warning}ms`,
        details: {
          url,
          duration,
          threshold: alertConfig.pageLoadTime.warning
        }
      });
    }
  }

  /**
   * 检查错误率并触发告警
   */
  async checkErrorRate(errorRate, context) {
    if (errorRate > alertConfig.errorRate.critical) {
      await this.sendAlert({
        type: 'error_rate',
        severity: 'critical',
        title: '错误率严重超标',
        message: `${context} 错误率 ${errorRate}% 超过严重阈值 ${alertConfig.errorRate.critical}%`,
        details: {
          context,
          errorRate,
          threshold: alertConfig.errorRate.critical
        }
      });
    } else if (errorRate > alertConfig.errorRate.warning) {
      await this.sendAlert({
        type: 'error_rate',
        severity: 'warning',
        title: '错误率警告',
        message: `${context} 错误率 ${errorRate}% 超过警告阈值 ${alertConfig.errorRate.warning}%`,
        details: {
          context,
          errorRate,
          threshold: alertConfig.errorRate.warning
        }
      });
    }
  }
}

// 创建单例实例
const alertManager = new AlertManager();

module.exports = alertManager;