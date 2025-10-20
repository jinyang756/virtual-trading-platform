/**
 * 社交交易功能控制器
 */

const UserFollow = require('../models/UserFollow');
const TradeShare = require('../models/TradeShare');
const TradeShareLike = require('../models/TradeShareLike');
const TradeShareComment = require('../models/TradeShareComment');
const User = require('../models/User');
const { BusinessError, ValidationError } = require('../middleware/enhancedErrorHandler');
const logger = require('../utils/logger');

/**
 * 用户关注功能
 */
exports.followUser = async (req, res) => {
  try {
    const { followerId, followedId } = req.body;
    
    // 验证参数
    if (!followerId || !followedId) {
      throw new ValidationError('缺少必要参数: followerId, followedId');
    }
    
    // 不能关注自己
    if (followerId === followedId) {
      throw new BusinessError('不能关注自己');
    }
    
    // 检查被关注用户是否存在
    const followedUser = await User.findById(followedId);
    if (!followedUser) {
      throw new BusinessError('被关注用户不存在');
    }
    
    // 检查是否已关注
    const isFollowing = await UserFollow.isFollowing(followerId, followedId);
    if (isFollowing) {
      throw new BusinessError('已关注该用户');
    }
    
    // 创建关注关系
    const follow = new UserFollow(followerId, followedId);
    const result = await follow.save();
    
    if (!result.success) {
      throw new BusinessError('关注失败: ' + result.error);
    }
    
    // 记录日志
    logger.info('用户关注成功', {
      followerId,
      followedId,
      followId: result.id
    });
    
    res.status(201).json({
      success: true,
      message: '关注成功',
      followId: result.id
    });
  } catch (error) {
    logger.error('用户关注失败', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`关注失败: ${error.message}`);
  }
};

/**
 * 取消关注
 */
exports.unfollowUser = async (req, res) => {
  try {
    const { followerId, followedId } = req.body;
    
    // 验证参数
    if (!followerId || !followedId) {
      throw new ValidationError('缺少必要参数: followerId, followedId');
    }
    
    // 取消关注
    const result = await UserFollow.unfollow(followerId, followedId);
    
    if (!result) {
      throw new BusinessError('取消关注失败');
    }
    
    // 记录日志
    logger.info('用户取消关注成功', {
      followerId,
      followedId
    });
    
    res.json({
      success: true,
      message: '取消关注成功'
    });
  } catch (error) {
    logger.error('用户取消关注失败', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`取消关注失败: ${error.message}`);
  }
};

/**
 * 检查是否已关注
 */
