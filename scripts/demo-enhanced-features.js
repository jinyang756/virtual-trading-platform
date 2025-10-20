/**
 * 第六阶段增强功能演示脚本
 * 展示所有新功能的使用方法
 */

const StopLossTakeProfit = require('../src/modules/stopLossTakeProfit');
const ConditionalOrder = require('../src/modules/conditionalOrder');
const TradeAlert = require('../src/modules/tradeAlert');
const DataExport = require('../src/modules/dataExport');
const UserAudit = require('../src/modules/userAudit');
const DataStatistics = require('../src/modules/dataStatistics');
const SystemMonitor = require('../src/modules/systemMonitor');
const OperationLog = require('../src/modules/operationLog');

console.log('=== 第六阶段增强功能演示 ===\n');

// 1. 止损止盈功能演示
console.log('1. 止损止盈功能演示');
const stopLossTakeProfit = new StopLossTakeProfit();
const stopLossOrderId = stopLossTakeProfit.setStopLoss('user123', 'BTCUSD', 'buy', 1, 50000, 49000);
const takeProfitOrderId = stopLossTakeProfit.setTakeProfit('user123', 'BTCUSD', 'buy', 1, 50000, 51000);
console.log(`   设置止损订单: ${stopLossOrderId}`);
console.log(`   设置止盈订单: ${takeProfitOrderId}`);

// 检查触发
const triggeredOrders = stopLossTakeProfit.checkTrigger('BTCUSD', 48000);
console.log(`   触发的订单数量: ${triggeredOrders.length}`);

// 2. 条件单功能演示
console.log('\n2. 条件单功能演示');
const conditionalOrder = new ConditionalOrder();
const conditionalOrderId = conditionalOrder.setConditionalOrder(
  'user123', 'ETHUSD', 'buy', 10, 'priceAbove', 3000, 'market'
);
console.log(`   设置条件单: ${conditionalOrderId}`);

// 检查触发
const triggeredConditional = conditionalOrder.checkTrigger('ETHUSD', 3100);
console.log(`   触发的条件单数量: ${triggeredConditional.length}`);

// 3. 交易提醒功能演示
console.log('\n3. 交易提醒功能演示');
const tradeAlert = new TradeAlert();
const alertId = tradeAlert.setPriceAlert('user123', 'BTCUSD', 'priceAbove', 51000, 'BTC价格超过51000');
console.log(`   设置价格提醒: ${alertId}`);

// 检查触发
const triggeredAlerts = tradeAlert.checkPriceAlerts('BTCUSD', 52000);
console.log(`   触发的提醒数量: ${triggeredAlerts.length}`);

// 4. 数据导出功能演示
console.log('\n4. 数据导出功能演示');
const dataExport = new DataExport();
const tradeHistory = [
  {
    order_id: 'order123',
    symbol: 'BTCUSD',
    direction: 'buy',
    amount: 1,
    price: 50000,
    order_time: new Date().toISOString(),
    status: 'filled'
  }
];
const csvData = dataExport.exportTradeHistoryToCSV(tradeHistory, 'user123');
console.log('   导出CSV数据预览:');
console.log('   ' + csvData.split('\n')[0]); // 只显示头部
console.log('   ' + csvData.split('\n')[1]); // 只显示第一行数据

// 5. 用户行为审计功能演示
console.log('\n5. 用户行为审计功能演示');
const userAudit = new UserAudit();
userAudit.logUserAction('user123', 'login', { ip: '192.168.1.100', userAgent: 'Chrome' });
userAudit.logUserAction('user123', 'place_order', { symbol: 'BTCUSD', amount: 1 });
const auditLogs = userAudit.getUserAuditLogs('user123');
console.log(`   记录的用户行为数量: ${auditLogs.length}`);

// 6. 数据统计功能演示
console.log('\n6. 数据统计功能演示');
const dataStatistics = new DataStatistics();
const tradeData = [
  { direction: 'buy', amount: 1, price: 50000, profit: 1000 },
  { direction: 'sell', amount: 0.5, price: 51000, profit: -200 }
];
const tradeStats = dataStatistics.generateTradeStatistics(tradeData);
console.log(`   总交易数: ${tradeStats.totalTrades}`);
console.log(`   总盈利: ${tradeStats.totalProfit}`);
console.log(`   净利润: ${tradeStats.netProfit}`);

// 7. 系统监控功能演示
console.log('\n7. 系统监控功能演示');
const systemMonitor = new SystemMonitor();
systemMonitor.recordMetric('cpu', 75, { cores: 4 });
systemMonitor.recordMetric('memory', 60, { total: '8GB' });
systemMonitor.addAlertRule('cpu', 'above', 90, undefined, 'CPU使用率超过90%', 'high');
const cpuStats = systemMonitor.getMetricStats('cpu');
console.log(`   CPU使用率: ${cpuStats.latest}%`);
const systemHealth = systemMonitor.getSystemHealth();
console.log(`   系统健康状态: ${systemHealth.status}`);

// 8. 操作日志功能演示
console.log('\n8. 操作日志功能演示');
const operationLog = new OperationLog();
const logId = operationLog.logOperation('user123', 'trade', 'buy', { symbol: 'BTCUSD', amount: 1 }, 'success');
console.log(`   记录操作日志: ${logId}`);
const operationLogs = operationLog.getOperationLogs({ userId: 'user123' });
console.log(`   操作日志数量: ${operationLogs.length}`);

console.log('\n=== 演示完成 ===');