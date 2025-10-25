const Transaction = require('../models/Transaction');
const Position = require('../models/Position');
const tradeService = require('../services/tradeService');
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
    
    // 使用交易服务处理订单
    const result = await tradeService.placeTrade(
      { symbol: asset, type, quantity, price: price || 0 },
      userId
    );
    
    // 记录成功日志
    logger.info('订单创建成功', {
      orderId: result.orderId,
      userId,
      asset,
      type,
      quantity,
      price
    });
    
    res.status(201).json(result);
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

// 处理实时交易请求（使用新的交易服务）
exports.handleRealtimeTrade = async (req, res) => {
  try {
    const { userId, symbol, quantity, price, type } = req.body;
    
    // 验证必要参数
    if (!userId || !symbol || !quantity || !type) {
      throw new ValidationError('缺少必要参数: userId, symbol, quantity, type');
    }
    
    // 验证数量必须为正数
    if (quantity <= 0) {
      throw new ValidationError('交易数量必须大于0', 'quantity');
    }
    
    // 使用交易服务处理实时交易
    const result = await tradeService.placeTrade(
      { symbol, type, quantity, price: price || 0 },
      userId
    );
    
    // 记录成功日志
    logger.info('实时交易处理成功', {
      orderId: result.orderId,
      userId,
      symbol,
      type,
      quantity,
      price
    });
    
    res.status(201).json(result);
  } catch (error) {
    // 记录错误日志
    logger.error('实时交易处理失败', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    // 如果是自定义错误类型，重新抛出以便统一处理
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    // 其他错误作为业务错误处理
    throw new BusinessError(`交易处理失败: ${error.message}`);
  }
};

// 更新用户持仓的辅助函数（保留以兼容现有代码）
async function updatePosition(userId, symbol, type, quantity, price) {
  try {
    const positions = await Position.findByUserId(userId);
    const existingPosition = positions.find(pos => pos.name === symbol);
    
    if (existingPosition) {
      // 更新现有持仓
      if (type === 'buy') {
        // 买入：增加数量，重新计算平均价格
        const totalAmount = existingPosition.amount * existingPosition.cost + quantity * price;
        const totalQuantity = existingPosition.amount + quantity;
        existingPosition.amount = totalQuantity;
        existingPosition.cost = totalAmount / totalQuantity;
      } else {
        // 卖出：减少数量
        existingPosition.amount -= quantity;
        if (existingPosition.amount <= 0) {
          // 如果持仓数量为0或负数，删除持仓
          await Position.delete(existingPosition.id);
          return;
        }
      }
      await Position.update(existingPosition.id, existingPosition);
    } else {
      // 创建新持仓
      if (type === 'buy') {
        const newPosition = new Position(
          generateId(),
          userId,
          symbol,
          quantity,
          price
        );
        await newPosition.save();
      }
      // 如果是卖出且没有持仓，则不处理
    }
  } catch (error) {
    throw new Error(`更新持仓失败: ${error.message}`);
  }
}