exports.checkFollowing = async (req, res) => {
  try {
    const { followerId, followedId } = req.query;
    
    // 验证参数
    if (!followerId || !followedId) {
      throw new ValidationError('缺少必要参数: followerId, followedId');
    }
    
    // 检查是否已关注
    const isFollowing = await UserFollow.isFollowing(followerId, followedId);
    
    res.json({
      success: true,
      isFollowing: isFollowing
    });
  } catch (error) {
    logger.error('检查关注状态失败', {
      message: error.message,
      stack: error.stack,
      query: req.query
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`检查关注状态失败: ${error.message}`);
  }
};

/**
 * 获取用户的关注列表
 */
exports.getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    // 验证参数
    if (!userId) {
      throw new ValidationError('缺少必要参数: userId');
    }
    
    // 获取关注列表
    const following = await UserFollow.getFollowing(userId, parseInt(limit), parseInt(offset));
    const count = await UserFollow.getFollowingCount(userId);
    
    res.json({
      success: true,
      data: following,
      count: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    logger.error('获取关注列表失败', {
      message: error.message,
      stack: error.stack,
      params: req.params,
      query: req.query
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`获取关注列表失败: ${error.message}`);
  }
};

/**
 * 获取用户的粉丝列表
 */
exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    // 验证参数
    if (!userId) {
      throw new ValidationError('缺少必要参数: userId');
    }
    
    // 获取粉丝列表
    const followers = await UserFollow.getFollowers(userId, parseInt(limit), parseInt(offset));
    const count = await UserFollow.getFollowersCount(userId);
    
    res.json({
      success: true,
      data: followers,
      count: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    logger.error('获取粉丝列表失败', {
      message: error.message,
      stack: error.stack,
      params: req.params,
      query: req.query
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`获取粉丝列表失败: ${error.message}`);
  }
};

/**
 * 分享交易
 */
exports.shareTrade = async (req, res) => {
  try {
    const { userId, tradeId, content } = req.body;
    
    // 验证参数
    if (!userId || !tradeId) {
      throw new ValidationError('缺少必要参数: userId, tradeId');
    }
    
    // 创建交易分享
    const tradeShare = new TradeShare(userId, tradeId, content || '');
    const result = await tradeShare.save();
    
    if (!result.success) {
      throw new BusinessError('分享交易失败: ' + result.error);
    }
    
    // 记录日志
    logger.info('交易分享成功', {
      userId,
      tradeId,
      shareId: result.id
    });
    
    res.status(201).json({
      success: true,
      message: '分享成功',
      shareId: result.id
    });
  } catch (error) {
    logger.error('交易分享失败', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`分享交易失败: ${error.message}`);
  }
};

/**
 * 获取用户的交易分享列表
 */
exports.getUserShares = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    // 验证参数
    if (!userId) {
      throw new ValidationError('缺少必要参数: userId');
    }
    
    // 获取交易分享列表
    const shares = await TradeShare.getByUserId(userId, parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      data: shares,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    logger.error('获取交易分享列表失败', {
      message: error.message,
      stack: error.stack,
      params: req.params,
      query: req.query
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`获取交易分享列表失败: ${error.message}`);
  }
};

/**
 * 获取时间线（关注用户的交易分享）
 */
exports.getTimeline = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    // 验证参数
    if (!userId) {
      throw new ValidationError('缺少必要参数: userId');
    }
    
    // 获取时间线
    const timeline = await TradeShare.getTimeline(userId, parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      data: timeline,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    logger.error('获取时间线失败', {
      message: error.message,
      stack: error.stack,
      params: req.params,
      query: req.query
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`获取时间线失败: ${error.message}`);
  }
};

/**
 * 点赞交易分享
 */
exports.likeShare = async (req, res) => {
  try {
    const { shareId, userId } = req.body;
    
    // 验证参数
    if (!shareId || !userId) {
      throw new ValidationError('缺少必要参数: shareId, userId');
    }
    
    // 检查是否已点赞
    const isLiked = await TradeShareLike.isLiked(shareId, userId);
    if (isLiked) {
      throw new BusinessError('已点赞该分享');
    }
    
    // 创建点赞
    const like = new TradeShareLike(shareId, userId);
    const result = await like.save();
    
    if (!result.success) {
      throw new BusinessError('点赞失败: ' + result.error);
    }
    
    // 更新交易分享的点赞数
    const likesCount = await TradeShareLike.getLikesCount(shareId);
    await TradeShare.update(shareId, { likes_count: likesCount, updated_at: new Date() });
    
    // 记录日志
    logger.info('交易分享点赞成功', {
      shareId,
      userId,
      likeId: result.id
    });
    
    res.status(201).json({
      success: true,
      message: '点赞成功',
      likeId: result.id
    });
  } catch (error) {
    logger.error('交易分享点赞失败', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`点赞失败: ${error.message}`);
  }
};

/**
 * 取消点赞
 */
exports.unlikeShare = async (req, res) => {
  try {
    const { shareId, userId } = req.body;
    
    // 验证参数
    if (!shareId || !userId) {
      throw new ValidationError('缺少必要参数: shareId, userId');
    }
    
    // 取消点赞
    const result = await TradeShareLike.unlike(shareId, userId);
    
    if (!result) {
      throw new BusinessError('取消点赞失败');
    }
    
    // 更新交易分享的点赞数
    const likesCount = await TradeShareLike.getLikesCount(shareId);
    await TradeShare.update(shareId, { likes_count: likesCount, updated_at: new Date() });
    
    // 记录日志
    logger.info('交易分享取消点赞成功', {
      shareId,
      userId
    });
    
    res.json({
      success: true,
      message: '取消点赞成功'
    });
  } catch (error) {
    logger.error('交易分享取消点赞失败', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`取消点赞失败: ${error.message}`);
  }
};

/**
 * 评论交易分享
 */
exports.commentShare = async (req, res) => {
  try {
    const { shareId, userId, content } = req.body;
    
    // 验证参数
    if (!shareId || !userId || !content) {
      throw new ValidationError('缺少必要参数: shareId, userId, content');
    }
    
    // 创建评论
    const comment = new TradeShareComment(shareId, userId, content);
    const result = await comment.save();
    
    if (!result.success) {
      throw new BusinessError('评论失败: ' + result.error);
    }
    
    // 更新交易分享的评论数
    const commentsCount = await TradeShareComment.getCommentsCount(shareId);
    await TradeShare.update(shareId, { comments_count: commentsCount, updated_at: new Date() });
    
    // 记录日志
    logger.info('交易分享评论成功', {
      shareId,
      userId,
      commentId: result.id
    });
    
    res.status(201).json({
      success: true,
      message: '评论成功',
      commentId: result.id
    });
  } catch (error) {
    logger.error('交易分享评论失败', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`评论失败: ${error.message}`);
  }
};

/**
 * 获取交易分享的评论列表
 */
exports.getShareComments = async (req, res) => {
  try {
    const { shareId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    // 验证参数
    if (!shareId) {
      throw new ValidationError('缺少必要参数: shareId');
    }
    
    // 获取评论列表
    const comments = await TradeShareComment.getComments(shareId, parseInt(limit), parseInt(offset));
    const count = await TradeShareComment.getCommentsCount(shareId);
    
    res.json({
      success: true,
      data: comments,
      count: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    logger.error('获取评论列表失败', {
      message: error.message,
      stack: error.stack,
      params: req.params,
      query: req.query
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`获取评论列表失败: ${error.message}`);
  }
};