/**
 * 数据库读写分离配置
 */

const mysql = require('mysql2');
const config = require('../../config/database');
const logger = require('../utils/logger');

class ReadWriteSplitting {
  constructor() {
    this.masterConfig = config.mysql;
    this.slaveConfigs = config.mysqlSlaves || [];
    
    this.masterConnection = null;
    this.slaveConnections = [];
    
    this.currentSlaveIndex = 0;
  }

  /**
   * 初始化主库连接
   */
  initMasterConnection() {
    try {
      this.masterConnection = mysql.createConnection({
        host: this.masterConfig.host,
        port: this.masterConfig.port,
        user: this.masterConfig.user,
        password: this.masterConfig.password,
        database: this.masterConfig.database,
        connectionLimit: this.masterConfig.connectionLimit || 10
      });
      
      this.masterConnection.on('error', (err) => {
        logger.error('主库连接错误', {
          message: err.message,
          code: err.code
        });
      });
      
      logger.info('主库连接初始化成功');
    } catch (error) {
      logger.error('主库连接初始化失败', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * 初始化从库连接
   */
  initSlaveConnections() {
    try {
      this.slaveConnections = this.slaveConfigs.map((slaveConfig, index) => {
        const connection = mysql.createConnection({
          host: slaveConfig.host,
          port: slaveConfig.port,
          user: slaveConfig.user,
          password: slaveConfig.password,
          database: slaveConfig.database,
          connectionLimit: slaveConfig.connectionLimit || 10
        });
        
        connection.on('error', (err) => {
          logger.error(`从库${index}连接错误`, {
            message: err.message,
            code: err.code
          });
        });
        
        logger.info(`从库${index}连接初始化成功`);
        return connection;
      });
    } catch (error) {
      logger.error('从库连接初始化失败', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * 获取主库连接
   * @returns {Object} 主库连接
   */
  getMasterConnection() {
    if (!this.masterConnection) {
      this.initMasterConnection();
    }
    
    return this.masterConnection;
  }

  /**
   * 获取从库连接（轮询方式）
   * @returns {Object} 从库连接
   */
  getSlaveConnection() {
    if (this.slaveConnections.length === 0) {
      // 如果没有配置从库，返回主库连接
      return this.getMasterConnection();
    }
    
    // 轮询选择从库
    const slaveConnection = this.slaveConnections[this.currentSlaveIndex];
    this.currentSlaveIndex = (this.currentSlaveIndex + 1) % this.slaveConnections.length;
    
    return slaveConnection;
  }

  /**
   * 根据SQL语句类型选择连接
   * @param {string} sql - SQL语句
   * @returns {Object} 数据库连接
   */
  selectConnection(sql) {
    // 转换为大写以便匹配
    const upperSql = sql.trim().toUpperCase();
    
    // 判断是否为写操作
    const isWriteOperation = (
      upperSql.startsWith('INSERT') ||
      upperSql.startsWith('UPDATE') ||
      upperSql.startsWith('DELETE') ||
      upperSql.startsWith('CREATE') ||
      upperSql.startsWith('ALTER') ||
      upperSql.startsWith('DROP') ||
      upperSql.startsWith('TRUNCATE') ||
      upperSql.startsWith('REPLACE')
    );
    
    if (isWriteOperation) {
      logger.debug('选择主库连接执行写操作', {
        sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : '')
      });
      return this.getMasterConnection();
    } else {
      logger.debug('选择从库连接执行读操作', {
        sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : '')
      });
      return this.getSlaveConnection();
    }
  }

  /**
   * 执行查询（自动选择主库或从库）
   * @param {string} sql - SQL语句
   * @param {Array} values - 参数值
   * @returns {Promise} 查询结果
   */
  async executeQuery(sql, values = []) {
    return new Promise((resolve, reject) => {
      try {
        const connection = this.selectConnection(sql);
        
        connection.execute(sql, values, (error, results) => {
          if (error) {
            logger.error('数据库查询执行失败', {
              message: error.message,
              sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
              values: values
            });
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        logger.error('数据库查询执行异常', {
          message: error.message,
          stack: error.stack,
          sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
          values: values
        });
        reject(error);
      }
    });
  }

  /**
   * 执行写操作（强制使用主库）
   * @param {string} sql - SQL语句
   * @param {Array} values - 参数值
   * @returns {Promise} 执行结果
   */
  async executeWrite(sql, values = []) {
    return new Promise((resolve, reject) => {
      try {
        const connection = this.getMasterConnection();
        
        connection.execute(sql, values, (error, results) => {
          if (error) {
            logger.error('数据库写操作执行失败', {
              message: error.message,
              sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
              values: values
            });
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        logger.error('数据库写操作执行异常', {
          message: error.message,
          stack: error.stack,
          sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
          values: values
        });
        reject(error);
      }
    });
  }

  /**
   * 执行读操作（使用从库）
   * @param {string} sql - SQL语句
   * @param {Array} values - 参数值
   * @returns {Promise} 查询结果
   */
  async executeRead(sql, values = []) {
    return new Promise((resolve, reject) => {
      try {
        const connection = this.getSlaveConnection();
        
        connection.execute(sql, values, (error, results) => {
          if (error) {
            logger.error('数据库读操作执行失败', {
              message: error.message,
              sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
              values: values
            });
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        logger.error('数据库读操作执行异常', {
          message: error.message,
          stack: error.stack,
          sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
          values: values
        });
        reject(error);
      }
    });
  }

  /**
   * 关闭所有连接
   */
  closeConnections() {
    try {
      // 关闭主库连接
      if (this.masterConnection) {
        this.masterConnection.end();
        logger.info('主库连接已关闭');
      }
      
      // 关闭从库连接
      this.slaveConnections.forEach((connection, index) => {
        connection.end();
        logger.info(`从库${index}连接已关闭`);
      });
      
      this.masterConnection = null;
      this.slaveConnections = [];
      this.currentSlaveIndex = 0;
    } catch (error) {
      logger.error('关闭数据库连接失败', {
        message: error.message,
        stack: error.stack
      });
    }
  }

  /**
   * 获取连接状态
   * @returns {Object} 连接状态信息
   */
  getConnectionStatus() {
    return {
      master: this.masterConnection ? 'connected' : 'disconnected',
      slaves: this.slaveConnections.map((conn, index) => ({
        index: index,
        status: conn ? 'connected' : 'disconnected'
      })),
      slaveCount: this.slaveConnections.length,
      currentSlaveIndex: this.currentSlaveIndex
    };
  }

  /**
   * 测试连接
   * @returns {Promise<Object>} 测试结果
   */
  async testConnections() {
    try {
      const results = {
        master: false,
        slaves: []
      };
      
      // 测试主库连接
      if (this.masterConnection) {
        await new Promise((resolve, reject) => {
          this.masterConnection.query('SELECT 1', (error) => {
            if (error) {
              reject(error);
            } else {
              results.master = true;
              resolve();
            }
          });
        });
      }
      
      // 测试从库连接
      for (let i = 0; i < this.slaveConnections.length; i++) {
        const connection = this.slaveConnections[i];
        try {
          await new Promise((resolve, reject) => {
            connection.query('SELECT 1', (error) => {
              if (error) {
                reject(error);
              } else {
                results.slaves.push({ index: i, success: true });
                resolve();
              }
            });
          });
        } catch (error) {
          results.slaves.push({ index: i, success: false, error: error.message });
        }
      }
      
      return {
        success: true,
        results: results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('数据库连接测试失败', {
        message: error.message,
        stack: error.stack
      });
      
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// 创建单例实例
const readWriteSplitting = new ReadWriteSplitting();

// 如果配置了从库，则初始化连接
if (config.mysqlSlaves && config.mysqlSlaves.length > 0) {
  readWriteSplitting.initMasterConnection();
  readWriteSplitting.initSlaveConnections();
}

module.exports = readWriteSplitting;