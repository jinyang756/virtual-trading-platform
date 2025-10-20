/**
 * 数据库优化功能测试
 */

const DatabaseBackup = require('../../src/utils/databaseBackup');
const DatabaseMonitor = require('../../src/utils/databaseMonitor');
const IndexOptimizer = require('../../src/utils/indexOptimizer');

// Mock文件系统和子进程
jest.mock('fs/promises');
jest.mock('child_process');
jest.mock('../../src/database/connection');

const fs = require('fs/promises');
const { exec } = require('child_process');
const { promisify } = require('util');
const { executeQuery } = require('../../src/database/connection');

describe('数据库优化功能测试', () => {
  beforeEach(() => {
    // 清除所有mock调用
    jest.clearAllMocks();
  });

  describe('数据库备份功能测试', () => {
    test('应该能够创建数据库备份', async () => {
      // Mock文件系统方法
      fs.mkdir.mockResolvedValue();
      fs.access.mockResolvedValue();
      
      // Mock子进程执行
      const execMock = jest.spyOn(require('child_process'), 'exec');
      execMock.mockImplementation((command, options, callback) => {
        // 如果callback是第二个参数
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        // 调用回调函数，模拟成功执行
        callback(null, { stdout: '', stderr: '' });
      });
      
      const backup = new DatabaseBackup();
      const result = await backup.createBackup('test-backup');
      
      expect(result.success).toBe(true);
      expect(result.filename).toContain('test-backup');
    });

    test('应该能够获取备份列表', async () => {
      // Mock文件系统方法
      fs.mkdir.mockResolvedValue();
      fs.readdir.mockResolvedValue(['backup1.sql', 'backup2.sql']);
      fs.stat.mockResolvedValue({
        size: 1024,
        birthtime: new Date(),
        mtime: new Date()
      });
      
      const backup = new DatabaseBackup();
      const backups = await backup.getBackupList();
      
      expect(backups).toBeDefined();
    });

    test('应该能够删除备份文件', async () => {
      // Mock文件系统方法
      fs.access.mockImplementation(() => Promise.resolve());
      fs.unlink.mockResolvedValue();
      
      const backup = new DatabaseBackup();
      const result = await backup.deleteBackup('test-backup.sql');
      
      expect(result).toBeDefined();
    });
  });

  describe('数据库监控功能测试', () => {
    test('应该能够获取连接状态', async () => {
      // Mock数据库查询
      executeQuery.mockResolvedValue([{ Value: '5' }]);
      
      const monitor = new DatabaseMonitor();
      const status = await monitor.getConnectionStatus();
      
      expect(status).toHaveProperty('connectedThreads');
    });

    test('应该能够检查数据库健康状态', async () => {
      // Mock所有监控方法
      jest.spyOn(DatabaseMonitor.prototype, 'getConnectionStatus').mockResolvedValue({
        connectedThreads: 10
      });
      
      jest.spyOn(DatabaseMonitor.prototype, 'getSlowQueries').mockResolvedValue({
        count: 0
      });
      
      jest.spyOn(DatabaseMonitor.prototype, 'getTableSizes').mockResolvedValue({
        largeTables: []
      });
      
      jest.spyOn(DatabaseMonitor.prototype, 'getQueryPerformance').mockResolvedValue({
        performance: {}
      });
      
      const monitor = new DatabaseMonitor();
      const health = await monitor.checkHealth();
      
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('alerts');
    });

    test('应该能够获取数据库统计信息', async () => {
      // Mock数据库查询
      executeQuery
        .mockResolvedValueOnce([{ database_name: 'test_db', version: '8.0' }])
        .mockResolvedValueOnce([{ table_count: 10 }])
        .mockResolvedValueOnce([{ total_rows: 1000 }]);
      
      const monitor = new DatabaseMonitor();
      const stats = await monitor.getDatabaseStats();
      
      expect(stats.database).toHaveProperty('database_name');
      expect(stats.tableCount).toBe(10);
      expect(stats.totalRows).toBe(1000);
    });
  });

  describe('索引优化功能测试', () => {
    test('应该能够获取表现有索引', async () => {
      // Mock数据库查询
      executeQuery.mockResolvedValue([
        { INDEX_NAME: 'idx_user_id', COLUMN_NAME: 'user_id', NON_UNIQUE: 1, SEQ_IN_INDEX: 1 },
        { INDEX_NAME: 'idx_asset', COLUMN_NAME: 'asset', NON_UNIQUE: 1, SEQ_IN_INDEX: 1 }
      ]);
      
      const optimizer = new IndexOptimizer();
      const indexes = await optimizer.getExistingIndexes('transactions');
      
      expect(indexes).toHaveLength(2);
      expect(indexes[0]).toHaveProperty('name');
      expect(indexes[0]).toHaveProperty('columns');
    });

    test('应该能够分析缺失的索引', async () => {
      // Mock数据库查询
      executeQuery
        .mockResolvedValueOnce([]) // 现有索引
        .mockResolvedValueOnce([]); // 查询模式
      
      const optimizer = new IndexOptimizer();
      const analysis = await optimizer.analyzeMissingIndexes('transactions');
      
      expect(analysis).toHaveProperty('tableName');
      expect(analysis).toHaveProperty('missingIndexes');
    });

    test('应该能够优化表索引', async () => {
      // Mock分析方法
      jest.spyOn(IndexOptimizer.prototype, 'analyzeMissingIndexes').mockResolvedValue({
        missingIndexes: [
          { columns: ['user_id'], priority: 'high' }
        ]
      });
      
      // Mock数据库查询
      executeQuery.mockResolvedValue();
      
      const optimizer = new IndexOptimizer();
      const result = await optimizer.optimizeTableIndexes('transactions');
      
      expect(result.success).toBe(true);
    });
  });

  describe('Teable数据库适配测试', () => {
    test('应该能够初始化数据库监控', () => {
      const monitor = new DatabaseMonitor();
      expect(monitor).toBeDefined();
    });

    test('应该能够获取连接状态', async () => {
      const monitor = new DatabaseMonitor();
      const status = await monitor.getConnectionStatus();
      expect(status).toHaveProperty('connected');
    });

    test('应该能够初始化索引优化器', () => {
      const optimizer = new IndexOptimizer();
      expect(optimizer).toBeDefined();
    });
  });
});