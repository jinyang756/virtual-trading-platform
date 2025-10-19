const tradingEngine = require('../engine');

// 获取合约市场数据
exports.getContractMarketData = (req, res) => {
  try {
    const { symbolId } = req.params;
    const marketData = tradingEngine.getContractMarketData(symbolId);
    
    if (marketData.error) {
      return res.status(404).json({ error: marketData.error });
    }
    
    res.json(marketData);
  } catch (error) {
    res.status(500).json({ error: '获取市场数据失败', details: error.message });
  }
};

// 获取所有合约市场数据
exports.getAllContractMarketData = (req, res) => {
  try {
    const marketData = tradingEngine.getAllContractMarketData();
    res.json(marketData);
  } catch (error) {
    res.status(500).json({ error: '获取市场数据失败', details: error.message });
  }
};

// 下合约订单
exports.placeContractOrder = (req, res) => {
  try {
    const { userId, symbolId, direction, amount, leverage } = req.body;
    
    // 验证参数
    if (!userId || !symbolId || !direction || !amount) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    
    const result = tradingEngine.placeContractOrder(userId, symbolId, direction, amount, leverage);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: '下单失败', details: error.message });
  }
};

// 获取用户合约持仓
exports.getContractUserPositions = (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: '缺少用户ID' });
    }
    
    const positions = tradingEngine.getContractUserPositions(userId);
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: '获取持仓信息失败', details: error.message });
  }
};

// 获取合约订单历史
exports.getContractOrderHistory = (req, res) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: '缺少用户ID' });
    }
    
    const history = tradingEngine.getContractOrderHistory(userId, limit);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: '获取订单历史失败', details: error.message });
  }
};

// 获取合约价格历史
exports.getContractPriceHistory = (req, res) => {
  try {
    const { symbolId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!symbolId) {
      return res.status(400).json({ error: '缺少合约代码' });
    }
    
    const history = tradingEngine.getContractPriceHistory(symbolId, startDate, endDate);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: '获取价格历史失败', details: error.message });
  }
};

// 计算合约投资组合价值
exports.calculateContractPortfolioValue = (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: '缺少用户ID' });
    }
    
    const portfolio = tradingEngine.calculateContractPortfolioValue(userId);
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: '计算投资组合价值失败', details: error.message });
  }
};