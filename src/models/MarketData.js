const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');

class MarketData {
  // 获取所有市场数据
  static async getAll() {
    const filePath = path.join(config.dataPath, 'market.json');
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // 如果文件不存在，返回空对象
      return {};
    }
  }

  // 获取特定资产价格
  static async getPrice(asset) {
    const allData = await this.getAll();
    return allData[asset] ? allData[asset].price : undefined;
  }

  // 获取历史数据
  static async getHistory(asset) {
    const filePath = path.join(config.dataPath, 'market.json');
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const marketData = JSON.parse(data);
      
      if (!marketData[asset] || !marketData[asset].history) {
        return [];
      }
      
      return marketData[asset].history;
    } catch (error) {
      return [];
    }
  }

  // 更新市场数据
  static async update(asset, price, timestamp = new Date()) {
    const filePath = path.join(config.dataPath, 'market.json');
    
    try {
      // 获取现有数据
      let marketData = {};
      try {
        const data = await fs.readFile(filePath, 'utf8');
        marketData = JSON.parse(data);
      } catch (error) {
        // 如果文件不存在，使用空对象
        marketData = {};
      }
      
      // 初始化资产数据
      if (!marketData[asset]) {
        marketData[asset] = {
          price: price,
          history: []
        };
      } else {
        // 添加历史记录
        marketData[asset].history.push({
          price: marketData[asset].price,
          timestamp: marketData[asset].lastUpdate || new Date()
        });
        
        // 更新当前价格
        marketData[asset].price = price;
      }
      
      // 更新时间戳
      marketData[asset].lastUpdate = timestamp;
      
      // 保持历史记录在合理范围内（最多100条）
      if (marketData[asset].history.length > 100) {
        marketData[asset].history = marketData[asset].history.slice(-100);
      }
      
      // 写入文件
      await fs.writeFile(filePath, JSON.stringify(marketData, null, 2));
      
      return marketData[asset];
    } catch (error) {
      throw new Error(`更新市场数据失败: ${error.message}`);
    }
  }
}

module.exports = MarketData;