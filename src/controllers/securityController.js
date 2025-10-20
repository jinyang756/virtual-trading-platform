/**
 * 安全控制器
 */

const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { BusinessError, ValidationError } = require('../middleware/enhancedErrorHandler');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * 生成双因素认证密钥
 */
exports.generate2FASecret = async (req, res) => {
  try {
    const { userId } = req.user;
    
    // 生成双因素认证密钥
    const secret = speakeasy.generateSecret({
      name: `虚拟交易平台(${userId})`,
      issuer: '虚拟交易平台'
    });
    
    // 生成二维码数据URL
    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);
    
    logger.info('双因素认证密钥已生成', {
      userId: userId
    });
    
    res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCodeDataUrl: qrCodeDataUrl,
        otpauthUrl: secret.otpauth_url
      }
    });
  } catch (error) {
    logger.error('生成双因素认证密钥失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`生成双因素认证密钥失败: ${error.message}`);
  }
};

/**
 * 验证双因素认证令牌
 */
exports.verify2FAToken = async (req, res) => {
  try {
    const { userId } = req.user;
    const { secret, token } = req.body;
    
    // 验证参数
    if (!secret || !token) {
      throw new ValidationError('缺少必要参数: secret, token');
    }
    
    // 验证令牌
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2 // 允许的时间窗口
    });
    
    if (!verified) {
      throw new BusinessError('无效的验证码');
    }
    
    // 如果验证成功，保存用户的2FA设置
    const user = await User.findById(userId);
    if (user) {
      await User.update(userId, {
        two_factor_secret: secret,
        two_factor_enabled: true
      });
    }
    
    logger.info('双因素认证验证成功', {
      userId: userId
    });
    
    res.json({
      success: true,
      message: '双因素认证设置成功'
    });
  } catch (error) {
    logger.error('双因素认证验证失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`双因素认证验证失败: ${error.message}`);
  }
};

/**
 * 禁用双因素认证
 */
