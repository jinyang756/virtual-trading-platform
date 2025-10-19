const tradingEngine = require('../engine');

// 获取所有市场数据
exports.getAllMarketData = (req, res) => {
  try {
    const marketData = tradingEngine.getAllMarketData();
    res.json(marketData);
  } catch (error) {
    res.status(500).json({ error: '获取市场数据失败', details: error.message });
  }
};

// 获取用户综合投资组合
exports.getUserPortfolio = (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: '缺少用户ID' });
    }
    
    const portfolio = tradingEngine.getUserPortfolio(userId);
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: '获取投资组合失败', details: error.message });
  }
};

// 获取用户所有持仓
exports.getUserAllPositions = (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: '缺少用户ID' });
    }
    
    const positions = tradingEngine.getUserAllPositions(userId);
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: '获取持仓信息失败', details: error.message });
  }
};

// 获取用户所有订单历史
exports.getUserAllOrderHistory = (req, res) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: '缺少用户ID' });
    }
    
    const history = tradingEngine.getUserAllOrderHistory(userId, limit);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: '获取订单历史失败', details: error.message });
  }
};