/**
 * 操作日志模块
 * 记录系统操作日志
 */

class OperationLog {
  constructor() {
    this.logs = [];
  }

  /**
   * 记录操作日志
   * @param {string} userId - 用户ID
   * @param {string} module - 模块名称
   * @param {string} action - 操作类型
   * @param {Object} data - 操作数据
   * @param {string} result - 操作结果 (success/failure)
   * @param {string} [errorMessage] - 错误信息
   */
  logOperation(userId, module, action, data = {}, result = 'success', errorMessage = null) {
    const logEntry = {
      id: this._generateLogId(),
      userId: userId,
      module: module,
      action: action,
      data: data,
      result: result,
      errorMessage: errorMessage,
      timestamp: new Date()
    };
    
    this.logs.push(logEntry);
    
    // 限制日志数量，只保留最近的10000条记录
    if (this.logs.length > 10000) {
      this.logs = this.logs.slice(-10000);
    }
    
    // 输出到控制台
    if (result === 'success') {
      console.log(`[操作日志] 用户${userId}在${module}模块执行${action}操作成功`);
    } else {
      console.error(`[操作日志] 用户${userId}在${module}模块执行${action}操作失败: ${errorMessage}`);
    }
    
    return logEntry.id;
  }

  /**
   * 获取操作日志
   * @param {Object} filters - 过滤条件
   * @param {number} limit - 限制返回数量
   * @returns {Array} 操作日志列表
   */
  getOperationLogs(filters = {}, limit = 100) {
    let logs = [...this.logs];
    
    // 应用过滤条件
    if (filters.userId) {
      logs = logs.filter(log => log.userId === filters.userId);
    }
    
    if (filters.module) {
      logs = logs.filter(log => log.module === filters.module);
    }
    
    if (filters.action) {
      logs = logs.filter(log => log.action === filters.action);
    }
    
    if (filters.result) {
      logs = logs.filter(log => log.result === filters.result);
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
   * 根据ID获取操作日志详情
   * @param {string} logId - 日志ID
   * @returns {Object} 日志详情
   */
  getLogById(logId) {
    return this.logs.find(log => log.id === logId);
  }

  /**
   * 统计操作日志
   * @param {Object} filters - 过滤条件
   * @returns {Object} 统计结果
   */
  getOperationStats(filters = {}) {
    let logs = [...this.logs];
    
    // 应用过滤条件
    if (filters.startDate) {
      logs = logs.filter(log => log.timestamp >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      logs = logs.filter(log => log.timestamp <= new Date(filters.endDate));
    }
    
    const stats = {
      total: logs.length,
      success: logs.filter(log => log.result === 'success').length,
      failure: logs.filter(log => log.result === 'failure').length,
      byModule: {},
      byAction: {},
      byUser: {}
    };
    
    // 按模块统计
    logs.forEach(log => {
      if (!stats.byModule[log.module]) {
        stats.byModule[log.module] = { success: 0, failure: 0 };
      }
      stats.byModule[log.module][log.result]++;
    });
    
    // 按操作类型统计
    logs.forEach(log => {
      if (!stats.byAction[log.action]) {
        stats.byAction[log.action] = { success: 0, failure: 0 };
      }
      stats.byAction[log.action][log.result]++;
    });
    
    // 按用户统计
    logs.forEach(log => {
      if (!stats.byUser[log.userId]) {
        stats.byUser[log.userId] = { success: 0, failure: 0 };
      }
      stats.byUser[log.userId][log.result]++;
    });
    
    return stats;
  }

  /**
   * 获取用户操作历史
   * @param {string} userId - 用户ID
   * @param {number} limit - 限制返回数量
   * @returns {Array} 用户操作历史
   */
  getUserOperationHistory(userId, limit = 50) {
    return this.getOperationLogs({ userId: userId }, limit);
  }

  /**
   * 获取模块操作历史
   * @param {string} module - 模块名称
   * @param {number} limit - 限制返回数量
   * @returns {Array} 模块操作历史
   */
  getModuleOperationHistory(module, limit = 50) {
    return this.getOperationLogs({ module: module }, limit);
  }

  /**
   * 获取失败的操作日志
   * @param {number} limit - 限制返回数量
   * @returns {Array} 失败的操作日志
   */
  getFailedOperations(limit = 50) {
    return this.getOperationLogs({ result: 'failure' }, limit);
  }

  /**
   * 导出操作日志
   * @param {Object} filters - 过滤条件
   * @param {string} format - 导出格式 (json/csv)
   * @returns {string} 导出的数据
   */
  exportOperationLogs(filters = {}, format = 'json') {
    const logs = this.getOperationLogs(filters);
    
    if (format === 'json') {
      return JSON.stringify({
        exportedAt: new Date().toISOString(),
        filters: filters,
        count: logs.length,
        logs: logs
      }, null, 2);
    } else if (format === 'csv') {
      // CSV头部
      let csvContent = 'ID,用户ID,模块,操作,结果,错误信息,时间\n';
      
      // 添加数据行
      logs.forEach(log => {
        csvContent += `"${log.id}","${log.userId}","${log.module}","${log.action}","${log.result}","${log.errorMessage || ''}","${log.timestamp.toISOString()}"\n`;
      });
      
      return csvContent;
    }
    
    return '';
  }

  /**
   * 清理旧日志
   * @param {number} days - 保留天数
   * @returns {number} 清理的日志数量
   */
  cleanupOldLogs(days = 30) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const initialCount = this.logs.length;
    
    this.logs = this.logs.filter(log => log.timestamp >= cutoffDate);
    
    return initialCount - this.logs.length;
  }

  /**
   * 生成日志ID
   * @returns {string} 日志ID
   */
  _generateLogId() {
    return 'oplog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = OperationLog;