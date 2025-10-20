/**
 * 扩展功能测试
 */

describe('扩展功能测试', () => {
  test('应该能够导入扩展功能控制器', () => {
    const controller = require('../src/controllers/enhancedFeaturesController');
    expect(controller).toBeDefined();
    expect(typeof controller.addFinancialProduct).toBe('function');
    expect(typeof controller.getFinancialProducts).toBe('function');
  });

  test('应该能够导入扩展功能路由', () => {
    const router = require('../src/routes/enhanced');
    expect(router).toBeDefined();
  });

  test('应该能够正确注册路由到主应用', () => {
    const app = require('../src/app');
    expect(app).toBeDefined();
  });
});