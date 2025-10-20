#!/usr/bin/env node

/**
 * 系统健康检查脚本
 */

const os = require('os');
const { exec } = require('child_process');
const dbAdapter = require('../src/database/dbAdapter');

// 执行命令的函数
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// 检查CPU使用率
function checkCPU() {
  return new Promise((resolve) => {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;
    
    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });
    
    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    
    resolve({
      usage: ((total - idle) / total * 100).toFixed(2),
      cores: cpus.length
    });
  });
}

// 检查内存使用率
function checkMemory() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  
  return {
    total: (totalMem / 1024 / 1024 / 1024).toFixed(2), // GB
    used: (usedMem / 1024 / 1024 / 1024).toFixed(2), // GB
    free: (freeMem / 1024 / 1024 / 1024).toFixed(2), // GB
    usage: ((usedMem / totalMem) * 100).toFixed(2) // 百分比
  };
}

// 检查磁盘使用率
async function checkDisk() {
  try {
    const result = await executeCommand('df -h /');
    const lines = result.stdout.trim().split('\n');
    const diskInfo = lines[1].split(/\s+/);
    
    return {
      total: diskInfo[1],
      used: diskInfo[2],
      available: diskInfo[3],
      usage: diskInfo[4]
    };
  } catch (error) {
    return {
      error: error.message
    };
  }
}

