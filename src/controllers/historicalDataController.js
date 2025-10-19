const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');

/**
 * 历史数据控制器
 * 提供历史市场数据的API接口
 */
class HistoricalDataController {
  /**
   * 获取所有资产的历史数据
   */
  static async getAllHistoricalData(req, res) {
    try {
      const filePath = path.join(config.dataPath, 'market.json');
      const data = await fs.readFile(filePath, 'utf8');
      const marketData = JSON.parse(data);
      
      // 只返回历史数据部分
      const historicalData = {};
      for (const [symbol, assetData] of Object.entries(marketData)) {
        historicalData[symbol] = {
          name: assetData.name,
          history: assetData.history
        };
      }
      
      res.json(historicalData);
    } catch (error) {
      res.status(500).json({ error: '获取历史数据失败', details: error.message });
    }
  }

  /**
   * 获取特定资产的历史数据
   */
  static async getAssetHistoricalData(req, res) {
    try {
      const { asset } = req.params;
      const filePath = path.join(config.dataPath, 'market.json');
      const data = await fs.readFile(filePath, 'utf8');
      const marketData = JSON.parse(data);
      
      if (!marketData[asset]) {
        return res.status(404).json({ error: '资产不存在' });
      }
      
      res.json({
        symbol: asset,
        name: marketData[asset].name,
        history: marketData[asset].history
      });
    } catch (error) {
      res.status(500).json({ error: '获取资产历史数据失败', details: error.message });
    }
  }

  /**
   * 获取特定时间范围的历史数据
   */
  static async getHistoricalDataByDateRange(req, res) {
    try {
      const { asset } = req.params;
      const { start, end } = req.query;
      
      const filePath = path.join(config.dataPath, 'market.json');
      const data = await fs.readFile(filePath, 'utf8');
      const marketData = JSON.parse(data);
      
      if (!marketData[asset]) {
        return res.status(404).json({ error: '资产不存在' });
      }
      
      let filteredHistory = marketData[asset].history;
      
      // 如果提供了开始时间，过滤数据
      if (start) {
        const startDate = new Date(start);
        filteredHistory = filteredHistory.filter(item => 
          new Date(item.timestamp) >= startDate
        );
      }
      
      // 如果提供了结束时间，过滤数据
      if (end) {
        const endDate = new Date(end);
        filteredHistory = filteredHistory.filter(item => 
          new Date(item.timestamp) <= endDate
        );
      }
      
      res.json({
        symbol: asset,
        name: marketData[asset].name,
        history: filteredHistory
      });
    } catch (error) {
      res.status(500).json({ error: '获取时间范围历史数据失败', details: error.message });
    }
  }

  /**
   * 获取最新的市场数据（当前价格）
   */
  static async getCurrentMarketData(req, res) {
    try {
      const filePath = path.join(config.dataPath, 'market.json');
      const data = await fs.readFile(filePath, 'utf8');
      const marketData = JSON.parse(data);
      
      // 只返回当前价格信息
      const currentData = {};
      for (const [symbol, assetData] of Object.entries(marketData)) {
        currentData[symbol] = {
          name: assetData.name,
          price: assetData.price,
          lastUpdate: assetData.lastUpdate
        };
      }
      
      res.json(currentData);
    } catch (error) {
      res.status(500).json({ error: '获取当前市场数据失败', details: error.message });
    }
  }
}

module.exports = HistoricalDataController;