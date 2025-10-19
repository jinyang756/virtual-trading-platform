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
} = require('../../src/utils/validation');
const { generateId, generateOrderNumber } = require('../../src/utils/codeGenerator');

describe('工具函数测试', () => {
  describe('数据验证函数', () => {
    test('验证邮箱格式', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });

    test('验证密码强度', () => {
      expect(validatePassword('Password123')).toBe(true);
      expect(validatePassword('pass')).toBe(false);
      expect(validatePassword('password')).toBe(false);
    });

    test('验证用户名', () => {
      expect(validateUsername('user123')).toBe(true);
      expect(validateUsername('user_name')).toBe(true);
      expect(validateUsername('us')).toBe(false);
      expect(validateUsername('user with space')).toBe(false);
    });

    test('验证交易数量', () => {
      expect(validateQuantity(10)).toBe(true);
      expect(validateQuantity(0.5)).toBe(true);
      expect(validateQuantity(0)).toBe(false);
      expect(validateQuantity(-1)).toBe(false);
    });

    test('验证价格', () => {
      expect(validatePrice(100)).toBe(true);
      expect(validatePrice(0.5)).toBe(true);
      expect(validatePrice(0)).toBe(false);
      expect(validatePrice(-1)).toBe(false);
    });

    test('验证资产代码', () => {
      expect(validateAsset('BTC')).toBe(true);
      expect(validateAsset('ETH')).toBe(true);
      expect(validateAsset('bt')).toBe(false);
      expect(validateAsset('verylongassetname')).toBe(false);
    });

    test('验证用户ID', () => {
      expect(validateUserId('U123456')).toBe(true);
      expect(validateUserId('Uabc123')).toBe(true);
      expect(validateUserId('123456')).toBe(false);
      expect(validateUserId('u123456')).toBe(false);
    });

    test('验证订单类型', () => {
      expect(validateOrderType('buy')).toBe(true);
      expect(validateOrderType('sell')).toBe(true);
      expect(validateOrderType('hold')).toBe(false);
    });

    test('验证杠杆', () => {
      expect(validateLeverage(1)).toBe(true);
      expect(validateLeverage(10)).toBe(true);
      expect(validateLeverage(0.5)).toBe(false);
      expect(validateLeverage(1000)).toBe(false);
    });
  });

  describe('代码生成函数', () => {
    test('生成唯一ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });

    test('生成订单号', () => {
      const orderNumber = generateOrderNumber();
      expect(orderNumber).toBeDefined();
      expect(typeof orderNumber).toBe('string');
    });
  });
});