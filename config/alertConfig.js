module.exports = {
  // API响应时间告警阈值（毫秒）
  apiResponseTime: {
    warning: 1000,    // 警告阈值
    critical: 5000    // 严重阈值
  },
  
  // 数据库查询时间告警阈值（毫秒）
  dbQueryTime: {
    warning: 500,     // 警告阈值
    critical: 2000    // 严重阈值
  },
  
  // 前端页面加载时间告警阈值（毫秒）
  pageLoadTime: {
    warning: 3000,    // 警告阈值
    critical: 10000   // 严重阈值
  },
  
  // 错误率告警阈值（百分比）
  errorRate: {
    warning: 1.0,     // 警告阈值
    critical: 5.0     // 严重阈值
  },
  
  // 慢查询数量告警阈值
  slowQueries: {
    warning: 10,      // 警告阈值
    critical: 50      // 严重阈值
  },
  
  // 告警通知方式
  notification: {
    // 邮件通知配置
    email: {
      enabled: true,
      smtp: {
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'monitoring@jucaizhongfa.com',
          pass: 'your-email-password'
        }
      },
      from: 'monitoring@jucaizhongfa.com',
      to: ['admin@jucaizhongfa.com', 'devops@jucaizhongfa.com']
    },
    
    // 短信通知配置
    sms: {
      enabled: false,
      provider: 'twilio', // 或其他短信服务提供商
      accountSid: 'your-account-sid',
      authToken: 'your-auth-token',
      from: '+1234567890',
      to: ['+8613800138000']
    },
    
    // Webhook通知配置
    webhook: {
      enabled: true,
      url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK',
      method: 'POST'
    }
  },
  
  // 告警抑制配置（避免重复告警）
  suppression: {
    // 相同告警在指定时间内只发送一次（毫秒）
    interval: 300000, // 5分钟
    // 最大告警次数
    maxAlerts: 10
  }
};