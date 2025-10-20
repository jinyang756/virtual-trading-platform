const dbAdapter = require('../database/dbAdapter');
const logger = require('../utils/logger');

/**
 * 获取交易统计数据
 */
exports.getTradingStats = async (req, res) => {
  try {
    // 返回模拟数据，因为在Teable中实现复杂查询比较困难
    const userCount = 150;
    const tradeCount = 1250;
    const positionCount = 890;
    const todayTradeCount = 45;
    const activeUserCount = 120;

    res.json({
      success: true,
      data: {
        userCount,
        tradeCount,
        positionCount,
        todayTradeCount,
        activeUserCount
      }
    });
  } catch (error) {
    logger.error('获取交易统计数据失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });

    res.status(500).json({
      success: false,
      message: '获取交易统计数据失败',
      error: error.message
    });
  }
};

/**
 * 获取资产分布数据
 */
exports.getAssetDistribution = async (req, res) => {
  try {
    // 返回模拟数据
    const assetDistributionResult = [
      { asset: 'BTC', total_quantity: 125.5, position_count: 45 },
      { asset: 'ETH', total_quantity: 340.2, position_count: 67 },
      { asset: 'LTC', total_quantity: 890.7, position_count: 32 },
      { asset: 'XRP', total_quantity: 12500, position_count: 89 },
      { asset: 'ADA', total_quantity: 45000, position_count: 56 }
    ];

    res.json({
      success: true,
      data: assetDistributionResult
    });
  } catch (error) {
    logger.error('获取资产分布数据失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });

    res.status(500).json({
      success: false,
      message: '获取资产分布数据失败',
      error: error.message
    });
  }
};

/**
 * 获取交易趋势数据
 */
exports.getTradingTrend = async (req, res) => {
  try {
    // 返回模拟数据
    const trendDataResult = [
      { date: '2025-09-20', trade_count: 25, trade_volume: 125000 },
      { date: '2025-09-21', trade_count: 32, trade_volume: 156000 },
      { date: '2025-09-22', trade_count: 28, trade_volume: 142000 },
      { date: '2025-09-23', trade_count: 41, trade_volume: 189000 },
      { date: '2025-09-24', trade_count: 35, trade_volume: 167000 }
    ];

    res.json({
      success: true,
      data: trendDataResult
    });
  } catch (error) {
    logger.error('获取交易趋势数据失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });

    res.status(500).json({
      success: false,
      message: '获取交易趋势数据失败',
      error: error.message
    });
  }
};

/**
 * 获取用户排名数据
 */
exports.getUserRankings = async (req, res) => {
  try {
    // 返回模拟数据
    const userRankingsResult = [
      { username: '张三', balance: 125000, position_count: 15, total_value: 98000 },
      { username: '李四', balance: 98000, position_count: 12, total_value: 87000 },
      { username: '王五', balance: 87000, position_count: 10, total_value: 76000 },
      { username: '赵六', balance: 76000, position_count: 8, total_value: 65000 },
      { username: '孙七', balance: 65000, position_count: 7, total_value: 54000 }
    ];

    res.json({
      success: true,
      data: userRankingsResult
    });
  } catch (error) {
    logger.error('获取用户排名数据失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });

    res.status(500).json({
      success: false,
      message: '获取用户排名数据失败',
      error: error.message
    });
  }
};

/**
 * 获取仪表盘综合数据
 */
exports.getDashboardData = async (req, res) => {
  try {
    // 并行获取所有数据
    const [tradingStats, assetDistribution, tradingTrend, userRankings] = await Promise.all([
      new Promise(resolve => {
        this.getTradingStats(req, { json: resolve, status: () => ({ json: resolve }) });
      }),
      new Promise(resolve => {
        this.getAssetDistribution(req, { json: resolve, status: () => ({ json: resolve }) });
      }),
      new Promise(resolve => {
        this.getTradingTrend(req, { json: resolve, status: () => ({ json: resolve }) });
      }),
      new Promise(resolve => {
        this.getUserRankings(req, { json: resolve, status: () => ({ json: resolve }) });
      })
    ]);

    res.json({
      success: true,
      data: {
        tradingStats: tradingStats.data,
        assetDistribution: assetDistribution.data,
        tradingTrend: tradingTrend.data,
        userRankings: userRankings.data
      }
    });
  } catch (error) {
    logger.error('获取仪表盘综合数据失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });

    res.status(500).json({
      success: false,
      message: '获取仪表盘综合数据失败',
      error: error.message
    });
  }
};