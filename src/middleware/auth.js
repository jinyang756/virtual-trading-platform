const { authenticateJWT, requireAdmin, generateToken } = require('./authorization');
const User = require('../models/User');
const { BusinessError, UnauthorizedError, ValidationError } = require('./enhancedErrorHandler');
const logger = require('../utils/logger');

// 认证中间件（保持向后兼容）
async function authenticate(req, res, next) {
  // 检查是否有JWT令牌
  const authHeader = req.headers['authorization'];
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // 使用JWT认证
    return authenticateJWT(req, res, next);
  }
  
  // 保持原有的简单认证（向后兼容）
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未提供认证信息' });
  }
  
  const token = authHeader.substring(7); // 移除 'Bearer ' 前缀
  
  // 简单的令牌验证（实际应用中应该验证JWT或检查Session）
  if (token !== 'valid-token' && token !== 'admin-token') {
    return res.status(403).json({ error: '无效的认证令牌' });
  }
  
  // 将用户信息添加到请求对象中
  req.user = {
    id: token === 'admin-token' ? 'admin' : 'user',
    role: token === 'admin-token' ? 'admin' : 'user'
  };
  
  next();
}

// 管理员认证中间件（保持向后兼容）
async function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // 使用JWT认证和管理员权限检查
    authenticateJWT(req, res, async (err) => {
      if (err) return next(err);
      return requireAdmin(req, res, next);
    });
    return;
  }
  
  // 保持原有的简单认证（向后兼容）
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ error: '未提供认证信息' });
  }
  
  const token = authHeader.substring(7);
  
  // 只允许管理员令牌
  if (token !== 'admin-token') {
    return res.status(403).json({ error: '需要管理员权限' });
  }
  
  req.user = {
    id: 'admin',
    role: 'admin'
  };
  
  next();
}

// 用户登录认证
async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    
    // 验证必要参数
    if (!username || !password) {
      throw new ValidationError('缺少必要参数: username, password');
    }
    
    // 查找用户
    const user = await User.findByUsername(username);
    if (!user) {
      logger.warn('登录失败 - 用户不存在', { username });
      throw new UnauthorizedError('用户名或密码错误');
    }
    
    // 验证密码
    const isValidPassword = await User.validatePassword(username, password);
    if (!isValidPassword) {
      logger.warn('登录失败 - 密码错误', { username });
      throw new UnauthorizedError('用户名或密码错误');
    }
    
    // 生成JWT令牌
    const token = generateToken(user);
    
    logger.info('用户登录成功', { 
      userId: user.id, 
      username: user.username 
    });
    
    res.json({ 
      message: '登录成功', 
      token: token,
      userId: user.id,
      username: user.username
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authenticate,
  authenticateAdmin,
  login
};