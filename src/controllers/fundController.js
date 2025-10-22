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

// 获取基金详情（模拟数据）
exports.getFundDetail = (req, res) => {
  try {
    const { fundId } = req.params;
    
    // 获取基金基本信息
    const fundInfo = tradingEngine.getFundInfo(fundId);
    
    if (fundInfo.error) {
      return res.status(404).json({ error: fundInfo.error });
    }
    
    // 模拟基金详情数据
    const fundDetails = {
      fund_id: fundId,
      manager: getFundManager(fundId),
      strategy: getFundStrategy(fundId),
      fee_rate: getFundFeeRate(fundId),
      open_status: getFundOpenStatus(fundId)
    };
    
    res.json(fundDetails);
  } catch (error) {
    res.status(500).json({ error: '获取基金详情失败', details: error.message });
  }
};

// 获取基金市场观点（模拟数据）
exports.getFundInsights = (req, res) => {
  try {
    const { fundId } = req.params;
    
    // 获取基金基本信息
    const fundInfo = tradingEngine.getFundInfo(fundId);
    
    if (fundInfo.error) {
      return res.status(404).json({ error: fundInfo.error });
    }
    
    // 模拟市场观点数据
    const insights = getFundInsightsData(fundId);
    
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: '获取基金市场观点失败', details: error.message });
  }
};

// 辅助函数：获取基金经理
function getFundManager(fundId) {
  const managers = {
    "FUND_K8": "李量",
    "FUND_A1": "张银河",
    "FUND_FIRE": "王萤火",
    "FUND_QUANT": "陈量化",
    "FUND_STABLE": "刘稳健",
    "FUND_GROWTH": "赵成长",
    "FUND_BALANCED": "孙平衡"
  };
  
  return managers[fundId] || "未知经理";
}

// 辅助函数：获取投资策略
function getFundStrategy(fundId) {
  const strategies = {
    "FUND_K8": "量化多因子对冲",
    "FUND_A1": "宏观对冲策略",
    "FUND_FIRE": "量化选股策略",
    "FUND_QUANT": "指数增强策略",
    "FUND_STABLE": "固定收益策略",
    "FUND_GROWTH": "成长股投资策略",
    "FUND_BALANCED": "股债平衡策略"
  };
  
  return strategies[fundId] || "未知策略";
}

// 辅助函数：获取费率结构
function getFundFeeRate(fundId) {
  const feeRates = {
    "FUND_K8": "管理费: 1.5% + 业绩报酬: 20%",
    "FUND_A1": "管理费: 2.0% + 业绩报酬: 25%",
    "FUND_FIRE": "管理费: 1.0% + 业绩报酬: 15%",
    "FUND_QUANT": "管理费: 0.8% + 业绩报酬: 10%",
    "FUND_STABLE": "管理费: 1.2% + 业绩报酬: 8%",
    "FUND_GROWTH": "管理费: 1.8% + 业绩报酬: 15%",
    "FUND_BALANCED": "管理费: 1.5% + 业绩报酬: 12%"
  };
  
  return feeRates[fundId] || "未知费率";
}

// 辅助函数：获取开放状态
function getFundOpenStatus(fundId) {
  // 这里可以基于日期或其他条件动态判断
  return "开放认购";
}

// 辅助函数：获取市场观点数据
function getFundInsightsData(fundId) {
  const insights = {
    "FUND_K8": [
      {
        title: "量化策略在震荡市中的优势",
        content: "近期市场波动加剧，量化模型通过分散投资和风险控制表现出色。",
        date: "2025-10-19"
      },
      {
        title: "政策红利对量化投资的积极影响",
        content: "监管政策的持续优化为量化投资提供了更好的发展环境。",
        date: "2025-10-15"
      }
    ],
    "FUND_A1": [
      {
        title: "宏观对冲策略应对市场不确定性",
        content: "在全球经济不确定性增加的背景下，宏观对冲策略展现出良好的风险收益特征。",
        date: "2025-10-18"
      }
    ],
    "FUND_FIRE": [
      {
        title: "量化选股模型的最新优化",
        content: "通过引入更多维度的数据，我们的选股模型在近期表现持续提升。",
        date: "2025-10-17"
      }
    ]
  };
  
  return insights[fundId] || [];
}