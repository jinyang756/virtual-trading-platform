// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// 生成订单号
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  
  return `${year}${month}${day}${hours}${minutes}${seconds}${random}`;
}

// 生成用户ID
function generateUserId() {
  return 'U' + generateId().toUpperCase();
}

// 生成交易ID
function generateTransactionId() {
  return 'T' + generateId().toUpperCase();
}

// 生成持仓ID
function generatePositionId() {
  return 'P' + generateId().toUpperCase();
}

module.exports = {
  generateId,
  generateOrderNumber,
  generateUserId,
  generateTransactionId,
  generatePositionId
};