const ContractTradingEngine = require('../../src/engine/ContractEngine');
const BinaryOptionEngine = require('../../src/engine/BinaryOptionEngine');
const PrivateFundEngine = require('../../src/engine/PrivateFundEngine');

describe('历史数据生成测试', () => {
  test('合约交易引擎历史数据生成', () => {
    const contractEngine = new ContractTradingEngine();
    
    // 检查是否生成了历史数据
    const shHistory = contractEngine.getPriceHistory('SH_FUTURE');
    const hkHistory = contractEngine.getPriceHistory('HK_FUTURE');
    
    expect(shHistory.length).toBeGreaterThan(0);
    expect(hkHistory.length).toBeGreaterThan(0);
    
    // 检查日期范围
    const firstDate = new Date(shHistory[0].timestamp);
    const lastDate = new Date(shHistory[shHistory.length - 1].timestamp);
    
    expect(firstDate).toEqual(new Date('2025-08-01'));
    expect(lastDate).toEqual(new Date('2025-10-17'));
    
    // 检查数据格式
    expect(shHistory[0]).toHaveProperty('timestamp');
    expect(shHistory[0]).toHaveProperty('price');
  });
  
  test('二元期权引擎历史统计数据生成', () => {
    const binaryEngine = new BinaryOptionEngine();
    
    // 检查是否生成了历史统计数据
    const stats = binaryEngine.getHistoricalStatistics();
    
    expect(Object.keys(stats).length).toBeGreaterThan(0);
    
    // 检查日期范围
    const dates = Object.keys(stats);
    const firstDate = new Date(dates[0]);
    const lastDate = new Date(dates[dates.length - 1]);
    
    expect(firstDate).toEqual(new Date('2025-08-01'));
    expect(lastDate).toEqual(new Date('2025-10-17'));
    
    // 检查统计数据格式
    const firstStat = stats[dates[0]];
    expect(firstStat).toHaveProperty('total_orders');
    expect(firstStat).toHaveProperty('win_orders');
    expect(firstStat).toHaveProperty('total_investment');
    expect(firstStat).toHaveProperty('total_payout');
  });
  
  test('私募基金引擎历史数据生成', () => {
    const fundEngine = new PrivateFundEngine();
    
    // 检查是否生成了历史数据
    const k8History = fundEngine.getNavHistory('FUND_K8');
    const a1History = fundEngine.getNavHistory('FUND_A1');
    
    expect(k8History.length).toBeGreaterThan(0);
    expect(a1History.length).toBeGreaterThan(0);
    
    // 检查日期范围
    const firstDate = new Date(k8History[0].date);
    const lastDate = new Date(k8History[k8History.length - 1].date);
    
    expect(firstDate).toEqual(new Date('2025-08-01'));
    expect(lastDate).toEqual(new Date('2025-10-17'));
    
    // 检查数据格式
    expect(k8History[0]).toHaveProperty('date');
    expect(k8History[0]).toHaveProperty('nav');
    expect(k8History[0]).toHaveProperty('change');
  });
  
  test('日期范围查询功能', () => {
    const contractEngine = new ContractTradingEngine();
    const fundEngine = new PrivateFundEngine();
    const binaryEngine = new BinaryOptionEngine();
    
    // 测试合约价格历史日期范围查询
    const shHistory = contractEngine.getPriceHistory('SH_FUTURE', '2025-09-01', '2025-09-30');
    expect(shHistory.length).toBeGreaterThan(0);
    
    // 测试基金净值历史日期范围查询
    const k8History = fundEngine.getNavHistory('FUND_K8', '2025-09-01', '2025-09-30');
    expect(k8History.length).toBeGreaterThan(0);
    
    // 测试二元期权历史统计数据日期范围查询
    const binaryStats = binaryEngine.getHistoricalStatistics('2025-09-01', '2025-09-30');
    expect(Object.keys(binaryStats).length).toBeGreaterThan(0);
  });
});