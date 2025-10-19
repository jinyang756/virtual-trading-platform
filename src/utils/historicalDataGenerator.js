const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');

/**
 * 历史数据生成器
 * 生成从2025年8月1日开始的虚拟市场数据
 */
class HistoricalDataGenerator {
  constructor() {
    // 定义交易资产
    this.assets = [
      { symbol: 'BTCUSD', name: '比特币/美元', basePrice: 45000 },
      { symbol: 'ETHUSD', name: '以太坊/美元', basePrice: 2500 },
      { symbol: 'XAUUSD', name: '黄金/美元', basePrice: 1900 },
      { symbol: 'USOIL', name: '原油', basePrice: 80 },
      { symbol: 'NAS100', name: '纳斯达克100', basePrice: 16000 },
      { symbol: 'SPX500', name: '标普500', basePrice: 4500 }
    ];
    
    // 定义时间范围
    this.startDate = new Date('2025-08-01T00:00:00.000Z');
    this.endDate = new Date(); // 当前日期
  }

  /**
   * 生成单个资产的历史价格数据
   * @param {Object} asset - 资产信息
   * @param {Date} startDate - 开始日期
   * @param {Date} endDate - 结束日期
   * @returns {Array} 历史价格数据
   */
  generateAssetHistory(asset, startDate, endDate) {
    const history = [];
    let currentDate = new Date(startDate);
    let currentPrice = asset.basePrice;
    
    // 生成每小时的数据点
    while (currentDate <= endDate) {
      // 随机波动（±2%）
      const volatility = (Math.random() * 0.04 - 0.02);
      currentPrice = currentPrice * (1 + volatility);
      
      // 确保价格为正数
      currentPrice = Math.max(currentPrice, 0.01);
      
      history.push({
        price: parseFloat(currentPrice.toFixed(2)),
        timestamp: new Date(currentDate).toISOString()
      });
      
      // 增加1小时
      currentDate.setHours(currentDate.getHours() + 1);
    }
    
    return history;
  }

  /**
   * 生成所有资产的历史数据
   * @returns {Object} 包含所有资产历史数据的对象
   */
  async generateHistoricalData() {
    const marketData = {};
    
    for (const asset of this.assets) {
      console.log(`正在生成 ${asset.name} 的历史数据...`);
      
      // 生成历史数据
      const history = this.generateAssetHistory(asset, this.startDate, this.endDate);
      
      // 获取最新价格（最后一个数据点）
      const latestPrice = history.length > 0 ? history[history.length - 1].price : asset.basePrice;
      
      marketData[asset.symbol] = {
        name: asset.name,
        price: parseFloat(latestPrice.toFixed(2)),
        history: history,
        lastUpdate: new Date().toISOString()
      };
      
      console.log(`完成生成 ${asset.name} 的历史数据，共 ${history.length} 条记录`);
    }
    
    return marketData;
  }

  /**
   * 保存历史数据到文件
   * @param {Object} marketData - 市场数据
   */
  async saveHistoricalData(marketData) {
    const filePath = path.join(config.dataPath, 'market.json');
    
    try {
      await fs.writeFile(filePath, JSON.stringify(marketData, null, 2));
      console.log('历史数据已保存到 market.json');
    } catch (error) {
      throw new Error(`保存历史数据失败: ${error.message}`);
    }
  }

  /**
   * 生成并保存历史数据
   */
  async generateAndSave() {
    try {
      console.log('开始生成历史数据...');
      console.log(`时间范围: ${this.startDate.toISOString()} 到 ${this.endDate.toISOString()}`);
      
      const marketData = await this.generateHistoricalData();
      await this.saveHistoricalData(marketData);
      
      console.log('历史数据生成完成!');
      return marketData;
    } catch (error) {
      console.error('生成历史数据时出错:', error);
      throw error;
    }
  }
}

module.exports = HistoricalDataGenerator;