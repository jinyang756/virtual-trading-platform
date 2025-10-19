const RiskManager = require('../src/engine/RiskManager');

// 模拟User模型
class MockUser {
  static async findById(userId) {
    // 模拟用户存在
    if (userId === 'test_user_123') {
      return {
        id: userId,
        username: 'Test User',
        balance: 1000000 // 足够的余额
      };
    }
    return null;
  }
}

async function testRiskManagement() {
  console.log('开始测试风控管理器...');
  
  // 创建风控管理器实例
  const riskManager = new RiskManager();
  
  // 模拟配置和用户模型
  riskManager.config = {
    minTradeAmount: 10,
    maxTradeAmount: 100000,
    maxLeverage: 10,
    maxTradesPerMinute: 5,
    maxTotalPosition: 500000
  };
  
  // 重写getUserTotalPosition方法以避免数据库依赖
  riskManager.getUserTotalPosition = async (userId) => {
    return 0; // 模拟用户没有持仓
  };
  
  // 测试订单数据
  const testOrder = {
    userId: 'test_user_123',
    symbol: 'BTCUSD',
    direction: 'buy',
    quantity: 1,
    price: 40000,
    leverage: 5
  };
  
  console.log('测试1: 正常订单');
  try {
    const result = await riskManager.checkRisk(testOrder);
    console.log('结果:', result);
  } catch (error) {
    console.error('错误:', error.message);
  }
  
  console.log('\n测试2: 超过最大杠杆');
  const highLeverageOrder = { ...testOrder, leverage: 15 };
  try {
    const result = await riskManager.checkRisk(highLeverageOrder);
    console.log('结果:', result);
  } catch (error) {
    console.error('错误:', error.message);
  }
  
  console.log('\n测试3: 交易金额过低');
  const lowAmountOrder = { ...testOrder, quantity: 0.0001, price: 40000 };
  try {
    const result = await riskManager.checkRisk(lowAmountOrder);
    console.log('结果:', result);
  } catch (error) {
    console.error('错误:', error.message);
  }
  
  console.log('\n测试4: 交易金额过高');
  const highAmountOrder = { ...testOrder, quantity: 10, price: 40000 }; // 400,000 > 100,000
  try {
    const result = await riskManager.checkRisk(highAmountOrder);
    console.log('结果:', result);
  } catch (error) {
    console.error('错误:', error.message);
  }
  
  console.log('\n测试5: 交易频率限制');
  // 快速连续下单测试频率限制
  for (let i = 0; i < 10; i++) {
    const result = riskManager.checkTradeFrequency(testOrder.userId);
    console.log(`第${i+1}次交易检查:`, result.allowed ? '允许' : `拒绝 - ${result.reason}`);
  }
  
  console.log('\n风控管理器测试完成');
}

// 运行测试
testRiskManagement().catch(console.error);