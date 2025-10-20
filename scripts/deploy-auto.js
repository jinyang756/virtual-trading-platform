#!/usr/bin/env node

/**
 * 自动化部署脚本
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

// 执行命令的函数
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`执行命令: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行失败: ${error.message}`);
        reject(error);
      } else {
        console.log(`执行成功`);
        if (stdout) console.log(`输出: ${stdout}`);
        if (stderr) console.log(`错误: ${stderr}`);
        resolve({ stdout, stderr });
      }
    });
  });
}

// 检查Docker是否安装
async function checkDocker() {
  try {
    await executeCommand('docker --version');
    console.log('Docker已安装');
    return true;
  } catch (error) {
    console.error('Docker未安装，请先安装Docker');
    return false;
  }
}

// 检查Docker Compose是否安装
async function checkDockerCompose() {
  try {
    await executeCommand('docker-compose --version');
    console.log('Docker Compose已安装');
    return true;
  } catch (error) {
    console.error('Docker Compose未安装，请先安装Docker Compose');
    return false;
  }
}

// 构建Docker镜像
async function buildDockerImage() {
  try {
    console.log('开始构建Docker镜像...');
    await executeCommand('docker build -t trading-platform .');
    console.log('Docker镜像构建完成');
  } catch (error) {
    throw new Error(`构建Docker镜像失败: ${error.message}`);
  }
}

// 启动Docker Compose服务
async function startDockerCompose() {
  try {
    console.log('启动Docker Compose服务...');
    await executeCommand('docker-compose up -d');
    console.log('Docker Compose服务启动完成');
  } catch (error) {
    throw new Error(`启动Docker Compose服务失败: ${error.message}`);
  }
}

// 停止Docker Compose服务
async function stopDockerCompose() {
  try {
    console.log('停止Docker Compose服务...');
    await executeCommand('docker-compose down');
    console.log('Docker Compose服务已停止');
  } catch (error) {
    throw new Error(`停止Docker Compose服务失败: ${error.message}`);
  }
}

// 执行数据库迁移
async function runDatabaseMigration() {
  try {
    console.log('执行数据库迁移...');
    await executeCommand('docker-compose exec app npm run init-db');
    console.log('数据库迁移完成');
  } catch (error) {
    throw new Error(`数据库迁移失败: ${error.message}`);
  }
}

// 初始化数据
async function initData() {
  try {
    console.log('初始化数据...');
    await executeCommand('docker-compose exec app npm run init-data');
    console.log('数据初始化完成');
  } catch (error) {
    throw new Error(`数据初始化失败: ${error.message}`);
  }
}

// 蓝绿部署
async function blueGreenDeploy() {
  try {
    console.log('开始蓝绿部署...');
    
    // 停止当前服务
    await stopDockerCompose();
    
    // 拉取最新代码
    await executeCommand('git pull');
    
    // 构建新镜像
    await buildDockerImage();
    
    // 启动新服务
    await startDockerCompose();
    
    // 等待服务启动
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // 检查服务状态
    await executeCommand('docker-compose ps');
    
    console.log('蓝绿部署完成');
  } catch (error) {
    throw new Error(`蓝绿部署失败: ${error.message}`);
  }
}

// 健康检查
async function healthCheck() {
  try {
    console.log('执行健康检查...');
    
    // 检查应用是否响应
    const result = await executeCommand('curl -f http://localhost:3001/health || exit 1');
    
    if (result.stdout.includes('OK')) {
      console.log('健康检查通过');
      return true;
    } else {
      throw new Error('健康检查失败');
    }
  } catch (error) {
    throw new Error(`健康检查失败: ${error.message}`);
  }
}

// 主部署函数
async function deploy() {
  try {
    console.log('=== 开始自动化部署 ===');
    
    // 检查依赖
    const dockerInstalled = await checkDocker();
    const dockerComposeInstalled = await checkDockerCompose();
    
    if (!dockerInstalled || !dockerComposeInstalled) {
      throw new Error('依赖检查失败');
    }
    
    // 拉取最新代码
    console.log('拉取最新代码...');
    await executeCommand('git pull');
    
    // 构建Docker镜像
    await buildDockerImage();
    
    // 启动服务
    await startDockerCompose();
    
    // 等待服务启动
    console.log('等待服务启动...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // 执行数据库迁移（如果需要）
    try {
      await runDatabaseMigration();
    } catch (error) {
      console.log('数据库迁移跳过（可能已存在）');
    }
    
    // 初始化数据（如果需要）
    try {
      await initData();
    } catch (error) {
      console.log('数据初始化跳过（可能已存在）');
    }
    
    // 执行健康检查
    await healthCheck();
    
    console.log('=== 自动化部署完成 ===');
  } catch (error) {
    console.error('部署失败:', error.message);
    process.exit(1);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--blue-green')) {
    await blueGreenDeploy();
  } else if (args.includes('--health')) {
    await healthCheck();
  } else if (args.includes('--stop')) {
    await stopDockerCompose();
  } else {
    await deploy();
  }
}

// 执行主函数
if (require.main === module) {
  main();
}

module.exports = {
  deploy,
  blueGreenDeploy,
  healthCheck
};