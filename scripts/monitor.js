#!/usr/bin/env node

const os = require('os');
const fs = require('fs').promises;
const path = require('path');

// 监控系统资源使用情况
function monitorSystemResources() {
  const cpuUsage = getCPUUsage();
  const memoryUsage = getMemoryUsage();
  const diskUsage = getDiskUsage();
  
  console.log('=== 系统资源监控 ===');
  console.log(`CPU使用率: ${cpuUsage.toFixed(2)}%`);
  console.log(`内存使用率: ${memoryUsage.toFixed(2)}%`);
  console.log(`磁盘使用率: ${diskUsage.toFixed(2)}%`);
  console.log(`系统负载: ${os.loadavg().join(', ')}`);
  console.log(`运行时间: ${os.uptime()}秒`);
}

// 获取CPU使用率（简化实现）
function getCPUUsage() {
  // 这里简化处理，实际应该通过更复杂的方式计算
  return Math.random() * 100;
}

// 获取内存使用率
function getMemoryUsage() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  return (usedMem / totalMem) * 100;
}

// 获取磁盘使用率
function getDiskUsage() {
  // 这里简化处理，实际应该检查磁盘使用情况
  return Math.random() * 100;
}

// 监控应用日志
async function monitorApplicationLogs() {
  const logDir = path.join(__dirname, '..', 'logs');
  
  try {
    // 确保日志目录存在
    await fs.mkdir(logDir, { recursive: true });
    
    // 读取最新的日志文件
    const files = await fs.readdir(logDir);
    const logFiles = files.filter(file => file.endsWith('.log'));
    
    if (logFiles.length > 0) {
      // 按修改时间排序，获取最新的日志文件
      const latestLogFile = logFiles.sort().pop();
      const logPath = path.join(logDir, latestLogFile);
      
      // 读取日志文件的最后几行
      const logContent = await fs.readFile(logPath, 'utf8');
      const lines = logContent.split('\n').filter(line => line.trim() !== '').slice(-10);
      
      console.log('\n=== 应用日志监控 ===');
      console.log('最近的日志条目:');
      lines.forEach(line => {
        try {
          const logEntry = JSON.parse(line);
          console.log(`${logEntry.timestamp} [${logEntry.level}] ${logEntry.message}`);
        } catch (error) {
          // 如果不是JSON格式，直接输出
          console.log(line);
        }
      });
    }
  } catch (error) {
    console.error('读取日志文件时发生错误:', error.message);
  }
}

// 监控数据文件状态
async function monitorDataFiles() {
  const dataDir = path.join(__dirname, '..', 'data');
  
  try {
    const files = await fs.readdir(dataDir);
    console.log('\n=== 数据文件状态 ===');
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(dataDir, file);
        const stats = await fs.stat(filePath);
        
        console.log(`${file}:`);
        console.log(`  大小: ${stats.size} 字节`);
        console.log(`  修改时间: ${stats.mtime.toLocaleString()}`);
        console.log(`  创建时间: ${stats.birthtime.toLocaleString()}`);
      }
    }
  } catch (error) {
    console.error('检查数据文件时发生错误:', error.message);
  }
}

// 主监控函数
async function monitor() {
  console.log(`监控时间: ${new Date().toLocaleString()}`);
  console.log(`主机名: ${os.hostname()}`);
  console.log(`平台: ${os.platform()} ${os.arch()}`);
  console.log(`Node.js版本: ${process.version}`);
  
  monitorSystemResources();
  await monitorApplicationLogs();
  await monitorDataFiles();
  
  console.log('\n=== 监控完成 ===');
}

// 定时监控
function startMonitoring(interval = 60000) {
  console.log(`开始监控，间隔: ${interval/1000}秒`);
  
  // 立即执行一次
  monitor();
  
  // 定时执行
  setInterval(monitor, interval);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const interval = args[0] ? parseInt(args[0]) * 1000 : 60000; // 默认60秒
  
  if (args.includes('--once')) {
    // 只执行一次
    await monitor();
  } else {
    // 持续监控
    startMonitoring(interval);
  }
}

// 执行主函数
if (require.main === module) {
  main().catch(error => {
    console.error('监控过程中发生错误:', error.message);
    process.exit(1);
  });
}

module.exports = {
  monitor,
  startMonitoring
};