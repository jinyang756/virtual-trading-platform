/**
 * 数据库监控工具
 */

const dbAdapter = require('../database/dbAdapter');
const logger = require('./logger');

class DatabaseMonitor {
  constructor() {
    this.monitoringInterval = 60000; // 1分钟监控间隔
    this.alertThresholds = {
      connectionCount: 50,
      slowQueryTime: 1000, // 1秒
      tableSizeThreshold: 1000000000, // 1GB
      queryErrorRate: 0.05 // 5%错误率
    };
  }

  /**
   * 获取数据库连接状态
   * @returns {Promise<Object>} 连接状态信息
   */
  async getConnectionStatus() {
    try {
      // 对于Teable数据库，我们检查连接状态
      const connection = await dbAdapter.getConnection();
      const testResult = await dbAdapter.testConnection();
      
      return {
        connected: testResult.success,
        message: testResult.message || '连接正常',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('获取数据库连接状态失败', {
        message: error.message,
        stack: error.stack
      });
      
      return {
        connected: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 获取慢查询信息
   * @returns {Promise<Object>} 慢查询信息
   */
  async getSlowQueries() {
    try {
      // 对于Teable数据库，我们无法直接获取慢查询信息
      // 这里返回模拟数据
      return {
        slowQueries: [],
        count: 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('获取慢查询信息失败', {
        message: error.message,
        stack: error.stack
      });
      
      return {
        slowQueries: [],
        count: 0,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 获取表大小信息
   * @returns {Promise<Array>} 表大小信息
   */
  async getTableSizes() {
    try {
      // 对于Teable数据库，我们无法直接获取表大小信息
      // 这里返回模拟数据
      return {
        tables: [],
        largeTables: [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('获取表大小信息失败', {
        message: error.message,
        stack: error.stack
      });
      
      return {
        tables: [],
        largeTables: [],
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 获取查询性能统计
   * @returns {Promise<Object>} 查询性能统计
   */
  async getQueryPerformance() {
    try {
      // 对于Teable数据库，我们无法直接获取查询性能统计
      // 这里返回模拟数据
      return {
        performance: {
          total_queries: 0,
          avg_query_time: 0,
          max_query_time: 0,
          min_query_time: 0
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('获取查询性能统计失败', {
        message: error.message,
        stack: error.stack
      });
      
      return {
        performance: null,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 检查数据库健康状态
   * @returns {Promise<Object>} 健康状态
   */
  async checkHealth() {
    try {
      // 检查连接状态
      const connectionStatus = await this.getConnectionStatus();
      
      // 检查慢查询
      const slowQueries = await this.getSlowQueries();
      
      // 检查表大小
      const tableSizes = await this.getTableSizes();
      
      // 检查查询性能
      const queryPerformance = await this.getQueryPerformance();
      
      // 综合健康评估
      let status = connectionStatus.connected ? 'healthy' : 'error';
      const alerts = [];
      
      // 检查连接状态
      if (!connectionStatus.connected) {
        status = 'error';
        alerts.push({
          type: 'connection_failed',
          message: `数据库连接失败: ${connectionStatus.error || '未知错误'}`,
          severity: 'error'
        });
      }
      
      const health = {
        status: status,
        connectionStatus: connectionStatus,
        slowQueries: slowQueries,
        tableSizes: tableSizes,
        queryPerformance: queryPerformance,
        alerts: alerts,
        timestamp: new Date().toISOString()
      };
      
      // 记录健康检查日志
      if (alerts.length > 0) {
        logger.warn('数据库健康检查发现警告', {
          health: health
        });
      } else {
        logger.info('数据库健康检查正常', {
          health: health
        });
      }
      
      return health;
    } catch (error) {
      logger.error('数据库健康检查失败', {
        message: error.message,
        stack: error.stack
      });
      
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 设置监控告警阈值
   * @param {Object} thresholds - 告警阈值
   */
  setAlertThresholds(thresholds) {
    this.alertThresholds = {
      ...this.alertThresholds,
      ...thresholds
    };
  }

  /**
   * 启动定期监控
   * @param {Function} alertCallback - 告警回调函数
   */
  startMonitoring(alertCallback) {
    // 定期检查数据库健康状态
    setInterval(async () => {
      try {
        const health = await this.checkHealth();
        
        // 如果有告警且提供了回调函数，调用告警回调
        if (health.alerts && health.alerts.length > 0 && typeof alertCallback === 'function') {
          alertCallback(health.alerts);
        }
      } catch (error) {
        logger.error('定期监控执行失败', {
          message: error.message,
          stack: error.stack
        });
      }
    }, this.monitoringInterval);
    
    logger.info('数据库监控已启动', {
      interval: this.monitoringInterval
    });
  }

  /**
   * 获取数据库统计信息
   * @returns {Promise<Object>} 数据库统计信息
   */
  async getDatabaseStats() {
    try {
      // 对于Teable数据库，我们无法直接获取数据库统计信息
      // 这里返回模拟数据
      return {
        database: {
          database_name: 'teable',
          version: '1.0'
        },
        tableCount: 0,
        totalRows: 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('获取数据库统计信息失败', {
        message: error.message,
        stack: error.stack
      });
      
      return {
        database: null,
        tableCount: 0,
        totalRows: 0,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = DatabaseMonitor;