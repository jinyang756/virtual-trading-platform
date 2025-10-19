const { 
  validateEmail, 
  validatePassword, 
  validateUsername, 
  validateQuantity, 
  validatePrice, 
  validateAsset, 
  validateUserId,
  validateOrderType,
  validateLeverage
} = require('../utils/validation');

// 验证用户注册数据
function validateUserRegistration(req, res, next) {
  const { username, email, password } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: '用户名不能为空' });
  }
  
  if (!validateUsername(username)) {
    return res.status(400).json({ error: '用户名格式不正确，应为3-20位字母、数字或下划线' });
  }
  
  if (!email) {
    return res.status(400).json({ error: '邮箱不能为空' });
  }
  
  if (!validateEmail(email)) {
    return res.status(400).json({ error: '邮箱格式不正确' });
  }
  
  if (!password) {
    return res.status(400).json({ error: '密码不能为空' });
  }
  
  if (!validatePassword(password)) {
    return res.status(400).json({ error: '密码至少8位，包含字母和数字' });
  }
  
  next();
}

// 验证交易订单数据
function validateTradeOrder(req, res, next) {
  const { asset, type, quantity, price, leverage } = req.body;
  
  if (!asset) {
    return res.status(400).json({ error: '资产代码不能为空' });
  }
  
  if (!validateAsset(asset)) {
    return res.status(400).json({ error: '资产代码格式不正确，应为2-10位大写字母' });
  }
  
  if (!type) {
    return res.status(400).json({ error: '交易类型不能为空' });
  }
  
  if (!validateOrderType(type)) {
    return res.status(400).json({ error: '交易类型必须为buy或sell' });
  }
  
  if (!quantity) {
    return res.status(400).json({ error: '交易数量不能为空' });
  }
  
  if (!validateQuantity(quantity)) {
    return res.status(400).json({ error: '交易数量必须为正数' });
  }
  
  if (!price) {
    return res.status(400).json({ error: '价格不能为空' });
  }
  
  if (!validatePrice(price)) {
    return res.status(400).json({ error: '价格必须为正数' });
  }
  
  if (leverage && !validateLeverage(leverage)) {
    return res.status(400).json({ error: '杠杆必须为1-100之间的数字' });
  }
  
  next();
}

// 验证用户ID
function validateUserIdParam(req, res, next) {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ error: '用户ID不能为空' });
  }
  
  if (!validateUserId(id)) {
    return res.status(400).json({ error: '用户ID格式不正确' });
  }
  
  next();
}

module.exports = {
  validateUserRegistration,
  validateTradeOrder,
  validateUserIdParam
};