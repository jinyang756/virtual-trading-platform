#!/usr/bin/env node

/**
 * 性能监控测试脚本
 * 用于测试前端性能监控功能是否正常工作
 */

const path = require('path');

async function testPerformanceMonitoring() {
  try {
    console.log('开始测试性能监控功能...');
    
    // 模拟发送性能数据到服务器
    const testData = {
      dnsTime: 45,
      tcpTime: 120,
      requestTime: 85,
      domParseTime: 210,
      totalLoadTime: 1200,
      'app-load-time': 850,
      'trading-panel-load-time': 420,
      'fetch-market-data-time': 75,
      'fetch-positions-time': 65,
      'place-trade-time': 180
    };
    
    console.log('1. 测试发送性能数据...');
    
    // 发送测试数据到服务器
    const response = await fetch('http://localhost:3002/api/performance/metrics/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': 'test-user-123'
      },
      body: JSON.stringify(testData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('  ✓ 性能数据发送成功:', result.message);
    } else {
      console.error('  ✗ 性能数据发送失败:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('  错误详情:', errorText);
      return false;
    }
    
    console.log('2. 测试获取性能报告...');
    
    // 获取性能报告
    const reportResponse = await fetch('http://localhost:3002/api/performance/metrics/performance/report');
    
    if (reportResponse.ok) {
      const reportResult = await reportResponse.json();
      console.log('  ✓ 性能报告获取成功');
      console.log('  报告数据:', JSON.stringify(reportResult.data, null, 2));
    } else {
      console.error('  ✗ 性能报告获取失败:', reportResponse.status, reportResponse.statusText);
      const errorText = await reportResponse.text();
      console.error('  错误详情:', errorText);
      return false;
    }
    
    console.log('\n🎉 性能监控功能测试通过！');
    console.log('前端性能监控已成功集成并可以正常工作。');
    
    return true;
  } catch (error) {
    console.error('性能监控功能测试失败:', error);
    return false;
  }
}

// 如果直接运行此脚本，则执行测试
if (require.main === module) {
  testPerformanceMonitoring().then(success => {
    if (success) {
      console.log('\n✅ 测试完成，性能监控功能正常！');
      process.exit(0);
    } else {
      console.log('\n❌ 测试失败，性能监控功能有问题！');
      process.exit(1);
    }
  }).catch(error => {
    console.error('测试过程中发生错误:', error);
    process.exit(1);
  });
}

module.exports = { testPerformanceMonitoring };