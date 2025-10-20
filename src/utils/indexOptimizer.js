/**
 * 数据库索引优化工具
 */

const { executeQuery } = require('../database/connection');
const logger = require('./logger');

class IndexOptimizer {
  constructor() {
    this.optimizationRules = {
      // 常用查询字段的索引建议
      commonQueryFields: [
        'user_id',
        'asset',
        'symbol_id',
        'status',
        'timestamp',
        'created_at',
        'updated_at'
      ],
      // 复合索引建议
      compositeIndexes: [
        ['user_id', 'timestamp'],
        ['user_id', 'asset'],
        ['symbol_id', 'timestamp'],
        ['status', 'timestamp']
      ]
    };
  }

  /**
   * 分析表的查询模式
   * @param {string} tableName - 表名
   * @returns {Promise<Object>} 查询模式分析结果
   */
  async analyzeQueryPatterns(tableName) {
    try {
      // 获取表的使用统计信息（MySQL 5.7+）
      const query = `
        SELECT 
          COLUMN_NAME,
          COUNT(*) as usage_count
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = ?
        GROUP BY COLUMN_NAME
        ORDER BY usage_count DESC
      `;
      
      const results = await executeQuery(query, [tableName]);
      
      return {
        tableName: tableName,
        columns: results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('分析表查询模式失败', {
        message: error.message,
        stack: error.stack,
        tableName
      });
      
      return {
        tableName: tableName,
        columns: [],
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 获取表的现有索引
   * @param {string} tableName - 表名
   * @returns {Promise<Array>} 现有索引列表
   */
  async getExistingIndexes(tableName) {
    try {
      const query = `
        SELECT 
          INDEX_NAME,
          COLUMN_NAME,
          NON_UNIQUE,
          SEQ_IN_INDEX
        FROM information_schema.STATISTICS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = ?
        ORDER BY INDEX_NAME, SEQ_IN_INDEX
      `;
      
      const results = await executeQuery(query, [tableName]);
      
      // 将结果按索引名分组
      const indexes = {};
      results.forEach(row => {
        if (!indexes[row.INDEX_NAME]) {
          indexes[row.INDEX_NAME] = {
            name: row.INDEX_NAME,
            columns: [],
            unique: row.NON_UNIQUE === 0
          };
        }
        indexes[row.INDEX_NAME].columns.push(row.COLUMN_NAME);
      });
      
      return Object.values(indexes);
    } catch (error) {
      logger.error('获取表现有索引失败', {
        message: error.message,
        stack: error.stack,
        tableName
      });
      
      return [];
    }
  }

  /**
   * 分析缺失的索引
   * @param {string} tableName - 表名
   * @returns {Promise<Object>} 缺失索引分析结果
   */
  async analyzeMissingIndexes(tableName) {
    try {
      const existingIndexes = await this.getExistingIndexes(tableName);
      const queryPatterns = await this.analyzeQueryPatterns(tableName);
      
      const missingIndexes = [];
      
      // 检查常用查询字段是否已建立索引
      for (const field of this.optimizationRules.commonQueryFields) {
        const hasIndex = existingIndexes.some(index => 
          index.columns.includes(field)
        );
        
        if (!hasIndex) {
          missingIndexes.push({
            type: 'single_column',
            column: field,
            recommendation: `为字段 ${field} 创建索引`,
            priority: 'high'
          });
        }
      }
      
      // 检查复合索引建议
      for (const composite of this.optimizationRules.compositeIndexes) {
        const hasCompositeIndex = existingIndexes.some(index => 
          composite.every(col => index.columns.includes(col)) &&
          index.columns.length === composite.length
        );
        
        if (!hasCompositeIndex) {
          missingIndexes.push({
            type: 'composite',
            columns: composite,
            recommendation: `为字段 ${composite.join(', ')} 创建复合索引`,
            priority: 'medium'
          });
        }
      }
      
      return {
        tableName: tableName,
        missingIndexes: missingIndexes,
        existingIndexes: existingIndexes,
        queryPatterns: queryPatterns,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('分析缺失索引失败', {
        message: error.message,
        stack: error.stack,
        tableName
      });
      
      return {
        tableName: tableName,
        missingIndexes: [],
        existingIndexes: [],
        queryPatterns: null,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 生成索引创建语句
   * @param {string} tableName - 表名
   * @param {Object} indexInfo - 索引信息
   * @returns {string} SQL语句
   */
  generateCreateIndexSQL(tableName, indexInfo) {
    const indexName = `idx_${tableName}_${indexInfo.columns.join('_')}`;
    
    if (indexInfo.columns.length === 1) {
      // 单列索引
      return `CREATE INDEX ${indexName} ON ${tableName} (${indexInfo.columns[0]});`;
    } else {
      // 复合索引
      return `CREATE INDEX ${indexName} ON ${tableName} (${indexInfo.columns.join(', ')});`;
    }
  }

  /**
   * 优化表索引
   * @param {string} tableName - 表名
   * @returns {Promise<Object>} 优化结果
   */
  async optimizeTableIndexes(tableName) {
    try {
      const analysis = await this.analyzeMissingIndexes(tableName);
      
      if (!analysis.missingIndexes || analysis.missingIndexes.length === 0) {
        return {
          success: true,
          message: '没有发现需要优化的索引',
          tableName: tableName,
          createdIndexes: [],
          timestamp: new Date().toISOString()
        };
      }
      
      const createdIndexes = [];
      
      // 按优先级排序（高优先级先处理）
      const sortedIndexes = analysis.missingIndexes.sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (a.priority !== 'high' && b.priority === 'high') return 1;
        return 0;
      });
      
      // 创建缺失的索引
      for (const missingIndex of sortedIndexes) {
        try {
          const indexInfo = {
            columns: missingIndex.columns || [missingIndex.column],
            unique: false
          };
          
          const sql = this.generateCreateIndexSQL(tableName, indexInfo);
          
          // 执行创建索引语句
          await executeQuery(sql);
          
          createdIndexes.push({
            sql: sql,
            indexInfo: indexInfo,
            status: 'success'
          });
          
          logger.info('索引创建成功', {
            tableName: tableName,
            sql: sql
          });
        } catch (error) {
          logger.error('索引创建失败', {
            message: error.message,
            stack: error.stack,
            tableName: tableName,
            indexInfo: missingIndex
          });
          
          createdIndexes.push({
            indexInfo: missingIndex,
            error: error.message,
            status: 'failed'
          });
        }
      }
      
      return {
        success: true,
        tableName: tableName,
        analysis: analysis,
        createdIndexes: createdIndexes,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('优化表索引失败', {
        message: error.message,
        stack: error.stack,
        tableName
      });
      
      return {
        success: false,
        error: error.message,
        tableName: tableName,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 批量优化所有表的索引
   * @returns {Promise<Object>} 批量优化结果
   */
  async optimizeAllTables() {
    try {
      // 获取所有用户表
      const tablesQuery = `
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_TYPE = 'BASE TABLE'
      `;
      
      const tables = await executeQuery(tablesQuery);
      
      const results = [];
      
      // 优化每个表的索引
      for (const table of tables) {
        try {
          const result = await this.optimizeTableIndexes(table.TABLE_NAME);
          results.push(result);
        } catch (error) {
          logger.error('批量优化表索引失败', {
            message: error.message,
            stack: error.stack,
            tableName: table.TABLE_NAME
          });
          
          results.push({
            success: false,
            error: error.message,
            tableName: table.TABLE_NAME,
            timestamp: new Date().toISOString()
          });
        }
      }
      
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      logger.info('批量索引优化完成', {
        total: results.length,
        successful: successful,
        failed: failed
      });
      
      return {
        success: true,
        results: results,
        summary: {
          total: results.length,
          successful: successful,
          failed: failed
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('批量优化所有表索引失败', {
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

  /**
   * 删除未使用的索引
   * @param {string} tableName - 表名
   * @returns {Promise<Object>} 删除结果
   */
  async removeUnusedIndexes(tableName) {
    try {
      // 这是一个简化的实现，实际应用中需要更复杂的分析
      // 可以通过查询性能模式表来识别未使用的索引
      
      const query = `
        SELECT 
          INDEX_NAME,
          COLUMN_NAME
        FROM information_schema.STATISTICS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = ?
        AND INDEX_NAME != 'PRIMARY'
      `;
      
      const indexes = await executeQuery(query, [tableName]);
      
      // 在实际应用中，这里应该分析索引使用情况
      // 目前我们只是返回索引列表作为参考
      return {
        tableName: tableName,
        indexes: indexes,
        message: '索引分析完成，请手动确认是否需要删除',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('分析未使用索引失败', {
        message: error.message,
        stack: error.stack,
        tableName
      });
      
      return {
        success: false,
        error: error.message,
        tableName: tableName,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 获取索引性能建议
   * @param {string} tableName - 表名
   * @returns {Promise<Object>} 性能建议
   */
  async getIndexPerformanceAdvice(tableName) {
    try {
      const existingIndexes = await this.getExistingIndexes(tableName);
      const queryPatterns = await this.analyzeQueryPatterns(tableName);
      
      const advice = [];
      
      // 检查是否有过多的索引
      if (existingIndexes.length > 10) {
        advice.push({
          type: 'too_many_indexes',
          message: `表 ${tableName} 有 ${existingIndexes.length} 个索引，可能影响写入性能`,
          recommendation: '考虑删除不常用的索引'
        });
      }
      
      // 检查是否有重复的索引
      const indexColumns = {};
      existingIndexes.forEach(index => {
        const columnsKey = index.columns.join(',');
        if (indexColumns[columnsKey]) {
          advice.push({
            type: 'duplicate_index',
            message: `发现重复索引: ${index.name} 和 ${indexColumns[columnsKey]}`,
            recommendation: '删除重复的索引'
          });
        } else {
          indexColumns[columnsKey] = index.name;
        }
      });
      
      return {
        tableName: tableName,
        advice: advice,
        existingIndexes: existingIndexes,
        queryPatterns: queryPatterns,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('获取索引性能建议失败', {
        message: error.message,
        stack: error.stack,
        tableName
      });
      
      return {
        tableName: tableName,
        advice: [],
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = IndexOptimizer;