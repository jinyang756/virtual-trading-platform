const tradingEngine = require('../engine');

// 获取二元期权策略
exports.getBinaryStrategies = (req, res) => {
  try {
    const strategies = tradingEngine.getBinaryStrategies();
    res.json(strategies);
  } catch (error) {
    res.status(500).json({ error: '获取策略信息失败', details: error.message });
  }
};

// 获取当前市场趋势
exports.getCurrentTrend = (req, res) => {
  try {
    const trend = tradingEngine.getCurrentTrend();
    res.json(trend);
  } catch (error) {
    res.status(500).json({ error: '获取市场趋势失败', details: error.message });
  }
};

// 下二元期权订单
exports.placeBinaryOrder = (req, res) => {
  try {
    const { userId, strategyId, direction, investment } = req.body;
    
    // 验证参数
    if (!userId || !strategyId || !direction || !investment) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    
    const result = tradingEngine.placeBinaryOrder(userId, strategyId, direction, investment);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: '下单失败', details: error.message });
  }
};

// 获取用户活跃订单
exports.getBinaryActiveOrders = (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: '缺少用户ID' });
    }
    
    const orders = tradingEngine.getBinaryActiveOrders(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: '获取活跃订单失败', details: error.message });
  }
};

// 获取二元期权订单历史
exports.getBinaryOrderHistory = (req, res) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: '缺少用户ID' });
    }
    
    const history = tradingEngine.getBinaryOrderHistory(userId, limit);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: '获取订单历史失败', details: error.message });
  }
};

// 获取二元期权统计
exports.getBinaryStatistics = (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: '缺少用户ID' });
    }
    
    const stats = tradingEngine.getBinaryStatistics(userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: '获取统计信息失败', details: error.message });
  }
};

// 获取二元期权历史统计
exports.getBinaryHistoricalStatistics = (req, res) => {
  try {
    // 从查询参数获取日期
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    
    console.log('获取二元期权历史统计数据:', { startDate, endDate });
    
    const stats = tradingEngine.getBinaryHistoricalStatistics(startDate, endDate);
    
    console.log('返回的历史统计数据条数:', Object.keys(stats).length);
    
    res.json(stats);
  } catch (error) {
    console.error('获取历史统计信息失败:', error);
    res.status(500).json({ error: '获取历史统计信息失败', details: error.message });
  }
};