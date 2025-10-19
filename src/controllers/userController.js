const User = require('../models/User');
const Role = require('../models/Role');
const { generateId } = require('../utils/codeGenerator');
const bcrypt = require('bcrypt');
const { BusinessError, ValidationError, NotFoundError, UnauthorizedError } = require('../middleware/enhancedErrorHandler');
const { generateToken } = require('../middleware/authorization');
const logger = require('../utils/logger');

// 用户注册
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 验证必要参数
    if (!username || !email || !password) {
      throw new ValidationError('缺少必要参数: username, email, password');
    }
    
    // 验证密码长度
    if (password.length < 6) {
      throw new ValidationError('密码长度至少为6位', 'password');
    }
    
    // 检查用户是否已存在
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new BusinessError('用户已存在');
    }
    
    // 创建新用户
    const userId = generateId();
    // 对密码进行哈希处理
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = new User(userId, username, email, passwordHash);
    await newUser.save();
    
    // 生成JWT令牌
    const token = generateToken(newUser);
    
    // 记录成功日志
    logger.info('用户注册成功', {
      userId: userId,
      username: username,
      email: email
    });
    
    res.status(201).json({ 
      message: '用户注册成功', 
      userId: userId,
      token: token
    });
  } catch (error) {
    // 记录错误日志
    logger.error('用户注册失败', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    // 如果是自定义错误类型，重新抛出以便统一处理
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    // 其他错误作为业务错误处理
    throw new BusinessError(`注册失败: ${error.message}`);
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 验证必要参数
    if (!username || !password) {
      throw new ValidationError('缺少必要参数: username, password');
    }
    
    // 查找用户
    const user = await User.findByUsername(username);
    if (!user) {
      throw new UnauthorizedError('用户名或密码错误');
    }
    
    // 验证密码
    const isValidPassword = await User.validatePassword(username, password);
    if (!isValidPassword) {
      throw new UnauthorizedError('用户名或密码错误');
    }
    
    // 生成JWT令牌
    const token = generateToken(user);
    
    // 记录成功日志
    logger.info('用户登录成功', {
      userId: user.id,
      username: username
    });
    
    res.json({ 
      message: '登录成功', 
      token: token,
      userId: user.id,
      username: user.username
    });
  } catch (error) {
    // 记录错误日志
    logger.error('用户登录失败', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    // 如果是自定义错误类型，重新抛出以便统一处理
    if (error.name === 'ValidationError' || error.name === 'UnauthorizedError' || error.name === 'BusinessError') {
      return res.status(401).json({ error: error.message });
    }
    
    // 其他错误作为业务错误处理
    return res.status(500).json({ error: `登录失败: ${error.message}` });
  }
};

// 获取用户信息
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('用户ID不能为空');
    }
    
    const user = await User.findById(id);
    
    if (!user) {
      throw new NotFoundError('用户不存在');
    }
    
    // 移除密码字段
    const { password_hash, ...userInfo } = user;
    
    // 记录成功日志
    logger.info('获取用户信息成功', {
      userId: id
    });
    
    res.json(userInfo);
  } catch (error) {
    // 记录错误日志
    logger.error('获取用户信息失败', {
      message: error.message,
      stack: error.stack,
      userId: req.params.id
    });
    
    // 如果是自定义错误类型，重新抛出以便统一处理
    if (error.name === 'ValidationError' || error.name === 'NotFoundError' || error.name === 'BusinessError') {
      throw error;
    }
    
    // 其他错误作为业务错误处理
    throw new BusinessError(`获取用户信息失败: ${error.message}`);
  }
};