// 检查数据库连接
async function checkDatabase() {
  try {
    const result = await dbAdapter.testConnection();
    return {
      status: result.success ? '正常' : '异常',
      message: result.message,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: '异常',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// 检查应用进程
async function checkAppProcess() {
  try {
    const result = await executeCommand('ps aux | grep "node.*start.js" | grep -v grep');
    const processes = result.stdout.trim().split('\n').filter(line => line.length > 0);
    
    return {
      running: processes.length > 0,
      count: processes.length,
      processes: processes.map(line => {
        const parts = line.split(/\s+/);
        return {
          user: parts[0],
          pid: parts[1],
          cpu: parts[2],
          memory: parts[3]
        };
      })
    };
  } catch (error) {
    return {
      running: false,
      error: error.message
    };
  }
}

// 检查网络连接
async function checkNetwork() {
  try {
    // 检查外部连接
    await executeCommand('ping -c 1 8.8.8.8');
    return {
      internet: '正常'
    };
  } catch (error) {
    return {
      internet: '异常',
      error: error.message
    };
  }
}

// 检查应用API
async function checkAppAPI() {
  try {
    const result = await executeCommand('curl -f http://localhost:3001/health || exit 1');
    return {
      status: result.stdout.includes('OK') ? '正常' : '异常',
      response: result.stdout
    };
  } catch (error) {
    return {
      status: '异常',
      error: error.message
    };
  }
}

// 故障自愈功能
async function selfHealing() {
  try {
    console.log('执行故障自愈检查...');
    
    // 检查应用是否运行
    const appProcess = await checkAppProcess();
    if (!appProcess.running) {
      console.log('应用未运行，尝试重启...');
      await executeCommand('npm start &');
      console.log('应用重启完成');
    }
    
    // 检查数据库连接
    const db = await checkDatabase();
    if (db.status !== '正常') {
      console.log('数据库连接异常，尝试重启数据库服务...');
      // 这里可以添加数据库重启逻辑
    }
    
    console.log('故障自愈检查完成');
  } catch (error) {
    console.error('故障自愈执行失败:', error.message);
  }
}

// 主健康检查函数
async function healthCheck() {
  try {
    console.log('=== 系统健康检查 ===');
    console.log(`检查时间: ${new Date().toLocaleString()}`);
    console.log(`主机名: ${os.hostname()}`);
    console.log(`平台: ${os.platform()} ${os.arch()}`);
    
    // CPU检查
    console.log('\n--- CPU检查 ---');
    const cpu = await checkCPU();
    console.log(`CPU核心数: ${cpu.cores}`);
    console.log(`CPU使用率: ${cpu.usage}%`);
    
    // 内存检查
    console.log('\n--- 内存检查 ---');
    const memory = checkMemory();
    console.log(`总内存: ${memory.total} GB`);
    console.log(`已用内存: ${memory.used} GB`);
    console.log(`可用内存: ${memory.free} GB`);
    console.log(`内存使用率: ${memory.usage}%`);
    
    // 磁盘检查
    console.log('\n--- 磁盘检查 ---');
    const disk = await checkDisk();
    if (disk.error) {
      console.log(`磁盘检查失败: ${disk.error}`);
    } else {
      console.log(`磁盘总容量: ${disk.total}`);
      console.log(`磁盘已用: ${disk.used}`);
      console.log(`磁盘可用: ${disk.available}`);
      console.log(`磁盘使用率: ${disk.usage}`);
    }
    
    // 数据库检查
    console.log('\n--- 数据库检查 ---');
    const database = await checkDatabase();
    console.log(`数据库状态: ${database.status}`);
    if (database.error) {
      console.log(`数据库错误: ${database.error}`);
    }
    
    // 应用进程检查
    console.log('\n--- 应用进程检查 ---');
    const appProcess = await checkAppProcess();
    console.log(`应用运行状态: ${appProcess.running ? '运行中' : '未运行'}`);
    if (appProcess.running) {
      console.log(`运行实例数: ${appProcess.count}`);
      appProcess.processes.forEach((proc, index) => {
        console.log(`  进程 ${index + 1}: PID ${proc.pid}, CPU ${proc.cpu}%, 内存 ${proc.memory}%`);
      });
    }
    
    // 网络检查
    console.log('\n--- 网络检查 ---');
    const network = await checkNetwork();
    console.log(`网络连接: ${network.internet}`);
    if (network.error) {
      console.log(`网络错误: ${network.error}`);
    }
    
    // 应用API检查
    console.log('\n--- 应用API检查 ---');
    const appAPI = await checkAppAPI();
    console.log(`API状态: ${appAPI.status}`);
    if (appAPI.error) {
      console.log(`API错误: ${appAPI.error}`);
    }
    
    console.log('\n=== 健康检查完成 ===');
    
    // 返回检查结果
    return {
      timestamp: new Date().toISOString(),
      cpu,
      memory,
      disk,
      database,
      appProcess,
      network,
      appAPI
    };
  } catch (error) {
    console.error('健康检查执行失败:', error.message);
    process.exit(1);
  }
}

// 创建性能监控面板数据
async function createPerformanceDashboard() {
  try {
    console.log('\n=== 性能监控面板数据 ===');
    
    // 获取系统指标
    const cpu = await checkCPU();
    const memory = checkMemory();
    const disk = await checkDisk();
    const database = await checkDatabase();
    
    // 格式化数据用于监控面板
    const dashboardData = {
      system: {
        cpu: `${cpu.usage}%`,
        memory: `${memory.usage}%`,
        disk: disk.usage || 'N/A',
        uptime: `${(os.uptime() / 3600).toFixed(2)}小时`
      },
      database: {
        status: database.status
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('监控面板数据:');
    console.log(JSON.stringify(dashboardData, null, 2));
    
    // 保存到文件
    const fs = require('fs').promises;
    const path = require('path');
    const dashboardFile = path.join(__dirname, '..', 'data', 'dashboard.json');
    await fs.writeFile(dashboardFile, JSON.stringify(dashboardData, null, 2));
    
    console.log(`监控面板数据已保存到: ${dashboardFile}`);
    
    return dashboardData;
  } catch (error) {
    console.error('创建性能监控面板数据失败:', error.message);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--self-healing')) {
    await selfHealing();
  } else if (args.includes('--dashboard')) {
    await createPerformanceDashboard();
  } else {
    await healthCheck();
  }
}

// 执行主函数
if (require.main === module) {
  main();
}

module.exports = {
  healthCheck,
  selfHealing,
  createPerformanceDashboard
};