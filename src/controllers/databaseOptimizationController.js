/**
 * 数据库优化控制器
 */

const DatabaseBackup = require('../utils/databaseBackup');
const DatabaseMonitor = require('../utils/databaseMonitor');
const IndexOptimizer = require('../utils/indexOptimizer');
const readWriteSplitting = require('../database/readWriteSplitting');
const { BusinessError, ValidationError } = require('../middleware/enhancedErrorHandler');
const logger = require('../utils/logger');

// 初始化工具实例
const databaseBackup = new DatabaseBackup();
const databaseMonitor = new DatabaseMonitor();
const indexOptimizer = new IndexOptimizer();

/**
 * 创建数据库备份
 */
exports.createBackup = async (req, res) => {
  try {
    const { backupName } = req.body;
    
    const result = await databaseBackup.createBackup(backupName);
    
    if (!result.success) {
      throw new BusinessError('数据库备份创建失败: ' + result.error);
    }
    
    logger.info('数据库备份创建成功', {
      backupPath: result.backupPath,
      userId: req.user?.id
    });
    
    res.status(201).json({
      success: true,
      message: '数据库备份创建成功',
      data: result
    });
  } catch (error) {
    logger.error('数据库备份创建失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`数据库备份创建失败: ${error.message}`);
  }
};

/**
 * 恢复数据库备份
 */
exports.restoreBackup = async (req, res) => {
  try {
    const { backupFilename } = req.body;
    
    // 验证参数
    if (!backupFilename) {
      throw new ValidationError('缺少必要参数: backupFilename');
    }
    
    const result = await databaseBackup.restoreBackup(backupFilename);
    
    if (!result.success) {
      throw new BusinessError('数据库备份恢复失败: ' + result.error);
    }
    
    logger.info('数据库备份恢复成功', {
      backupPath: result.backupPath,
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      message: '数据库备份恢复成功',
      data: result
    });
  } catch (error) {
    logger.error('数据库备份恢复失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`数据库备份恢复失败: ${error.message}`);
  }
};

/**
 * 获取备份列表
 */
exports.getBackupList = async (req, res) => {
  try {
    const backups = await databaseBackup.getBackupList();
    
    res.json({
      success: true,
      data: backups
    });
  } catch (error) {
    logger.error('获取备份列表失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`获取备份列表失败: ${error.message}`);
  }
};

/**
 * 删除备份文件
 */
exports.deleteBackup = async (req, res) => {
  try {
    const { backupFilename } = req.body;
    
    // 验证参数
    if (!backupFilename) {
      throw new ValidationError('缺少必要参数: backupFilename');
    }
    
    const result = await databaseBackup.deleteBackup(backupFilename);
    
    if (!result.success) {
      throw new BusinessError('数据库备份文件删除失败: ' + result.error);
    }
    
    logger.info('数据库备份文件删除成功', {
      backupFilename: backupFilename,
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      message: '数据库备份文件删除成功',
      data: result
    });
  } catch (error) {
    logger.error('数据库备份文件删除失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`数据库备份文件删除失败: ${error.message}`);
  }
};

/**
 * 数据库健康检查
 */
exports.checkDatabaseHealth = async (req, res) => {
  try {
    const health = await databaseMonitor.checkHealth();
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    logger.error('数据库健康检查失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`数据库健康检查失败: ${error.message}`);
  }
};

/**
 * 获取数据库统计信息
 */
exports.getDatabaseStats = async (req, res) => {
  try {
    const stats = await databaseMonitor.getDatabaseStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('获取数据库统计信息失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`获取数据库统计信息失败: ${error.message}`);
  }
};

/**
 * 优化表索引
 */
exports.optimizeTableIndexes = async (req, res) => {
  try {
    const { tableName } = req.body;
    
    // 验证参数
    if (!tableName) {
      throw new ValidationError('缺少必要参数: tableName');
    }
    
    const result = await indexOptimizer.optimizeTableIndexes(tableName);
    
    if (!result.success) {
      throw new BusinessError('表索引优化失败: ' + result.error);
    }
    
    logger.info('表索引优化完成', {
      tableName: tableName,
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      message: '表索引优化完成',
      data: result
    });
  } catch (error) {
    logger.error('表索引优化失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`表索引优化失败: ${error.message}`);
  }
};

/**
 * 批量优化所有表索引
 */
exports.optimizeAllTables = async (req, res) => {
  try {
    const result = await indexOptimizer.optimizeAllTables();
    
    if (!result.success) {
      throw new BusinessError('批量索引优化失败: ' + result.error);
    }
    
    logger.info('批量索引优化完成', {
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      message: '批量索引优化完成',
      data: result
    });
  } catch (error) {
    logger.error('批量索引优化失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`批量索引优化失败: ${error.message}`);
  }
};

/**
 * 获取索引性能建议
 */
exports.getIndexPerformanceAdvice = async (req, res) => {
  try {
    const { tableName } = req.query;
    
    // 验证参数
    if (!tableName) {
      throw new ValidationError('缺少必要参数: tableName');
    }
    
    const advice = await indexOptimizer.getIndexPerformanceAdvice(tableName);
    
    if (!advice) {
      throw new BusinessError('获取索引性能建议失败');
    }
    
    res.json({
      success: true,
      data: advice
    });
  } catch (error) {
    logger.error('获取索引性能建议失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      query: req.query
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`获取索引性能建议失败: ${error.message}`);
  }
};

/**
 * 测试数据库连接
 */
exports.testDatabaseConnections = async (req, res) => {
  try {
    const result = await readWriteSplitting.testConnections();
    
    if (!result.success) {
      throw new BusinessError('数据库连接测试失败: ' + result.error);
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('数据库连接测试失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`数据库连接测试失败: ${error.message}`);
  }
};

/**
 * 获取连接状态
 */
exports.getConnectionStatus = async (req, res) => {
  try {
    const status = readWriteSplitting.getConnectionStatus();
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    logger.error('获取连接状态失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`获取连接状态失败: ${error.message}`);
  }
};

/**
 * 执行自动备份
 */
exports.autoBackup = async (req, res) => {
  try {
    const result = await databaseBackup.autoBackup();
    
    if (!result.success) {
      throw new BusinessError('自动备份失败: ' + result.error);
    }
    
    res.json({
      success: true,
      message: '自动备份完成',
      data: result
    });
  } catch (error) {
    logger.error('自动备份失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`自动备份失败: ${error.message}`);
  }
};