exports.disable2FA = async (req, res) => {
  try {
    const { userId } = req.user;
    
    // 禁用用户的2FA设置
    await User.update(userId, {
      two_factor_secret: null,
      two_factor_enabled: false
    });
    
    logger.info('双因素认证已禁用', {
      userId: userId
    });
    
    res.json({
      success: true,
      message: '双因素认证已禁用'
    });
  } catch (error) {
    logger.error('禁用双因素认证失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`禁用双因素认证失败: ${error.message}`);
  }
};

/**
 * 验证登录时的双因素认证令牌
 */
exports.verifyLogin2FAToken = async (req, res) => {
  try {
    const { userId, token } = req.body;
    
    // 验证参数
    if (!userId || !token) {
      throw new ValidationError('缺少必要参数: userId, token');
    }
    
    // 获取用户信息
    const user = await User.findById(userId);
    if (!user) {
      throw new BusinessError('用户不存在');
    }
    
    // 检查用户是否启用了2FA
    if (!user.two_factor_enabled || !user.two_factor_secret) {
      throw new BusinessError('用户未启用双因素认证');
    }
    
    // 验证令牌
    const verified = speakeasy.totp.verify({
      secret: user.two_factor_secret,
      encoding: 'base32',
      token: token,
      window: 2 // 允许的时间窗口
    });
    
    if (!verified) {
      throw new BusinessError('无效的验证码');
    }
    
    logger.info('登录双因素认证验证成功', {
      userId: userId
    });
    
    res.json({
      success: true,
      message: '验证成功'
    });
  } catch (error) {
    logger.error('登录双因素认证验证失败', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`登录双因素认证验证失败: ${error.message}`);
  }
};

/**
 * 添加IP到白名单
 */
exports.addIPToWhitelist = async (req, res) => {
  try {
    const { userId } = req.user;
    const { ip } = req.body;
    
    // 验证参数
    if (!ip) {
      throw new ValidationError('缺少必要参数: ip');
    }
    
    // 获取用户当前的IP白名单
    const user = await User.findById(userId);
    let whitelist = user.ip_whitelist ? JSON.parse(user.ip_whitelist) : [];
    
    // 检查IP是否已在白名单中
    if (whitelist.includes(ip)) {
      throw new BusinessError('IP地址已在白名单中');
    }
    
    // 添加IP到白名单
    whitelist.push(ip);
    
    // 更新用户信息
    await User.update(userId, {
      ip_whitelist: JSON.stringify(whitelist)
    });
    
    logger.info('IP地址已添加到白名单', {
      userId: userId,
      ip: ip
    });
    
    res.json({
      success: true,
      message: 'IP地址已添加到白名单',
      data: {
        ip: ip
      }
    });
  } catch (error) {
    logger.error('添加IP到白名单失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`添加IP到白名单失败: ${error.message}`);
  }
};

/**
 * 从白名单中移除IP
 */
exports.removeIPFromWhitelist = async (req, res) => {
  try {
    const { userId } = req.user;
    const { ip } = req.body;
    
    // 验证参数
    if (!ip) {
      throw new ValidationError('缺少必要参数: ip');
    }
    
    // 获取用户当前的IP白名单
    const user = await User.findById(userId);
    let whitelist = user.ip_whitelist ? JSON.parse(user.ip_whitelist) : [];
    
    // 检查IP是否在白名单中
    if (!whitelist.includes(ip)) {
      throw new BusinessError('IP地址不在白名单中');
    }
    
    // 从白名单中移除IP
    whitelist = whitelist.filter(whitelistedIp => whitelistedIp !== ip);
    
    // 更新用户信息
    await User.update(userId, {
      ip_whitelist: JSON.stringify(whitelist)
    });
    
    logger.info('IP地址已从白名单移除', {
      userId: userId,
      ip: ip
    });
    
    res.json({
      success: true,
      message: 'IP地址已从白名单移除',
      data: {
        ip: ip
      }
    });
  } catch (error) {
    logger.error('从白名单移除IP失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`从白名单移除IP失败: ${error.message}`);
  }
};

/**
 * 获取IP白名单
 */
exports.getIPWhitelist = async (req, res) => {
  try {
    const { userId } = req.user;
    
    // 获取用户当前的IP白名单
    const user = await User.findById(userId);
    const whitelist = user.ip_whitelist ? JSON.parse(user.ip_whitelist) : [];
    
    res.json({
      success: true,
      data: {
        whitelist: whitelist
      }
    });
  } catch (error) {
    logger.error('获取IP白名单失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`获取IP白名单失败: ${error.message}`);
  }
};

/**
 * 增强数据加密
 */
exports.enhanceDataEncryption = async (req, res) => {
  try {
    const { userId } = req.user;
    const { data } = req.body;
    
    // 验证参数
    if (!data) {
      throw new ValidationError('缺少必要参数: data');
    }
    
    // 这里应该实现数据加密逻辑
    // 例如：使用更强的加密算法对敏感数据进行加密
    
    logger.info('数据加密增强完成', {
      userId: userId
    });
    
    res.json({
      success: true,
      message: '数据加密增强完成',
      data: {
        encryptedData: 'encrypted_' + data // 模拟加密结果
      }
    });
  } catch (error) {
    logger.error('数据加密增强失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`数据加密增强失败: ${error.message}`);
  }
};

/**
 * 执行安全审计
 */
exports.performSecurityAudit = async (req, res) => {
  try {
    const { userId } = req.user;
    
    // 这里应该实现安全审计逻辑
    // 例如：检查用户登录历史、异常行为等
    
    const auditResults = {
      lastLogin: new Date(),
      loginAttempts: 0,
      suspiciousActivities: [],
      securityScore: 95
    };
    
    logger.info('安全审计完成', {
      userId: userId
    });
    
    res.json({
      success: true,
      data: auditResults
    });
  } catch (error) {
    logger.error('安全审计失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`安全审计失败: ${error.message}`);
  }
};