/**
 * 用户行为审计模块
 * 记录和分析用户行为
 */

class UserAudit {
  constructor() {
    // 存储用户行为日志
    this.auditLogs = [];
  }

  /**
   * 记录用户行为
   * @param {string} userId - 用户ID
   * @param {string} action - 操作类型
   * @param {Object} details - 操作详情
   * @param {string} ip - IP地址
   * @param {string} userAgent - 用户代理
   */
  logUserAction(userId, action, details = {}, ip = '', userAgent = '') {
    const logEntry = {
      id: this._generateLogId(),
      userId,
      action,
      details,
      ip,
      userAgent,
      timestamp: new Date()
    };
    
    this.auditLogs.push(logEntry);
    
    // 限制日志数量，只保留最近的10000条记录
    if (this.auditLogs.length > 10000) {
      this.auditLogs = this.auditLogs.slice(-10000);
    }
    
    // 同时输出到控制台（实际项目中应该写入专门的日志文件或数据库）
    console.log(`[审计日志] ${userId} 执行了 ${action} 操作`, details);
  }

  /**
   * 获取用户行为日志
   * @param {string} userId - 用户ID
   * @param {Object} filters - 过滤条件
   * @param {number} limit - 限制返回数量
   * @returns {Array} 用户行为日志
   */
  getUserAuditLogs(userId, filters = {}, limit = 100) {
    let logs = this.auditLogs.filter(log => log.userId === userId);
    
    // 应用过滤条件
    if (filters.action) {
      logs = logs.filter(log => log.action === filters.action);
    }
    
    if (filters.startDate) {
      logs = logs.filter(log => log.timestamp >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      logs = logs.filter(log => log.timestamp <= new Date(filters.endDate));
    }
    
    // 按时间倒序排列
    logs.sort((a, b) => b.timestamp - a.timestamp);
    
    // 限制返回数量
    return logs.slice(0, limit);
  }

  /**
   * 获取所有用户的行为统计
   * @param {Object} filters - 过滤条件
   * @returns {Object} 用户行为统计
   */
  getUserActivityStats(filters = {}) {
    let logs = [...this.auditLogs];
    
    // 应用过滤条件
    if (filters.startDate) {
      logs = logs.filter(log => log.timestamp >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      logs = logs.filter(log => log.timestamp <= new Date(filters.endDate));
    }
    
    // 统计各用户的行为次数
    const userStats = {};
    logs.forEach(log => {
      if (!userStats[log.userId]) {
        userStats[log.userId] = {
          userId: log.userId,
          totalActions: 0,
          actions: {}
        };
      }
      
      userStats[log.userId].totalActions++;
      
      if (!userStats[log.userId].actions[log.action]) {
        userStats[log.userId].actions[log.action] = 0;
      }
      userStats[log.userId].actions[log.action]++;
    });
    
    return Object.values(userStats);
  }

  /**
   * 获取特定操作的统计
   * @param {string} action - 操作类型
   * @param {Object} filters - 过滤条件
   * @returns {Object} 操作统计
   */
  getActionStats(action, filters = {}) {
    let logs = this.auditLogs.filter(log => log.action === action);
    
    // 应用过滤条件
    if (filters.startDate) {
      logs = logs.filter(log => log.timestamp >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      logs = logs.filter(log => log.timestamp <= new Date(filters.endDate));
    }
    
    // 按日期统计
    const dailyStats = {};
    logs.forEach(log => {
      const date = log.timestamp.toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = 0;
      }
      dailyStats[date]++;
    });
    
    return {
      action: action,
      total: logs.length,
      dailyStats: dailyStats
    };
  }

  /**
   * 检测异常行为
   * @param {string} userId - 用户ID
   * @param {Object} thresholds - 阈值设置
   * @returns {Array} 异常行为列表
   */
  detectAnomalousBehavior(userId, thresholds = {}) {
    const defaultThresholds = {
      maxActionsPerHour: 100,
      maxLoginAttempts: 5,
      suspiciousActions: ['failed_login', 'unauthorized_access']
    };
    
    const config = { ...defaultThresholds, ...thresholds };
    const anomalies = [];
    
    // 获取用户最近一小时的操作
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentActions = this.auditLogs.filter(log => 
      log.userId === userId && log.timestamp >= oneHourAgo
    );
    
    // 检查操作频率是否异常
    if (recentActions.length > config.maxActionsPerHour) {
      anomalies.push({
        type: 'high_action_frequency',
        message: `用户在一小时内执行了${recentActions.length}次操作，超过阈值${config.maxActionsPerHour}`,
        timestamp: new Date()
      });
    }
    
    // 检查可疑操作
    const suspiciousLogs = recentActions.filter(log => 
      config.suspiciousActions.includes(log.action)
    );
    
    if (suspiciousLogs.length > 0) {
      anomalies.push({
        type: 'suspicious_actions',
        message: `用户执行了${suspiciousLogs.length}次可疑操作`,
        details: suspiciousLogs.map(log => log.action),
        timestamp: new Date()
      });
    }
    
    return anomalies;
  }

  /**
   * 生成审计报告
   * @param {Object} filters - 过滤条件
   * @returns {Object} 审计报告
   */
  generateAuditReport(filters = {}) {
    const report = {
      generatedAt: new Date(),
      period: {
        startDate: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: filters.endDate || new Date()
      },
      summary: {
        totalLogs: 0,
        uniqueUsers: 0,
        actions: {}
      },
      userStats: [],
      anomalies: []
    };
    
    // 获取过滤后的日志
    let logs = [...this.auditLogs];
    if (filters.startDate) {
      logs = logs.filter(log => log.timestamp >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      logs = logs.filter(log => log.timestamp <= new Date(filters.endDate));
    }
    
    report.summary.totalLogs = logs.length;
    
    // 统计唯一用户数
    const uniqueUsers = new Set(logs.map(log => log.userId));
    report.summary.uniqueUsers = uniqueUsers.size;
    
    // 统计各操作类型数量
    logs.forEach(log => {
      if (!report.summary.actions[log.action]) {
        report.summary.actions[log.action] = 0;
      }
      report.summary.actions[log.action]++;
    });
    
    // 用户统计
    report.userStats = this.getUserActivityStats(filters);
    
    // 异常行为检测（针对所有用户）
    uniqueUsers.forEach(userId => {
      const userAnomalies = this.detectAnomalousBehavior(userId);
      if (userAnomalies.length > 0) {
        report.anomalies.push({
          userId: userId,
          anomalies: userAnomalies
        });
      }
    });
    
    return report;
  }

  /**
   * 生成日志ID
   * @returns {string} 日志ID
   */
  _generateLogId() {
    return 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = UserAudit;