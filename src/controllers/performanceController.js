const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');
const logger = require('../utils/logger');

class PerformanceController {
  constructor() {
    // 绑定方法以确保正确的this上下文
    this.collectMetrics = this.collectMetrics.bind(this);
    this.saveMetricsToFile = this.saveMetricsToFile.bind(this);
    this.getPerformanceReport = this.getPerformanceReport.bind(this);
    this.generatePerformanceReport = this.generatePerformanceReport.bind(this);
  }

  /**
   * 接收前端性能数据
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  async collectMetrics(req, res) {
    try {
      console.log('收到性能数据请求:', req.body);
      const metrics = req.body;
      const userId = req.headers['x-user-id'] || 'anonymous';
      
      // 添加时间戳和用户信息
      const metricData = {
        timestamp: new Date().toISOString(),
        userId,
        userAgent: req.headers['user-agent'],
        metrics
      };
      
      console.log('准备保存的性能数据:', metricData);
      
      // 保存到文件
      await this.saveMetricsToFile(metricData);
      
      // 记录日志
      logger.info('性能数据收集成功', {
        userId,
        metricCount: Object.keys(metrics).length
      });
      
      res.status(200).json({
        success: true,
        message: '性能数据收集成功'
      });
    } catch (error) {
      console.error('性能数据收集失败:', error);
      logger.error('性能数据收集失败', {
        message: error.message,
        stack: error.stack
      });
      
      res.status(500).json({
        success: false,
        message: '性能数据收集失败: ' + error.message
      });
    }
  }
  
  /**
   * 保存性能数据到文件
   * @param {Object} metricData - 性能数据
   */
  async saveMetricsToFile(metricData) {
    try {
      console.log('开始保存性能数据到文件');
      console.log('配置数据路径:', config.dataPath);
      
      const metricsDir = path.join(config.dataPath, 'metrics');
      console.log('指标目录路径:', metricsDir);
      
      // 确保目录存在
      await fs.mkdir(metricsDir, { recursive: true });
      console.log('目录创建成功或已存在');
      
      // 生成文件名（按日期分组）
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `performance-${dateStr}.json`;
      const filePath = path.join(metricsDir, fileName);
      console.log('文件路径:', filePath);
      
      // 读取现有数据
      let existingData = [];
      try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        existingData = JSON.parse(fileContent);
        console.log('读取现有数据成功，现有数据条数:', existingData.length);
      } catch (error) {
        console.log('文件不存在或解析失败，使用空数组:', error.message);
        // 文件不存在或解析失败，使用空数组
        existingData = [];
      }
      
      // 添加新数据
      existingData.push(metricData);
      console.log('添加新数据后，数据条数:', existingData.length);
      
      // 保存数据（保留最近1000条记录）
      const dataToSave = existingData.slice(-1000);
      console.log('准备保存的数据条数:', dataToSave.length);
      await fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2));
      console.log('数据保存成功');
    } catch (error) {
      console.error('保存性能数据到文件失败:', error);
      logger.error('保存性能数据到文件失败', {
        message: error.message,
        stack: error.stack
      });
      throw new Error('保存性能数据到文件失败: ' + error.message);
    }
  }
  
  /**
   * 获取性能报告
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  async getPerformanceReport(req, res) {
    try {
      const { date } = req.query;
      const targetDate = date || new Date().toISOString().split('T')[0];
      
      const metricsDir = path.join(config.dataPath, 'metrics');
      const fileName = `performance-${targetDate}.json`;
      const filePath = path.join(metricsDir, fileName);
      
      // 读取数据
      let metricsData = [];
      try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        metricsData = JSON.parse(fileContent);
      } catch (error) {
        // 文件不存在，返回空数组
        metricsData = [];
      }
      
      // 生成报告
      const report = this.generatePerformanceReport(metricsData);
      
      res.status(200).json({
        success: true,
        data: report
      });
    } catch (error) {
      logger.error('获取性能报告失败', {
        message: error.message,
        stack: error.stack
      });
      
      res.status(500).json({
        success: false,
        message: '获取性能报告失败: ' + error.message
      });
    }
  }
  
  /**
   * 生成性能报告
   * @param {Array} metricsData - 性能数据数组
   * @returns {Object} 性能报告
   */
  generatePerformanceReport(metricsData) {
    if (metricsData.length === 0) {
      return {
        totalMetrics: 0,
        averageMetrics: {},
        trends: {}
      };
    }
    
    // 计算平均指标
    const metricSums = {};
    const metricCounts = {};
    
    metricsData.forEach(metric => {
      Object.keys(metric.metrics).forEach(key => {
        if (typeof metric.metrics[key] === 'number') {
          if (!metricSums[key]) {
            metricSums[key] = 0;
            metricCounts[key] = 0;
          }
          metricSums[key] += metric.metrics[key];
          metricCounts[key] += 1;
        }
      });
    });
    
    const averageMetrics = {};
    Object.keys(metricSums).forEach(key => {
      averageMetrics[key] = metricSums[key] / metricCounts[key];
    });
    
    // 计算趋势（最近10条记录的平均值对比之前10条记录）
    const recentData = metricsData.slice(-10);
    const previousData = metricsData.slice(-20, -10);
    
    const trends = {};
    Object.keys(averageMetrics).forEach(key => {
      if (recentData.length > 0 && previousData.length > 0) {
        const recentSum = recentData.reduce((sum, metric) => {
          return sum + (metric.metrics[key] || 0);
        }, 0);
        const recentAvg = recentSum / recentData.length;
        
        const previousSum = previousData.reduce((sum, metric) => {
          return sum + (metric.metrics[key] || 0);
        }, 0);
        const previousAvg = previousSum / previousData.length;
        
        trends[key] = {
          recent: recentAvg,
          previous: previousAvg,
          change: recentAvg - previousAvg,
          changePercent: previousAvg !== 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0
        };
      }
    });
    
    return {
      totalMetrics: metricsData.length,
      averageMetrics,
      trends,
      dateRange: {
        start: metricsData[0]?.timestamp,
        end: metricsData[metricsData.length - 1]?.timestamp
      }
    };
  }
}

module.exports = new PerformanceController();