// 性能测试脚本
import { performanceMonitor } from './utils/performance';

// 模拟一些操作并记录性能
function runPerformanceTest() {
  console.log('开始性能测试...');
  
  // 标记开始
  performanceMonitor.mark('test-start');
  
  // 模拟一些耗时操作
  setTimeout(() => {
    // 标记中间点
    performanceMonitor.mark('test-middle');
    
    // 模拟更多操作
    setTimeout(() => {
      // 标记结束
      performanceMonitor.mark('test-end');
      
      // 测量时间
      performanceMonitor.measure('test-operation', 'test-start', 'test-end');
      performanceMonitor.measure('test-first-half', 'test-start', 'test-middle');
      performanceMonitor.measure('test-second-half', 'test-middle', 'test-end');
      
      console.log('性能测试完成');
    }, 200);
  }, 300);
}

// 运行测试
runPerformanceTest();

export {};