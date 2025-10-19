const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');

class Config {
  // 获取所有配置
  static async getAll() {
    const filePath = path.join(config.dataPath, 'configs.json');
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // 如果文件不存在，返回默认配置
      return {
        tradingFee: 0.001,
        minTradeAmount: 10,
        maxLeverage: 10,
        maintenanceTime: []
      };
    }
  }

  // 获取特定配置项
  static async get(key) {
    const allConfig = await this.getAll();
    return allConfig[key];
  }

  // 设置特定配置项
  static async set(key, value) {
    const filePath = path.join(config.dataPath, 'configs.json');
    
    try {
      // 获取现有配置
      let allConfig = {};
      try {
        const data = await fs.readFile(filePath, 'utf8');
        allConfig = JSON.parse(data);
      } catch (error) {
        // 如果文件不存在，使用空对象
        allConfig = {};
      }
      
      // 更新配置项
      allConfig[key] = value;
      
      // 写入文件
      await fs.writeFile(filePath, JSON.stringify(allConfig, null, 2));
      
      return allConfig;
    } catch (error) {
      throw new Error(`设置配置项失败: ${error.message}`);
    }
  }

  // 更新多个配置项
  static async update(updates) {
    const filePath = path.join(config.dataPath, 'configs.json');
    
    try {
      // 获取现有配置
      let allConfig = {};
      try {
        const data = await fs.readFile(filePath, 'utf8');
        allConfig = JSON.parse(data);
      } catch (error) {
        // 如果文件不存在，使用空对象
        allConfig = {};
      }
      
      // 更新配置项
      Object.keys(updates).forEach(key => {
        allConfig[key] = updates[key];
      });
      
      // 写入文件
      await fs.writeFile(filePath, JSON.stringify(allConfig, null, 2));
      
      return allConfig;
    } catch (error) {
      throw new Error(`更新配置失败: ${error.message}`);
    }
  }
}

module.exports = Config;