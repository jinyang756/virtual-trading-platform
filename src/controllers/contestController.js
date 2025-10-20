/**
 * 实时交易竞赛功能控制器
 */

const TradingContest = require('../models/TradingContest');
const ContestParticipant = require('../models/ContestParticipant');
const ContestTrade = require('../models/ContestTrade');
const User = require('../models/User');
const { BusinessError, ValidationError } = require('../middleware/enhancedErrorHandler');
const logger = require('../utils/logger');

/**
 * 创建交易竞赛
 */
exports.createContest = async (req, res) => {
  try {
    const { name, description, startTime, endTime, prizePool } = req.body;
    
    // 验证参数
    if (!name || !startTime || !endTime) {
      throw new ValidationError('缺少必要参数: name, startTime, endTime');
    }
    
    // 验证时间
    if (new Date(startTime) >= new Date(endTime)) {
      throw new ValidationError('开始时间必须早于结束时间');
    }
    
    // 创建交易竞赛
    const contest = new TradingContest(name, description, startTime, endTime, prizePool || 0);
    const result = await contest.save();
    
    if (!result.success) {
      throw new BusinessError('创建竞赛失败: ' + result.error);
    }
    
    // 记录日志
    logger.info('交易竞赛创建成功', {
      contestId: result.id,
      name,
      startTime,
      endTime
    });
    
    res.status(201).json({
      success: true,
      message: '竞赛创建成功',
      contestId: result.id
    });
  } catch (error) {
    logger.error('交易竞赛创建失败', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`创建竞赛失败: ${error.message}`);
  }
};

/**
 * 获取交易竞赛列表
 */
exports.getContests = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let contests;
    if (status) {
      contests = await TradingContest.getByStatus(status, parseInt(limit), parseInt(offset));
    } else {
      contests = await TradingContest.getAll(parseInt(limit), parseInt(offset));
    }
    
    res.json({
      success: true,
      data: contests,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    logger.error('获取交易竞赛列表失败', {
      message: error.message,
      stack: error.stack,
      query: req.query
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`获取竞赛列表失败: ${error.message}`);
  }
};

/**
 * 获取交易竞赛详情
 */
exports.getContestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 验证参数
    if (!id) {
      throw new ValidationError('缺少必要参数: id');
    }
    
    // 获取竞赛详情
    const contest = await TradingContest.findById(id);
    if (!contest) {
      throw new BusinessError('竞赛不存在');
    }
    
    res.json({
      success: true,
      data: contest
    });
  } catch (error) {
    logger.error('获取交易竞赛详情失败', {
      message: error.message,
      stack: error.stack,
      params: req.params
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`获取竞赛详情失败: ${error.message}`);
  }
};

/**
 * 更新交易竞赛
 */
exports.updateContest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // 验证参数
    if (!id) {
      throw new ValidationError('缺少必要参数: id');
    }
    
    // 更新竞赛
    const result = await TradingContest.update(id, updates);
    
    if (!result) {
      throw new BusinessError('更新竞赛失败');
    }
    
    // 记录日志
    logger.info('交易竞赛更新成功', {
      contestId: id,
      updates
    });
    
    res.json({
      success: true,
      message: '竞赛更新成功'
    });
  } catch (error) {
    logger.error('交易竞赛更新失败', {
      message: error.message,
      stack: error.stack,
      params: req.params,
      requestBody: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`更新竞赛失败: ${error.message}`);
  }
};

/**
 * 删除交易竞赛
 */
exports.deleteContest = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 验证参数
    if (!id) {
      throw new ValidationError('缺少必要参数: id');
    }
    
    // 删除竞赛
    const result = await TradingContest.delete(id);
    
    if (!result) {
      throw new BusinessError('删除竞赛失败');
    }
    
    // 记录日志
    logger.info('交易竞赛删除成功', {
      contestId: id
    });
    
    res.json({
      success: true,
      message: '竞赛删除成功'
    });
  } catch (error) {
    logger.error('交易竞赛删除失败', {
      message: error.message,
      stack: error.stack,
      params: req.params
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`删除竞赛失败: ${error.message}`);
  }
};

/**
 * 启动交易竞赛
 */
exports.startContest = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 验证参数
    if (!id) {
      throw new ValidationError('缺少必要参数: id');
    }
    
    // 启动竞赛
    const result = await TradingContest.startContest(id);
    
    if (!result) {
      throw new BusinessError('启动竞赛失败');
    }
    
    // 记录日志
    logger.info('交易竞赛启动成功', {
      contestId: id
    });
    
    res.json({
      success: true,
      message: '竞赛启动成功'
    });
  } catch (error) {
    logger.error('交易竞赛启动失败', {
      message: error.message,
      stack: error.stack,
      params: req.params
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`启动竞赛失败: ${error.message}`);
  }
};

/**
 * 结束交易竞赛
 */
exports.endContest = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 验证参数
    if (!id) {
      throw new ValidationError('缺少必要参数: id');
    }
    
    // 结束竞赛
    const result = await TradingContest.endContest(id);
    
    if (!result) {
      throw new BusinessError('结束竞赛失败');
    }
    
    // 记录日志
    logger.info('交易竞赛结束成功', {
      contestId: id
    });
    
    res.json({
      success: true,
      message: '竞赛结束成功'
    });
  } catch (error) {
    logger.error('交易竞赛结束失败', {
      message: error.message,
      stack: error.stack,
      params: req.params
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`结束竞赛失败: ${error.message}`);
  }
};

