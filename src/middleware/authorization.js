const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const { BusinessError, UnauthorizedError, ForbiddenError } = require('./enhancedErrorHandler');
const logger = require('../utils/logger');
const config = require('../../config');

// JWT认证中间件
async function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('未提供认证信息');
    }
    
    const token = authHeader.substring(7); // 移除 'Bearer ' 前缀
    
    // 验证JWT令牌
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // 查找用户
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError('用户不存在');
    }
    
    // 创建 User 实例以确保有所有方法
    const userInstance = new User(
      user.id,
      user.username,
      user.email,
      user.password_hash,
      user.balance,
      user.role_id
    );
    
    // 将用户实例添加到请求对象中
    req.user = userInstance;
    
    logger.info('用户认证成功', { userId: user.id, username: user.username });
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      logger.warn('无效的JWT令牌', { error: error.message });
      return next(new UnauthorizedError('无效的认证令牌'));
    }
    
    if (error.name === 'TokenExpiredError') {
      logger.warn('JWT令牌已过期', { error: error.message });
      return next(new UnauthorizedError('认证令牌已过期'));
    }
    
    logger.error('认证过程中发生错误', { error: error.message });
    next(error);
  }
}

// 权限检查中间件
function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('需要先进行认证');
      }
      
      // 检查用户是否具有指定权限
      const hasPermission = await req.user.hasPermission(permission);
      if (!hasPermission) {
        logger.warn('用户权限不足', { 
          userId: req.user.id, 
          username: req.user.username, 
          requiredPermission: permission 
        });
        throw new ForbiddenError('权限不足');
      }
      
      logger.debug('权限检查通过', { 
        userId: req.user.id, 
        username: req.user.username, 
        permission: permission 
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

// 角色检查中间件
function requireRole(roleName) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('需要先进行认证');
      }
      
      // 获取用户角色
      const role = await Role.findById(req.user.role_id);
      if (!role || role.name !== roleName) {
        logger.warn('用户角色不匹配', { 
          userId: req.user.id, 
          username: req.user.username, 
          userRole: role ? role.name : 'unknown',
          requiredRole: roleName
        });
        throw new ForbiddenError('角色权限不足');
      }
      
      logger.debug('角色检查通过', { 
        userId: req.user.id, 
        username: req.user.username, 
        role: roleName
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

// 管理员权限检查中间件
async function requireAdmin(req, res, next) {
  try {
    if (!req.user) {
      throw new UnauthorizedError('需要先进行认证');
    }
    
    // 获取用户角色
    const role = await Role.findById(req.user.role_id);
    if (!role || role.name !== 'admin') {
      logger.warn('需要管理员权限', { 
        userId: req.user.id, 
        username: req.user.username, 
        userRole: role ? role.name : 'unknown'
      });
      throw new ForbiddenError('需要管理员权限');
    }
    
    logger.debug('管理员权限检查通过', { 
      userId: req.user.id, 
      username: req.user.username
    });
    next();
  } catch (error) {
    next(error);
  }
}

// 生成JWT令牌
function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    roleId: user.role_id
  };
  
  return jwt.sign(payload, config.jwtSecret, { 
    expiresIn: config.jwtExpiresIn || '24h' 
  });
}

module.exports = {
  authenticateJWT,
  requirePermission,
  requireRole,
  requireAdmin,
  generateToken
};