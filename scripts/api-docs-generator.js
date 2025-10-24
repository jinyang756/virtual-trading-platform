#!/usr/bin/env node

/**
 * 接口文档自动生成器 (Qoder JSON 模板实现)
 * 从 Swagger 文档自动生成 TypeScript 类型和 API 请求代码
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ApiDocsGenerator {
  constructor() {
    this.config = {
      swaggerUrl: 'http://localhost:3001/api-docs/swagger.json',
      swaggerOutput: 'docs/swagger.json',
      apiOutputDir: 'src/api',
      apiFileName: 'api.ts'
    };
  }

  /**
   * 下载Swagger文档
   * @param {Object} args - 下载参数
   */
  async downloadSwagger(args) {
    console.log('📥 正在下载 Swagger 文档...');
    
    try {
      const { url, output } = args;
      
      // 检查输出目录是否存在，不存在则创建
      const outputDir = path.dirname(output);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // 这里我们假设swagger.json已经存在，实际项目中可能需要从URL下载
      // 为了演示，我们复制已有的swagger.json文件
      const sourceSwagger = path.join(__dirname, '..', 'docs', 'swagger.json');
      fs.copyFileSync(sourceSwagger, output);
      
      console.log(`✅ Swagger 文档已保存到 ${output}`);
      return true;
    } catch (error) {
      console.error('❌ 下载 Swagger 文档失败:', error.message);
      return false;
    }
  }

  /**
   * 运行命令
   * @param {Object} args - 命令参数
   */
  async runCommand(args) {
    console.log('⚙️  正在执行命令...');
    
    try {
      const { cmd } = args;
      console.log(`执行命令: ${cmd}`);
      execSync(cmd, { stdio: 'inherit' });
      
      console.log('✅ 命令执行成功');
      return true;
    } catch (error) {
      console.error('❌ 命令执行失败:', error.message);
      return false;
    }
  }

  /**
   * 记录日志
   * @param {Array} args - 日志消息数组
   */
  log(args) {
    args.forEach(message => {
      console.log(message);
      
      // 写入日志文件
      const logFile = 'logs/api-generation.log';
      const logDir = path.dirname(logFile);
      
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      const timestamp = new Date().toISOString();
      const logEntry = `[${timestamp}] ${message}\n`;
      
      fs.appendFileSync(logFile, logEntry);
    });
  }

  /**
   * 执行任务流
   */
  async executeTaskFlow() {
    console.log('🚀 启动接口文档自动生成器...');
    
    // 任务流定义 (基于Qoder JSON模板)
    const taskFlow = {
      name: "generate-api-docs",
      description: "从 Swagger 文档自动生成 TypeScript 类型和 API 请求代码",
      triggers: ["schema-updated", "model-changed"],
      steps: [
        {
          action: "download-swagger",
          args: {
            url: "http://localhost:3001/api-docs/swagger.json",
            output: "docs/swagger.json"
          }
        },
        {
          action: "run-command",
          args: {
            cmd: "npx swagger-typescript-api generate -p docs/swagger.json -o src/api -n api.ts --axios"
          }
        },
        {
          action: "log",
          args: ["✅ 接口文档已自动生成并同步 TypeScript 类型"]
        }
      ]
    };

    console.log(`📝 任务流: ${taskFlow.name} - ${taskFlow.description}`);
    
    try {
      // 按顺序执行每个步骤
      for (const [index, step] of taskFlow.steps.entries()) {
        console.log(`\n🔧 步骤 ${index + 1}/${taskFlow.steps.length}: ${step.action}`);
        
        let success = false;
        
        switch (step.action) {
          case 'download-swagger':
            success = await this.downloadSwagger(step.args);
            break;
          case 'run-command':
            success = await this.runCommand(step.args);
            break;
          case 'log':
            this.log(step.args);
            success = true;
            break;
          default:
            console.warn(`⚠️  未知操作: ${step.action}`);
            success = true;
        }
        
        if (!success) {
          console.error(`❌ 步骤执行失败: ${step.action}`);
          process.exit(1);
        }
      }
      
      console.log('\n📄 生成的文件:');
      console.log(`   - ${path.join(this.config.apiOutputDir, 'data-contracts.ts')}`);
      console.log(`   - ${path.join(this.config.apiOutputDir, 'http-client.ts')}`);
      console.log(`   - ${path.join(this.config.apiOutputDir, this.config.apiFileName)}`);
      
      console.log('\n✨ 自动化流程完成!');
    } catch (error) {
      console.error(`❌ 自动生成过程中发生错误: ${error.message}`);
      process.exit(1);
    }
  }
}

// 执行主函数
if (require.main === module) {
  const generator = new ApiDocsGenerator();
  generator.executeTaskFlow();
}

module.exports = ApiDocsGenerator;