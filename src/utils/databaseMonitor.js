/**
 * 数据库监控工具
 */

const { executeQuery } = require('../database/connection');
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
      const query = 'SHOW STATUS LIKE "Threads_connected"';
      const results = await executeQuery(query);
      
      return {
        connectedThreads: parseInt(results[0].Value),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('获取数据库连接状态失败', {
        message: error.message,
        stack: error.stack
      });
      
      return {
        connectedThreads: 0,
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
      const query = 'SHOW PROCESSLIST';
      const results = await executeQuery(query);
      
      // 过滤出执行时间较长的查询
      const slowQueries = results.filter(row => 
        row.Time > this.alertThresholds.slowQueryTime / 1000
      );
      
      return {
        slowQueries: slowQueries,
        count: slowQueries.length,
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
      const query = `
        SELECT 
          table_name,
          ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
        FROM information_schema.tables 
        WHERE table_schema = DATABASE()
        ORDER BY (data_length + index_length) DESC
      `;
      const results = await executeQuery(query);
      
      // 识别大表
      const largeTables = results.filter(row => 
        row.size_mb * 1024 * 1024 > this.alertThresholds.tableSizeThreshold
      );
      
      return {
        tables: results,
        largeTables: largeTables,
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
      // 获取最近的查询日志（需要启用查询日志）
      const query = `
        SELECT 
          COUNT(*) as total_queries,
          AVG(query_time) as avg_query_time,
          MAX(query_time) as max_query_time,
          MIN(query_time) as min_query_time
        FROM (
          SELECT 1 as query_time
          FROM information_schema.tables 
          WHERE table_schema = DATABASE()
          LIMIT 1000
        ) as sample_queries
      `;
      const results = await executeQuery(query);
      
      return {
        performance: results[0],
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
      let status = 'healthy';
      const alerts = [];
      
      // 检查连接数是否超过阈值
      if (connectionStatus.connectedThreads > this.alertThresholds.connectionCount) {
        status = 'warning';
        alerts.push({
          type: 'high_connection_count',
          message: `连接数过高: ${connectionStatus.connectedThreads}`,
          severity: 'warning'
        });
      }
      
      // 检查是否有慢查询
      if (slowQueries.count > 0) {
        status = slowQueries.count > 5 ? 'warning' : status;
        alerts.push({
          type: 'slow_queries',
          message: `发现${slowQueries.count}个慢查询`,
          severity: 'warning'
        });
      }
      
      // 检查是否有大表
      if (tableSizes.largeTables.length > 0) {
        status = 'warning';
        alerts.push({
          type: 'large_tables',
          message: `发现${tableSizes.largeTables.length}个大表`,
          severity: 'warning'
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
      // 获取数据库基本信息
      const dbInfoQuery = 'SELECT DATABASE() as database_name, VERSION() as version';
      const dbInfo = await executeQuery(dbInfoQuery);
      
      // 获取表数量
      const tableCountQuery = `
        SELECT COUNT(*) as table_count 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE()
      `;
      const tableCount = await executeQuery(tableCountQuery);
      
      // 获取记录总数
      const recordCountQuery = `
        SELECT SUM(table_rows) as total_rows
        FROM information_schema.tables 
        WHERE table_schema = DATABASE()
      `;
      const recordCount = await executeQuery(recordCountQuery);
      
      return {
        database: dbInfo[0],
        tableCount: tableCount[0].table_count,
        totalRows: recordCount[0].total_rows || 0,
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