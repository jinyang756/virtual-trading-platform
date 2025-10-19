// 验证邮箱格式
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 验证密码强度
function validatePassword(password) {
  // 至少8位，包含字母和数字
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
}

// 验证用户名
function validateUsername(username) {
  // 3-20位，只能包含字母、数字、下划线
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

// 验证交易数量
function validateQuantity(quantity) {
  return typeof quantity === 'number' && quantity > 0;
}

// 验证价格
function validatePrice(price) {
  return typeof price === 'number' && price > 0;
}

// 验证资产代码
function validateAsset(asset) {
  // 2-10位大写字母
  const assetRegex = /^[A-Z]{2,10}$/;
  return assetRegex.test(asset);
}

// 验证用户ID
function validateUserId(userId) {
  // 以U开头，后跟字母数字
  const userIdRegex = /^U[a-zA-Z0-9]+$/;
  return userIdRegex.test(userId);
}

// 验证订单类型
function validateOrderType(type) {
  return ['buy', 'sell'].includes(type);
}

// 验证杠杆
function validateLeverage(leverage) {
  return typeof leverage === 'number' && leverage >= 1 && leverage <= 100;
}

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  validateQuantity,
  validatePrice,
  validateAsset,
  validateUserId,
  validateOrderType,
  validateLeverage
};