/**
 * 参与交易竞赛
 */
exports.joinContest = async (req, res) => {
  try {
    const { contestId, userId, initialBalance } = req.body;
    
    // 验证参数
    if (!contestId || !userId) {
      throw new ValidationError('缺少必要参数: contestId, userId');
    }
    
    // 检查竞赛是否存在
    const contest = await TradingContest.findById(contestId);
    if (!contest) {
      throw new BusinessError('竞赛不存在');
    }
    
    // 检查竞赛状态
    if (contest.status !== 'upcoming') {
      throw new BusinessError('只能参与未开始的竞赛');
    }
    
    // 检查用户是否存在
    const user = await User.findById(userId);
    if (!user) {
      throw new BusinessError('用户不存在');
    }
    
    // 检查是否已参与
    const existingParticipant = await ContestParticipant.findByContestAndUser(contestId, userId);
    if (existingParticipant) {
      throw new BusinessError('已参与该竞赛');
    }
    
    // 创建参与者
    const balance = initialBalance || 100000; // 默认10万初始资金
    const participant = new ContestParticipant(contestId, userId, balance);
    const result = await participant.save();
    
    if (!result.success) {
      throw new BusinessError('参与竞赛失败: ' + result.error);
    }
    
    // 记录日志
    logger.info('用户参与竞赛成功', {
      contestId,
      userId,
      participantId: result.id,
      initialBalance: balance
    });
    
    res.status(201).json({
      success: true,
      message: '参与竞赛成功',
      participantId: result.id
    });
  } catch (error) {
    logger.error('用户参与竞赛失败', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`参与竞赛失败: ${error.message}`);
  }
};

/**
 * 获取竞赛参与者列表
 */
exports.getContestParticipants = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    // 验证参数
    if (!contestId) {
      throw new ValidationError('缺少必要参数: contestId');
    }
    
    // 获取参与者列表
    const participants = await ContestParticipant.getByContest(contestId, parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      data: participants,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    logger.error('获取竞赛参与者列表失败', {
      message: error.message,
      stack: error.stack,
      params: req.params,
      query: req.query
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`获取参与者列表失败: ${error.message}`);
  }
};

/**
 * 获取竞赛排行榜
 */
exports.getContestLeaderboard = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    // 验证参数
    if (!contestId) {
      throw new ValidationError('缺少必要参数: contestId');
    }
    
    // 获取排行榜
    const participants = await ContestParticipant.getByContest(contestId, parseInt(limit), parseInt(offset));
    
    // 计算收益率
    const leaderboard = participants.map(participant => {
      const returnRate = ((participant.current_balance - participant.initial_balance) / participant.initial_balance) * 100;
      return {
        ...participant,
        returnRate: parseFloat(returnRate.toFixed(2))
      };
    });
    
    res.json({
      success: true,
      data: leaderboard,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    logger.error('获取竞赛排行榜失败', {
      message: error.message,
      stack: error.stack,
      params: req.params,
      query: req.query
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`获取排行榜失败: ${error.message}`);
  }
};

/**
 * 记录竞赛交易
 */
exports.recordContestTrade = async (req, res) => {
  try {
    const { contestId, participantId, tradeType, asset, quantity, price, profitLoss } = req.body;
    
    // 验证参数
    if (!contestId || !participantId || !tradeType || !asset || !quantity || !price) {
      throw new ValidationError('缺少必要参数: contestId, participantId, tradeType, asset, quantity, price');
    }
    
    // 检查竞赛是否存在
    const contest = await TradingContest.findById(contestId);
    if (!contest) {
      throw new BusinessError('竞赛不存在');
    }
    
    // 检查竞赛状态
    if (!TradingContest.isActive(contest)) {
      throw new BusinessError('竞赛未进行中');
    }
    
    // 检查参与者是否存在
    const participant = await ContestParticipant.findById(participantId);
    if (!participant) {
      throw new BusinessError('参与者不存在');
    }
    
    // 创建交易记录
    const trade = new ContestTrade(contestId, participantId, tradeType, asset, quantity, price, profitLoss || 0);
    const result = await trade.save();
    
    if (!result.success) {
      throw new BusinessError('记录交易失败: ' + result.error);
    }
    
    // 更新参与者余额（如果有盈亏）
    if (profitLoss) {
      const newBalance = participant.current_balance + profitLoss;
      await ContestParticipant.update(participantId, {
        current_balance: newBalance,
        updated_at: new Date()
      });
    }
    
    // 记录日志
    logger.info('竞赛交易记录成功', {
      contestId,
      participantId,
      tradeId: result.id,
      tradeType,
      asset,
      quantity,
      price,
      profitLoss
    });
    
    res.status(201).json({
      success: true,
      message: '交易记录成功',
      tradeId: result.id
    });
  } catch (error) {
    logger.error('竞赛交易记录失败', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`记录交易失败: ${error.message}`);
  }
};

/**
 * 获取竞赛交易记录
 */
exports.getContestTrades = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { limit = 100, offset = 0 } = req.query;
    
    // 验证参数
    if (!contestId) {
      throw new ValidationError('缺少必要参数: contestId');
    }
    
    // 获取交易记录
    const trades = await ContestTrade.getByContest(contestId, parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      data: trades,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    logger.error('获取竞赛交易记录失败', {
      message: error.message,
      stack: error.stack,
      params: req.params,
      query: req.query
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`获取交易记录失败: ${error.message}`);
  }
};