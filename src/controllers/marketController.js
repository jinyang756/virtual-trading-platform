const MarketData = require('../models/MarketData');

// 获取市场数据
exports.getMarketData = async (req, res) => {
  try {
    const marketData = await MarketData.getAll();
    res.json(marketData);
  } catch (error) {
    res.status(500).json({ error: '获取市场数据失败', details: error.message });
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