// 更新用户信息
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (!id) {
      throw new ValidationError('用户ID不能为空');
    }
    
    // 普通用户只能更新自己的信息，且不能更新角色
    if (req.user.id !== id) {
      // 检查是否具有管理员权限
      const userRole = await Role.findById(req.user.role_id);
      if (!userRole || userRole.name !== 'admin') {
        throw new UnauthorizedError('无权限更新其他用户信息');
      }
    } else {
      // 普通用户不能更新角色
      delete updates.role_id;
    }
    
    // 移除敏感字段
    delete updates.id;
    delete updates.password_hash;
    
    const updatedUser = await User.update(id, updates);
    
    if (!updatedUser) {
      throw new NotFoundError('用户不存在');
    }
    
    // 移除密码字段
    const { password_hash, ...userInfo } = updatedUser;
    
    // 记录成功日志
    logger.info('更新用户信息成功', {
      userId: id,
      updatedBy: req.user.id
    });
    
    res.json({ message: '用户信息更新成功', user: userInfo });
  } catch (error) {
    // 记录错误日志
    logger.error('更新用户信息失败', {
      message: error.message,
      stack: error.stack,
      userId: req.params.id,
      updates: updates,
      updatedBy: req.user.id
    });
    
    // 如果是自定义错误类型，重新抛出以便统一处理
    if (error.name === 'ValidationError' || error.name === 'NotFoundError' || error.name === 'UnauthorizedError' || error.name === 'BusinessError') {
      throw error;
    }
    
    // 其他错误作为业务错误处理
    throw new BusinessError(`更新用户信息失败: ${error.message}`);
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('用户ID不能为空');
    }
    
    // 检查是否具有管理员权限
    const userRole = await Role.findById(req.user.role_id);
    if (!userRole || userRole.name !== 'admin') {
      throw new UnauthorizedError('需要管理员权限才能删除用户');
    }
    
    const result = await User.delete(id);
    
    if (!result) {
      throw new NotFoundError('用户不存在');
    }
    
    // 记录成功日志
    logger.info('删除用户成功', {
      userId: id,
      deletedBy: req.user.id
    });
    
    res.json({ message: '用户删除成功' });
  } catch (error) {
    // 记录错误日志
    logger.error('删除用户失败', {
      message: error.message,
      stack: error.stack,
      userId: req.params.id,
      deletedBy: req.user.id
    });
    
    // 如果是自定义错误类型，重新抛出以便统一处理
    if (error.name === 'ValidationError' || error.name === 'NotFoundError' || error.name === 'UnauthorizedError' || error.name === 'BusinessError') {
      throw error;
    }
    
    // 其他错误作为业务错误处理
    throw new BusinessError(`删除用户失败: ${error.message}`);
  }
};

// 获取所有用户（仅管理员）
exports.getAllUsers = async (req, res) => {
  try {
    // 检查是否具有管理员权限
    const userRole = await Role.findById(req.user.role_id);
    if (!userRole || userRole.name !== 'admin') {
      throw new UnauthorizedError('需要管理员权限');
    }
    
    // 这里应该从数据库获取所有用户
    // 为简化起见，我们返回一个空数组
    const users = [];
    
    // 记录成功日志
    logger.info('获取所有用户列表成功', {
      requestedBy: req.user.id
    });
    
    res.json(users);
  } catch (error) {
    // 记录错误日志
    logger.error('获取用户列表失败', {
      message: error.message,
      stack: error.stack,
      requestedBy: req.user.id
    });
    
    // 如果是自定义错误类型，重新抛出以便统一处理
    if (error.name === 'UnauthorizedError' || error.name === 'BusinessError') {
      throw error;
    }
    
    // 其他错误作为业务错误处理
    throw new BusinessError(`获取用户列表失败: ${error.message}`);
  }
};

// 获取用户权限
exports.getUserPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('用户ID不能为空');
    }
    
    // 用户只能获取自己的权限，或管理员可以获取任何用户的权限
    if (req.user.id !== id) {
      // 检查是否具有管理员权限
      const userRole = await Role.findById(req.user.role_id);
      if (!userRole || userRole.name !== 'admin') {
        throw new UnauthorizedError('无权限获取其他用户权限信息');
      }
    }
    
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('用户不存在');
    }
    
    const permissions = await user.getPermissions();
    
    // 记录成功日志
    logger.info('获取用户权限成功', {
      userId: id,
      requestedBy: req.user.id
    });
    
    res.json({ permissions });
  } catch (error) {
    // 记录错误日志
    logger.error('获取用户权限失败', {
      message: error.message,
      stack: error.stack,
      userId: req.params.id,
      requestedBy: req.user.id
    });
    
    // 如果是自定义错误类型，重新抛出以便统一处理
    if (error.name === 'ValidationError' || error.name === 'NotFoundError' || error.name === 'UnauthorizedError' || error.name === 'BusinessError') {
      throw error;
    }
    
    // 其他错误作为业务错误处理
    throw new BusinessError(`获取用户权限失败: ${error.message}`);
  }
};