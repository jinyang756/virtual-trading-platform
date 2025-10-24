#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// 任务配置
const taskConfig = {
  "name": "field-change-notifier",
  "description": "字段变更后自动生成日志、通知前端并同步接口文档",
  "triggers": ["field-renamed", "field-type-changed", "field-removed"],
  "steps": [
    {
      "action": "detect-field-change",
      "args": {
        "baseId": "bsesJG9zTxCFYUdcNyV",
        "tableId": "tblNrHE1BPVDXZZ92uf"
      }
    },
    {
      "action": "generate-change-log",
      "args": {
        "format": "markdown",
        "output": "logs/field-changes.md"
      }
    },
    {
      "action": "notify",
      "args": {
        "channel": "frontend-team",
        "message": "字段结构已更新，请同步前端接口模型"
      }
    },
    {
      "action": "update-api-docs",
      "args": {
        "source": "logs/field-changes.md",
        "target": "docs/api/fund-schema.md"
      }
    },
    {
      "action": "log",
      "args": ["✅ 字段变更已记录、通知并同步文档"]
    }
  ]
};

// 模拟字段变更数据
const mockFieldChanges = [
  {
    type: "field-renamed",
    timestamp: new Date().toISOString(),
    table: "funds",
    oldName: "nav_history",
    newName: "net_value_history",
    description: "重命名字段以提高语义清晰度"
  },
  {
    type: "field-type-changed",
    timestamp: new Date().toISOString(),
    table: "funds",
    fieldName: "risk_level",
    oldType: "SingleLineText",
    newType: "SingleSelect",
    description: "更改字段类型以支持预定义选项"
  },
  {
    type: "field-removed",
    timestamp: new Date().toISOString(),
    table: "funds",
    fieldName: "old_field",
    description: "移除已废弃的字段"
  }
];

class FieldChangeNotifier {
  constructor(config) {
    this.config = config;
  }

  // 检测字段变更
  async detectFieldChange(args) {
    console.log('🔍 检测字段变更...');
    console.log(`  Base ID: ${args.baseId}`);
    console.log(`  Table ID: ${args.tableId}`);
    
    // 模拟检测逻辑
    // 在实际应用中，这里会连接到Teable API检测字段变更
    const changes = mockFieldChanges;
    
    console.log(`  发现 ${changes.length} 个字段变更`);
    return changes;
  }

  // 生成变更日志
  async generateChangeLog(changes, format, output) {
    console.log('📝 生成变更日志...');
    
    // 确保日志目录存在
    const logDir = path.dirname(output);
    try {
      await fs.access(logDir);
    } catch (error) {
      await fs.mkdir(logDir, { recursive: true });
    }
    
    // 生成日志内容
    let logContent = `# 字段变更日志\n\n`;
    logContent += `生成时间: ${new Date().toISOString()}\n\n`;
    
    changes.forEach((change, index) => {
      logContent += `## 变更 #${index + 1}\n`;
      logContent += `- 类型: ${change.type}\n`;
      logContent += `- 时间: ${change.timestamp}\n`;
      logContent += `- 表名: ${change.table}\n`;
      
      switch (change.type) {
        case "field-renamed":
          logContent += `- 字段重命名: ${change.oldName} → ${change.newName}\n`;
          break;
        case "field-type-changed":
          logContent += `- 字段类型变更: ${change.fieldName} (${change.oldType} → ${change.newType})\n`;
          break;
        case "field-removed":
          logContent += `- 字段移除: ${change.fieldName}\n`;
          break;
      }
      
      logContent += `- 描述: ${change.description}\n\n`;
    });
    
    // 写入日志文件
    await fs.writeFile(output, logContent);
    console.log(`  日志已保存到: ${output}`);
    
    return output;
  }

  // 发送通知
  async notify(channel, message) {
    console.log('🔔 发送通知...');
    console.log(`  频道: ${channel}`);
    console.log(`  消息: ${message}`);
    
    // 模拟通知发送
    // 在实际应用中，这里会集成企业微信、钉钉或Slack等通知服务
    console.log('  通知已发送到前端团队');
    
    return true;
  }

  // 更新API文档
  async updateApiDocs(source, target) {
    console.log('📚 更新API文档...');
    
    try {
      // 读取变更日志
      const changeLog = await fs.readFile(source, 'utf8');
      
      // 确保文档目录存在
      const docDir = path.dirname(target);
      try {
        await fs.access(docDir);
      } catch (error) {
        await fs.mkdir(docDir, { recursive: true });
      }
      
      // 读取现有文档（如果存在）
      let existingDoc = '';
      try {
        existingDoc = await fs.readFile(target, 'utf8');
      } catch (error) {
        // 如果文档不存在，创建新文档
        existingDoc = '# 基金接口文档\n\n';
      }
      
      // 更新文档
      const updatedDoc = existingDoc + '\n' + changeLog;
      await fs.writeFile(target, updatedDoc);
      
      console.log(`  API文档已更新: ${target}`);
      return target;
    } catch (error) {
      console.error('  更新API文档失败:', error.message);
      throw error;
    }
  }

  // 记录日志
  log(messages) {
    messages.forEach(message => console.log(message));
  }

  // 执行任务流
  async execute() {
    console.log(`🚀 执行任务: ${taskConfig.name}`);
    console.log(`📋 任务描述: ${taskConfig.description}`);
    
    let changes = [];
    let logFile = '';
    let docFile = '';
    
    try {
      for (const step of taskConfig.steps) {
        switch (step.action) {
          case "detect-field-change":
            changes = await this.detectFieldChange(step.args);
            break;
            
          case "generate-change-log":
            logFile = await this.generateChangeLog(changes, step.args.format, step.args.output);
            break;
            
          case "notify":
            await this.notify(step.args.channel, step.args.message);
            break;
            
          case "update-api-docs":
            docFile = await this.updateApiDocs(step.args.source, step.args.target);
            break;
            
          case "log":
            this.log(step.args);
            break;
            
          default:
            console.warn(`未知的操作: ${step.action}`);
        }
      }
      
      // 输出详细结果
      console.log('\n📊 执行结果汇总:');
      console.log(`  检测到字段变更: ${changes.length} 个`);
      console.log(`  生成变更日志: ${logFile}`);
      console.log(`  更新API文档: ${docFile}`);
      
      console.log('\n✅ 任务执行完成');
      
    } catch (error) {
      console.error('❌ 任务执行失败:', error.message);
      process.exit(1);
    }
  }
}

// 主执行函数
async function main() {
  const notifier = new FieldChangeNotifier(taskConfig);
  await notifier.execute();
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = FieldChangeNotifier;