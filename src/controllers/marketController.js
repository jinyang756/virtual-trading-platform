const MarketData = require('../models/MarketData');
const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');

// 获取市场数据
exports.getMarketData = async (req, res) => {
  try {
    const marketData = await MarketData.getAll();
    res.json(marketData);
  } catch (error) {
    res.status(500).json({ error: '获取市场数据失败', details: error.message });
  }
};

// 获取市场资产列表
exports.getMarketList = async (req, res) => {
  try {
    const { type } = req.query;
    
    // 读取基金数据
    const fundsPath = path.join(config.dataPath, 'funds.json');
    let funds = [];
    try {
      const fundsData = await fs.readFile(fundsPath, 'utf8');
      funds = JSON.parse(fundsData);
    } catch (error) {
      console.warn('无法读取基金数据:', error.message);
    }

    // 读取合约数据
    const contractsPath = path.join(config.dataPath, 'contracts.json');
    let contracts = [];
    try {
      const contractsData = await fs.readFile(contractsPath, 'utf8');
      contracts = JSON.parse(contractsData);
    } catch (error) {
      console.warn('无法读取合约数据:', error.message);
    }

    // 读取期权数据
    const optionsPath = path.join(config.dataPath, 'options.json');
    let options = [];
    try {
      const optionsData = await fs.readFile(optionsPath, 'utf8');
      options = JSON.parse(optionsData);
    } catch (error) {
      console.warn('无法读取期权数据:', error.message);
    }

    // 整合所有数据
    let marketList = [
      ...funds.map(fund => ({
        id: fund.id,
        name: fund.name,
        code: fund.code,
        price: fund.nav,
        change: fund.changePercent,
        type: '基金'
      })),
      ...contracts.map(contract => ({
        id: contract.id,
        name: contract.name,
        code: contract.symbol,
        price: contract.price,
        change: contract.changePercent,
        type: '合约'
      })),
      ...options.map(option => ({
        id: option.id,
        name: option.name,
        code: option.symbol,
        price: option.price,
        change: option.changePercent,
        type: '期权'
      }))
    ];

    // 如果指定了类型，则进行筛选
    if (type) {
      marketList = marketList.filter(item => item.type === type);
    }

    res.json(marketList);
  } catch (error) {
    res.status(500).json({ error: '获取市场资产列表失败', details: error.message });
  }
};

// 获取特定资产价格
exports.getPrice = async (req, res) => {
  try {
    const { asset } = req.params;
    const price = await MarketData.getPrice(asset);
    
    if (price === undefined) {
      return res.status(404).json({ error: '资产不存在' });
    }
    
    res.json({ asset, price });
  } catch (error) {
    res.status(500).json({ error: '获取价格失败', details: error.message });
  }
};

// 获取市场趋势
exports.getMarketTrend = async (req, res) => {
  try {
    // 这里应该实现获取市场趋势的逻辑
    // 为简化起见，返回模拟数据
    const trend = {
      timestamp: new Date(),
      trend: 'up', // 或 'down', 'stable'
      change: 0.02 // 2% 的变化
    };
    
    res.json(trend);
  } catch (error) {
    res.status(500).json({ error: '获取市场趋势失败', details: error.message });
  }
};

// 获取历史数据
exports.getHistory = async (req, res) => {
  try {
    const { asset } = req.params;
    const history = await MarketData.getHistory(asset);
    
    if (history.length === 0) {
      return res.status(404).json({ error: '历史数据不存在' });
    }
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: '获取历史数据失败', details: error.message });
  }
};