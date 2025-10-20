/**
 * 安全功能测试
 */

describe('安全功能测试', () => {
  test('应该能够导入安全控制器', () => {
    const controller = require('../src/controllers/securityController');
    expect(controller).toBeDefined();
    expect(typeof controller.generate2FASecret).toBe('function');
    expect(typeof controller.verify2FAToken).toBe('function');
  });

  test('应该能够导入安全路由', () => {
    const router = require('../src/routes/security');
    expect(router).toBeDefined();
  });

  test('应该能够导入合规性控制器', () => {
    const controller = require('../src/controllers/complianceController');
    expect(controller).toBeDefined();
    expect(typeof controller.performKYC).toBe('function');
    expect(typeof controller.performAMLCheck).toBe('function');
  });

  test('应该能够导入合规性路由', () => {
    const router = require('../src/routes/compliance');
    expect(router).toBeDefined();
  });
});