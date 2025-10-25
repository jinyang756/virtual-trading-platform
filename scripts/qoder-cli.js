#!/usr/bin/env node

/**
 * Qoder CLI - 简化版命令行接口
 * 支持中文指令执行系统总控任务
 */

const { spawn } = require('child_process');
const path = require('path');

// 支持标准化的命令格式
const commands = {
    "启动系统": "npx pm2 start config/pm2/ecosystem.config.js",
    "停止系统": "npx pm2 stop config/pm2/ecosystem.config.js",
    "重启系统": "npx pm2 restart config/pm2/ecosystem.config.js",
    "查看状态": "npx pm2 list",
    "查看日志": "npx pm2 logs",
    "开发模式启动": "npm run dev",
    "前端开发": "cd web && npm run dev",
    "系统状态检查": "npm run status",
    "健康检查": "npm run health"
};

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
    console.log('标准化命令:');
    Object.keys(commands).forEach(cmd => {
      console.log(`  ${cmd}`);
    });
    console.log('');
    console.log('使用方法:');
    console.log('  node scripts/qoder-cli.js "执行系统总控任务"');
    console.log('  node scripts/qoder-cli.js "启动系统"');
  }

  // 解析自然语言命令
  parseCommand(commandText) {
    for (let [keyword, cmd] of Object.entries(commands)) {
      if (commandText.includes(keyword)) {
        return cmd;
      }
    }
    return null;
  }

  /**
   * 执行指令
   */
  executeCommand(command) {
    console.log(`🚀 执行指令: ${command}`);
    
    // 首先检查是否是标准化命令
    const standardCommand = this.parseCommand(command);
    if (standardCommand) {
      console.log(`⚙️  执行标准化命令: ${standardCommand}`);
      // 这里需要解析命令并执行
      const parts = standardCommand.split(' ');
      const executable = parts[0];
      const args = parts.slice(1);
      
      // 特殊处理 cd 命令
      if (standardCommand.startsWith('cd ')) {
        const dir = standardCommand.split(' ')[1];
        process.chdir(dir);
        const remainingCommand = standardCommand.split(' && ')[1];
        const remainingParts = remainingCommand.split(' ');
        const child = spawn(remainingParts[0], remainingParts.slice(1), {
          stdio: 'inherit',
          shell: true
        });
        child.on('close', (code) => {
          if (code === 0) {
            console.log('✅ 指令执行完成');
          } else {
            console.error(`❌ 指令执行失败，退出码: ${code}`);
            process.exit(code);
          }
        });
        return;
      }
      
      const child = spawn(executable, args, {
        stdio: 'inherit',
        shell: true
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
      return;
    }
    
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