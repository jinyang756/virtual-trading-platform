const tradingEngine = require('../engine');

// 获取基金信息
exports.getFundInfo = (req, res) => {
  try {
    const { fundId } = req.params;
    const fundInfo = tradingEngine.getFundInfo(fundId);
    
    if (fundInfo.error) {
      return res.status(404).json({ error: fundInfo.error });
    }
    
    res.json(fundInfo);
  } catch (error) {
    res.status(500).json({ error: '获取基金信息失败', details: error.message });
  }
};

// 获取所有基金信息
exports.getAllFunds = (req, res) => {
  try {
    const funds = tradingEngine.getAllFunds();
    res.json(funds);
  } catch (error) {
    res.status(500).json({ error: '获取基金信息失败', details: error.message });
  }
};

// 认购基金
exports.subscribeFund = (req, res) => {
  try {
    const { userId, fundId, amount } = req.body;
    
    // 验证参数
    if (!userId || !fundId || !amount) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    
    const result = tradingEngine.subscribeFund(userId, fundId, amount);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: '认购基金失败', details: error.message });
  }
};

// 赎回基金
exports.redeemFund = (req, res) => {
  try {
    const { userId, fundId, shares } = req.body;
    
    // 验证参数
    if (!userId || !fundId || !shares) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    
    const result = tradingEngine.redeemFund(userId, fundId, shares);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: '赎回基金失败', details: error.message });
  }
};

// 获取用户基金持仓
exports.getFundUserPositions = (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: '缺少用户ID' });
    }
    
    const positions = tradingEngine.getFundUserPositions(userId);
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: '获取基金持仓失败', details: error.message });
  }
};

// 获取基金交易历史
exports.getFundTransactionHistory = (req, res) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: '缺少用户ID' });
    }
    
    const history = tradingEngine.getFundTransactionHistory(userId, limit);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: '获取交易历史失败', details: error.message });
  }
};

// 获取基金净值历史
exports.getFundNavHistory = (req, res) => {
  try {
    const { fundId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!fundId) {
      return res.status(400).json({ error: '缺少基金代码' });
    }
    
    const history = tradingEngine.getFundNavHistory(fundId, startDate, endDate);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: '获取净值历史失败', details: error.message });
  }
};

// 计算基金表现
exports.calculateFundPerformance = (req, res) => {
  try {
    const { fundId } = req.params;
    
    if (!fundId) {
      return res.status(400).json({ error: '缺少基金代码' });
    }
    
    const performance = tradingEngine.calculateFundPerformance(fundId);
    
    if (performance.error) {
      return res.status(404).json({ error: performance.error });
    }
    
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: '计算基金表现失败', details: error.message });
  }
};