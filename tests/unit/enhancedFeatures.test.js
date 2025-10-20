/**
 * 第六阶段增强功能测试
 */

const StopLossTakeProfit = require('../../src/modules/stopLossTakeProfit');
const ConditionalOrder = require('../../src/modules/conditionalOrder');
const TradeAlert = require('../../src/modules/tradeAlert');
const DataExport = require('../../src/modules/dataExport');
const UserAudit = require('../../src/modules/userAudit');
const DataStatistics = require('../../src/modules/dataStatistics');
const SystemMonitor = require('../../src/modules/systemMonitor');
const OperationLog = require('../../src/modules/operationLog');

describe('第六阶段增强功能测试', () => {
  describe('止损止盈功能测试', () => {
    let stopLossTakeProfit;
    
    beforeEach(() => {
      stopLossTakeProfit = new StopLossTakeProfit();
    });
    
    test('应该能够设置止损订单', () => {
      const orderId = stopLossTakeProfit.setStopLoss(
        'user123', 'BTCUSD', 'buy', 1, 50000, 49000
      );
      
      expect(orderId).toBeDefined();
      expect(orderId).toMatch(/^sltp_/);
    });
    
    test('应该能够设置止盈订单', () => {
      const orderId = stopLossTakeProfit.setTakeProfit(
        'user123', 'BTCUSD', 'buy', 1, 50000, 51000
      );
      
      expect(orderId).toBeDefined();
      expect(orderId).toMatch(/^sltp_/);
    });
    
    test('应该能够检查止损触发', () => {
      stopLossTakeProfit.setStopLoss('user123', 'BTCUSD', 'buy', 1, 50000, 49000);
      const triggered = stopLossTakeProfit.checkTrigger('BTCUSD', 48000);
      
      expect(triggered).toHaveLength(1);
      expect(triggered[0].type).toBe('stopLoss');
    });
    
    test('应该能够检查止盈触发', () => {
      stopLossTakeProfit.setTakeProfit('user123', 'BTCUSD', 'buy', 1, 50000, 51000);
      const triggered = stopLossTakeProfit.checkTrigger('BTCUSD', 52000);
      
      expect(triggered).toHaveLength(1);
      expect(triggered[0].type).toBe('takeProfit');
    });
  });
  
  describe('条件单功能测试', () => {
    let conditionalOrder;
    
    beforeEach(() => {
      conditionalOrder = new ConditionalOrder();
    });
    
    test('应该能够设置条件单', () => {
      const orderId = conditionalOrder.setConditionalOrder(
        'user123', 'BTCUSD', 'buy', 1, 'priceAbove', 51000
      );
      
      expect(orderId).toBeDefined();
      expect(orderId).toMatch(/^cond_/);
    });
    
    test('应该能够检查条件单触发', () => {
      conditionalOrder.setConditionalOrder('user123', 'BTCUSD', 'buy', 1, 'priceAbove', 51000);
      const triggered = conditionalOrder.checkTrigger('BTCUSD', 52000);
      
      expect(triggered).toHaveLength(1);
      expect(triggered[0].status).toBe('triggered');
    });
  });
  
  describe('交易提醒功能测试', () => {
    let tradeAlert;
    
    beforeEach(() => {
      tradeAlert = new TradeAlert();
    });
    
    test('应该能够设置价格提醒', () => {
      const alertId = tradeAlert.setPriceAlert(
        'user123', 'BTCUSD', 'priceAbove', 51000, 'BTC价格超过51000'
      );
      
      expect(alertId).toBeDefined();
      expect(alertId).toMatch(/^alert_/);
    });
    
    test('应该能够检查价格提醒触发', () => {
      tradeAlert.setPriceAlert('user123', 'BTCUSD', 'priceAbove', 51000, 'BTC价格超过51000');
      const triggered = tradeAlert.checkPriceAlerts('BTCUSD', 52000);
      
      expect(triggered).toHaveLength(1);
      expect(triggered[0].status).toBe('triggered');
    });
  });
  
  describe('数据导出功能测试', () => {
    let dataExport;
    
    beforeEach(() => {
      dataExport = new DataExport();
    });
    
    test('应该能够导出交易历史为CSV格式', () => {
      const tradeHistory = [
        {
          order_id: 'order123',
          symbol: 'BTCUSD',
          direction: 'buy',
          amount: 1,
          price: 50000,
          order_time: '2025-10-20T10:00:00Z',
          status: 'filled'
        }
      ];
      
      const csv = dataExport.exportTradeHistoryToCSV(tradeHistory, 'user123');
      
      expect(csv).toContain('订单ID,交易品种,交易方向,交易数量,交易价格,交易时间,订单状态');
      expect(csv).toContain('order123,BTCUSD,buy,1,50000,2025-10-20T10:00:00Z,filled');
    });
    
    test('应该能够导出为JSON格式', () => {
      const data = { test: 'data' };
      const json = dataExport.exportToJSON(data, 'testType');
      
      expect(json).toContain('"dataType": "testType"');
      expect(json).toContain('"test": "data"');
    });
  });
  
  describe('用户行为审计功能测试', () => {
    let userAudit;
    
    beforeEach(() => {
      userAudit = new UserAudit();
    });
    
    test('应该能够记录用户行为', () => {
      userAudit.logUserAction('user123', 'login', { ip: '127.0.0.1' });
      
      const logs = userAudit.getUserAuditLogs('user123');
      
      expect(logs).toHaveLength(1);
      expect(logs[0].action).toBe('login');
      expect(logs[0].details.ip).toBe('127.0.0.1');
    });
  });
  
  describe('数据统计功能测试', () => {
    let dataStatistics;
    
    beforeEach(() => {
      dataStatistics = new DataStatistics();
    });
    
    test('应该能够生成交易统计', () => {
      const tradeData = [
        {
          direction: 'buy',
          amount: 1,
          price: 50000,
          profit: 1000
        }
      ];
      
      const stats = dataStatistics.generateTradeStatistics(tradeData);
      
      expect(stats.totalTrades).toBe(1);
      expect(stats.buyTrades).toBe(1);
      expect(stats.profitTrades).toBe(1);
      expect(stats.totalProfit).toBe(1000);
    });
  });
  
  describe('系统监控功能测试', () => {
    let systemMonitor;
    
    beforeEach(() => {
      systemMonitor = new SystemMonitor();
    });
    
    test('应该能够记录系统指标', () => {
      systemMonitor.recordMetric('cpu', 80, { core: 4 });
      
      const stats = systemMonitor.getMetricStats('cpu');
      
      expect(stats.latest).toBe(80);
      expect(stats.count).toBe(1);
    });
    
    test('应该能够添加告警规则', () => {
      const ruleId = systemMonitor.addAlertRule(
        'cpu', 'above', 90, undefined, 'CPU使用率过高', 'high'
      );
      
      expect(ruleId).toBeDefined();
      expect(ruleId).toMatch(/^rule_/);
    });
  });
  
  describe('操作日志功能测试', () => {
    let operationLog;
    
    beforeEach(() => {
      operationLog = new OperationLog();
    });
    
    test('应该能够记录操作日志', () => {
      const logId = operationLog.logOperation(
        'user123', 'trade', 'buy', { symbol: 'BTCUSD', amount: 1 }, 'success'
      );
      
      expect(logId).toBeDefined();
      expect(logId).toMatch(/^oplog_/);
    });
    
    test('应该能够获取操作日志', () => {
      operationLog.logOperation('user123', 'trade', 'buy', { symbol: 'BTCUSD' }, 'success');
      const logs = operationLog.getOperationLogs({ userId: 'user123' });
      
      expect(logs).toHaveLength(1);
      expect(logs[0].userId).toBe('user123');
      expect(logs[0].action).toBe('buy');
    });
  });
});