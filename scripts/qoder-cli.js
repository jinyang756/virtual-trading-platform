#!/usr/bin/env node

/**
 * Qoder CLI - 简化版命令行接口
 * 支持中文指令执行系统总控任务
 */

const { spawn } = require('child_process');
const path = require('path');

class QoderCLI {
  constructor() {
    this.scriptPath = path.join(__dirname, 'system-control-panel.js');
  }

  /**
   * 显示帮助信息
   */
  showHelp() {
    console.log('🤖 Qoder 系统总控面板');
    console.log('========================');
    console.log('支持的指令:');
    console.log('  执行系统总控任务     - 执行完整的系统构建、部署和同步任务');
    console.log('  检查所有模块状态     - 检查系统各模块运行状态');
    console.log('  同步数据库并更新文档 - 同步数据库结构并更新相关文档');
    console.log('');
    console.log('使用方法:');
    console.log('  node scripts/qoder-cli.js "执行系统总控任务"');
    console.log('  node scripts/qoder-cli.js "检查所有模块状态"');
    console.log('  node scripts/qoder-cli.js "同步数据库并更新文档"');
  }

  /**
   * 执行指令
   */
  executeCommand(command) {
    console.log(`🚀 执行指令: ${command}`);
    
    // 映射中文指令到具体操作
    const commandMap = {
      '执行系统总控任务': '执行系统总控任务',
      '检查所有模块状态': '检查所有模块状态',
      '同步数据库并更新文档': '同步数据库并更新文档'
    };
    
    const mappedCommand = commandMap[command];
    
    if (!mappedCommand) {
      console.error(`❌ 未知指令: ${command}`);
      this.showHelp();
      process.exit(1);
    }
    
    // 执行系统总控脚本
    const child = spawn('node', [this.scriptPath, mappedCommand], {
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ 指令执行完成');
      } else {
        console.error(`❌ 指令执行失败，退出码: ${code}`);
        process.exit(code);
      }
    });
    
    child.on('error', (error) => {
      console.error(`❌ 执行出错: ${error.message}`);
      process.exit(1);
    });
  }
}

// 主函数
if (require.main === module) {
  const cli = new QoderCLI();
  
  // 检查参数
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    cli.showHelp();
    process.exit(0);
  }
  
  const command = args[0];
  cli.executeCommand(command);
}

module.exports = QoderCLI;