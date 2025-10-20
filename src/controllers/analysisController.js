/**
 * 数据分析和可视化功能控制器
 */

const TradeAnalysis = require('../models/TradeAnalysis');
const PortfolioAnalysis = require('../models/PortfolioAnalysis');
const RiskAnalysis = require('../models/RiskAnalysis');
const MarketPrediction = require('../models/MarketPrediction');
const { BusinessError, ValidationError } = require('../middleware/enhancedErrorHandler');
const logger = require('../utils/logger');

/**
 * 获取交易数据分析
 */
exports.getTradeAnalysis = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 验证参数
    if (!userId) {
      throw new ValidationError('缺少必要参数: userId');
    }
    
    // 获取交易统计数据
    const tradeStats = await TradeAnalysis.getUserTradeStats(userId);
    const profitStats = await TradeAnalysis.getUserProfitStats(userId);
    const assetDistribution = await TradeAnalysis.getUserAssetDistribution(userId);
    const timeDistribution = await TradeAnalysis.getUserTimeDistribution(userId);
    
    // 计算关键指标
    const winRate = await TradeAnalysis.calculateWinRate(profitStats.winning_trades, tradeStats.total_trades);
    const profitFactor = await TradeAnalysis.calculateProfitFactor(profitStats.total_profit, profitStats.total_loss);
    
    const analysis = {
      trade_stats: tradeStats,
      profit_stats: profitStats,
      asset_distribution: assetDistribution,
      time_distribution: timeDistribution,
      key_metrics: {
        win_rate: parseFloat(winRate.toFixed(2)),
        profit_factor: parseFloat(profitFactor.toFixed(2)),
        total_trades: tradeStats.total_trades,
        winning_trades: profitStats.winning_trades,
        losing_trades: profitStats.losing_trades
      }
    };
    
    // 记录日志
    logger.info('交易数据分析完成', {
      userId,
      totalTrades: tradeStats.total_trades
    });
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    logger.error('交易数据分析失败', {
      message: error.message,
      stack: error.stack,
      params: req.params
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`交易数据分析失败: ${error.message}`);
  }
};

/**
 * 获取投资组合分析
 */
exports.getPortfolioAnalysis = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 验证参数
    if (!userId) {
      throw new ValidationError('缺少必要参数: userId');
    }
    
    // 获取投资组合数据
    const positions = await PortfolioAnalysis.getCurrentPositions(userId);
    const portfolioValue = await PortfolioAnalysis.calculatePortfolioValue(userId);
    const assetAllocation = await PortfolioAnalysis.getAssetAllocation(userId);
    const portfolioRisk = await PortfolioAnalysis.calculatePortfolioRisk(userId);
    
    const analysis = {
      positions: positions,
      portfolio_value: portfolioValue,
      asset_allocation: assetAllocation,
      portfolio_risk: portfolioRisk
    };
    
    // 记录日志
    logger.info('投资组合分析完成', {
      userId,
      portfolioValue: portfolioValue.total_value
    });
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    logger.error('投资组合分析失败', {
      message: error.message,
      stack: error.stack,
      params: req.params
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`投资组合分析失败: ${error.message}`);
  }
};

/**
 * 获取收益风险分析
 */
exports.getRiskAnalysis = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 验证参数
    if (!userId) {
      throw new ValidationError('缺少必要参数: userId');
    }
    
    // 获取风险分析数据
    const riskOverview = await RiskAnalysis.getRiskOverview(userId);
    const sharpeRatio = await RiskAnalysis.calculateSharpeRatio(userId);
    const maxDrawdown = await RiskAnalysis.calculateMaxDrawdown(userId);
    const varValue = await RiskAnalysis.calculateVaR(userId);
    
    const analysis = {
      risk_overview: riskOverview,
      sharpe_ratio: parseFloat(sharpeRatio.toFixed(4)),
      max_drawdown: parseFloat(maxDrawdown.toFixed(2)),
      value_at_risk: parseFloat(varValue.toFixed(4))
    };
    
    // 记录日志
    logger.info('收益风险分析完成', {
      userId,
      sharpeRatio: analysis.sharpe_ratio
    });
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    logger.error('收益风险分析失败', {
      message: error.message,
      stack: error.stack,
      params: req.params
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`收益风险分析失败: ${error.message}`);
  }
};

