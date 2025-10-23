const Transaction = require('../models/Transaction');
const Position = require('../models/Position');
const { generateId } = require('../utils/codeGenerator');
const { BusinessError, ValidationError, NotFoundError } = require('../middleware/enhancedErrorHandler');
const logger = require('../utils/logger');

// 创建订单
exports.createOrder = async (req, res) => {
  try {
    const { userId, asset, type, quantity, price } = req.body;
    
    // 验证必要参数
    if (!userId || !asset || !type || !quantity) {
      throw new ValidationError('缺少必要参数: userId, asset, type, quantity');
    }
    
    // 验证数量必须为正数
    if (quantity <= 0) {
      throw new ValidationError('交易数量必须大于0', 'quantity');
    }
    
    // 创建交易记录
    const transactionId = generateId();
    const transaction = new Transaction(transactionId, userId, asset, type, quantity, price);
    await transaction.save();
    
    // 记录成功日志
    logger.info('订单创建成功', {
      orderId: transactionId,
      userId,
      asset,
      type,
      quantity,
      price
    });
    
    res.status(201).json({ 
      success: true,
      message: '订单创建成功', 
      orderId: transactionId,
      transaction 
    });
  } catch (error) {
    // 记录错误日志
    logger.error('创建订单失败', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    // 如果是自定义错误类型，重新抛出以便统一处理
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    // 其他错误作为业务错误处理
    throw new BusinessError(`创建订单失败: ${error.message}`);
  }
};

// 获取订单状态
exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('订单ID不能为空');
    }
    
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      throw new NotFoundError('订单不存在');
    }
    
    // 记录成功日志
    logger.info('获取订单信息成功', {
      orderId: id
    });
    
    res.json(transaction);
  } catch (error) {
    // 记录错误日志
    logger.error('获取订单信息失败', {
      message: error.message,
      stack: error.stack,
      orderId: req.params.id
    });
    
    // 如果是自定义错误类型，重新抛出以便统一处理
    if (error.name === 'ValidationError' || error.name === 'NotFoundError' || error.name === 'BusinessError') {
      throw error;
    }
    
    // 其他错误作为业务错误处理
    throw new BusinessError(`获取订单信息失败: ${error.message}`);
  }
};

// 取消订单
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('订单ID不能为空');
    }
    
    // 更新订单状态为已取消
    const result = await Transaction.updateStatus(id, 'cancelled');
    
    if (!result) {
      throw new NotFoundError('订单不存在');
    }
    
    // 记录成功日志
    logger.info('订单取消成功', {
      orderId: id
    });
    
    res.json({ message: '订单取消成功' });
  } catch (error) {
    // 记录错误日志
    logger.error('取消订单失败', {
      message: error.message,
      stack: error.stack,
      orderId: req.params.id
    });
    
    // 如果是自定义错误类型，重新抛出以便统一处理
    if (error.name === 'ValidationError' || error.name === 'NotFoundError' || error.name === 'BusinessError') {
      throw error;
    }
    
    // 其他错误作为业务错误处理
    throw new BusinessError(`取消订单失败: ${error.message}`);
  }
};

// 获取用户持仓
exports.getPositions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      throw new ValidationError('用户ID不能为空');
    }
    
    const positions = await Position.findByUserId(userId);
    
    // 记录成功日志
    logger.info('获取用户持仓信息成功', {
      userId: userId,
      positionCount: positions.length
    });
    
    res.json(positions);
  } catch (error) {
    // 记录错误日志
    logger.error('获取持仓信息失败', {
      message: error.message,
      stack: error.stack,
      userId: req.params.userId
    });
    
    // 如果是自定义错误类型，重新抛出以便统一处理
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    // 其他错误作为业务错误处理
    throw new BusinessError(`获取持仓信息失败: ${error.message}`);
  }
};

// 获取用户交易历史
exports.getTradeHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      throw new ValidationError('用户ID不能为空');
    }
    
    const history = await Transaction.findByUserId(userId);
    
    // 记录成功日志
    logger.info('获取用户交易历史成功', {
      userId: userId,
      transactionCount: history.length
    });
    
    res.json(history);
  } catch (error) {
    // 记录错误日志
    logger.error('获取交易历史失败', {
      message: error.message,
      stack: error.stack,
      userId: req.params.userId
    });
    
    // 如果是自定义错误类型，重新抛出以便统一处理
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    // 其他错误作为业务错误处理
    throw new BusinessError(`获取交易历史失败: ${error.message}`);
  }
};