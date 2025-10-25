#!/usr/bin/env node

/**
 * 监控虚拟交易引擎状态脚本
 * 用于监控所有交易引擎的运行状态，及时发现和报告问题
 */

const path = require('path');

class EngineMonitor {
  constructor() {
    this.checkInterval = null;
    this.lastCheckTime = null;
    this.engineStatus = {
      contract: 'unknown',
      binary: 'unknown',
      fund: 'unknown'
    };
  }

  // 开始监控
  start() {
    console.log('开始监控虚拟交易引擎状态...');
    this.checkEngines();
    this.checkInterval = setInterval(() => {
      this.checkEngines();
    }, 30000); // 每30秒检查一次
  }

  // 停止监控
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    console.log('已停止监控虚拟交易引擎状态');
  }

  // 检查引擎状态
  async checkEngines() {
    try {
      this.lastCheckTime = new Date();
      console.log(`\n[${this.lastCheckTime.toISOString()}] 检查引擎状态...`);

      // 尝试加载引擎模块
      const engineModulePath = path.join(__dirname, 'src', 'engine', 'index.js');
      let engine;
      
      try {
        engine = require(engineModulePath);
        console.log('  ✓ 引擎模块加载成功');
      } catch (loadError) {
        console.error('  ✗ 引擎模块加载失败:', loadError.message);
        this.reportError('引擎模块加载失败', loadError);
        return;
      }

      // 检查各个子引擎
      await this.checkContractEngine(engine);
      await this.checkBinaryEngine(engine);
      await this.checkFundEngine(engine);

      // 检查基本功能
      await this.checkBasicFunctions(engine);

      console.log('  ✓ 所有引擎状态检查完成');
    } catch (error) {
      console.error('  ✗ 检查引擎状态时出错:', error.message);
      this.reportError('检查引擎状态时出错', error);
    }
  }

  // 检查合约引擎
  async checkContractEngine(engine) {
    try {
      if (engine && engine.contractEngine) {
        // 检查基本属性
        if (engine.contractEngine.currentPrices) {
          const symbolCount = Object.keys(engine.contractEngine.currentPrices).length;
          console.log(`  ✓ 合约引擎: ${symbolCount} 个交易品种`);
          this.engineStatus.contract = 'running';
        } else {
          console.warn('  ⚠ 合约引擎: 缺少价格数据');
          this.engineStatus.contract = 'warning';
        }
      } else {
        console.warn('  ⚠ 合约引擎: 未初始化');
        this.engineStatus.contract = 'not_initialized';
      }
    } catch (error) {
      console.error('  ✗ 合约引擎检查失败:', error.message);
      this.engineStatus.contract = 'error';
      this.reportError('合约引擎检查失败', error);
    }
  }

  // 检查二元期权引擎
  async checkBinaryEngine(engine) {
    try {
      if (engine && engine.binaryEngine) {
        // 检查基本属性
        if (engine.binaryEngine.strategies) {
          const strategyCount = Object.keys(engine.binaryEngine.strategies).length;
          console.log(`  ✓ 二元期权引擎: ${strategyCount} 个交易策略`);
          this.engineStatus.binary = 'running';
        } else {
          console.warn('  ⚠ 二元期权引擎: 缺少策略数据');
          this.engineStatus.binary = 'warning';
        }
      } else {
        console.warn('  ⚠ 二元期权引擎: 未初始化');
        this.engineStatus.binary = 'not_initialized';
      }
    } catch (error) {
      console.error('  ✗ 二元期权引擎检查失败:', error.message);
      this.engineStatus.binary = 'error';
      this.reportError('二元期权引擎检查失败', error);
    }
  }

  // 检查私募基金引擎
  async checkFundEngine(engine) {
    try {
      if (engine && engine.fundEngine) {
        // 检查基本属性
        if (engine.fundEngine.funds) {
          const fundCount = Object.keys(engine.fundEngine.funds).length;
          console.log(`  ✓ 私募基金引擎: ${fundCount} 个基金产品`);
          this.engineStatus.fund = 'running';
        } else {
          console.warn('  ⚠ 私募基金引擎: 缺少基金数据');
          this.engineStatus.fund = 'warning';
        }
      } else {
        console.warn('  ⚠ 私募基金引擎: 未初始化');
        this.engineStatus.fund = 'not_initialized';
      }
    } catch (error) {
      console.error('  ✗ 私募基金引擎检查失败:', error.message);
      this.engineStatus.fund = 'error';
      this.reportError('私募基金引擎检查失败', error);
    }
  }

  // 检查基本功能
  async checkBasicFunctions(engine) {
    try {
      if (engine && typeof engine.getAllMarketData === 'function') {
        const marketData = engine.getAllMarketData();
        console.log('  ✓ 基本功能: 市场数据获取正常');
      } else {
        console.warn('  ⚠ 基本功能: 缺少市场数据获取功能');
      }
    } catch (error) {
      console.error('  ✗ 基本功能检查失败:', error.message);
      this.reportError('基本功能检查失败', error);
    }
  }

  // 报告错误
  reportError(message, error) {
    // 在实际应用中，这里可以发送告警邮件或调用监控API
    console.error(`[ERROR] ${message}:`, error.message);
    
    // 记录到日志文件
    try {
      const fs = require('fs');
      const logEntry = `[${new Date().toISOString()}] ERROR: ${message} - ${error.message}\n`;
      fs.appendFileSync(path.join(__dirname, 'logs', 'engine-monitor.log'), logEntry);
    } catch (logError) {
      console.error('  写入日志文件失败:', logError.message);
    }
  }

  // 获取引擎状态报告
  getStatusReport() {
    return {
      timestamp: this.lastCheckTime,
      engineStatus: this.engineStatus,
      status: this.getOverallStatus()
    };
  }

  // 获取整体状态
  getOverallStatus() {
    const statuses = Object.values(this.engineStatus);
    if (statuses.includes('error')) {
      return 'error';
    }
    if (statuses.includes('warning') || statuses.includes('not_initialized')) {
      return 'warning';
    }
    if (statuses.every(status => status === 'running')) {
      return 'healthy';
    }
    return 'unknown';
  }
}

// 如果直接运行此脚本，则启动监控
if (require.main === module) {
  const monitor = new EngineMonitor();
  
  // 处理退出信号
  process.on('SIGTERM', () => {
    console.log('收到SIGTERM信号，停止监控...');
    monitor.stop();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('收到SIGINT信号，停止监控...');
    monitor.stop();
    process.exit(0);
  });

  // 启动监控
  monitor.start();
}

module.exports = EngineMonitor;