/**
 * 获取市场趋势预测
 */
exports.getMarketPrediction = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // 验证参数
    if (!symbol) {
      throw new ValidationError('缺少必要参数: symbol');
    }
    
    // 获取市场预测数据
    const prediction = await MarketPrediction.getComprehensivePrediction(symbol);
    
    // 记录日志
    logger.info('市场趋势预测完成', {
      symbol,
      confidence: prediction.confidence
    });
    
    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    logger.error('市场趋势预测失败', {
      message: error.message,
      stack: error.stack,
      params: req.params
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`市场趋势预测失败: ${error.message}`);
  }
};

/**
 * 获取预测对比分析
 */
exports.getPredictionComparison = async (req, res) => {
  try {
    const { symbols } = req.query;
    
    // 验证参数
    if (!symbols) {
      throw new ValidationError('缺少必要参数: symbols');
    }
    
    // 解析符号列表
    const symbolArray = symbols.split(',');
    
    // 获取预测对比数据
    const predictions = await MarketPrediction.getPredictionComparison(symbolArray);
    
    res.json({
      success: true,
      data: predictions
    });
  } catch (error) {
    logger.error('预测对比分析失败', {
      message: error.message,
      stack: error.stack,
      query: req.query
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`预测对比分析失败: ${error.message}`);
  }
};

/**
 * 获取热门资产分析
 */
exports.getPopularAssets = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // 获取热门资产数据
    const popularAssets = await TradeAnalysis.getPopularAssets(parseInt(limit));
    
    res.json({
      success: true,
      data: popularAssets,
      limit: parseInt(limit)
    });
  } catch (error) {
    logger.error('热门资产分析失败', {
      message: error.message,
      stack: error.stack,
      query: req.query
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`热门资产分析失败: ${error.message}`);
  }
};

/**
 * 导出分析报告
 */
exports.exportAnalysisReport = async (req, res) => {
  try {
    const { userId, format = 'json' } = req.body;
    
    // 验证参数
    if (!userId) {
      throw new ValidationError('缺少必要参数: userId');
    }
    
    // 获取所有分析数据
    const tradeStats = await TradeAnalysis.getUserTradeStats(userId);
    const profitStats = await TradeAnalysis.getUserProfitStats(userId);
    const positions = await PortfolioAnalysis.getCurrentPositions(userId);
    const portfolioValue = await PortfolioAnalysis.calculatePortfolioValue(userId);
    const riskOverview = await RiskAnalysis.getRiskOverview(userId);
    
    const report = {
      generated_at: new Date(),
      user_id: userId,
      trade_analysis: {
        trade_stats: tradeStats,
        profit_stats: profitStats
      },
      portfolio_analysis: {
        positions: positions,
        portfolio_value: portfolioValue
      },
      risk_analysis: {
        risk_overview: riskOverview
      }
    };
    
    // 根据格式返回数据
    if (format === 'csv') {
      // 生成CSV格式报告
      let csvContent = '分析报告生成时间: ' + report.generated_at.toISOString() + '\n\n';
      csvContent += '交易统计:\n';
      csvContent += `总交易数,买入交易数,卖出交易数\n`;
      csvContent += `${tradeStats.total_trades},${tradeStats.buy_trades},${tradeStats.sell_trades}\n\n`;
      
      csvContent += '盈亏统计:\n';
      csvContent += `盈利交易数,亏损交易数,总盈利,总亏损\n`;
      csvContent += `${profitStats.winning_trades},${profitStats.losing_trades},${profitStats.total_profit},${profitStats.total_loss}\n\n`;
      
      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', `attachment; filename="analysis_report_${userId}.csv"`);
      res.send(csvContent);
    } else {
      // 默认返回JSON格式
      res.json({
        success: true,
        data: report
      });
    }
    
    // 记录日志
    logger.info('分析报告导出完成', {
      userId,
      format
    });
  } catch (error) {
    logger.error('分析报告导出失败', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`分析报告导出失败: ${error.message}`);
  }
};