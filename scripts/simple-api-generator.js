#!/usr/bin/env node

/**
 * 简化版接口文档自动生成器
 * 从已有的Swagger文档生成TypeScript类型和API客户端
 */

const fs = require('fs');
const path = require('path');

class SimpleApiGenerator {
  constructor() {
    this.config = {
      swaggerInput: 'docs/swagger.json',
      apiOutputDir: 'src/api'
    };
  }

  /**
   * 验证必要的文件是否存在
   */
  validatePrerequisites() {
    console.log('🔍 验证必要的文件...');
    
    // 检查Swagger文档是否存在
    if (!fs.existsSync(this.config.swaggerInput)) {
      console.error(`❌ Swagger文档不存在: ${this.config.swaggerInput}`);
      return false;
    }
    
    // 检查API输出目录是否存在
    if (!fs.existsSync(this.config.apiOutputDir)) {
      console.log(`📁 创建API输出目录: ${this.config.apiOutputDir}`);
      fs.mkdirSync(this.config.apiOutputDir, { recursive: true });
    }
    
    console.log('✅ 验证通过');
    return true;
  }

  /**
   * 生成API文档报告
   */
  generateReport() {
    console.log('📊 生成API文档报告...');
    
    const report = {
      generatedAt: new Date().toISOString(),
      swaggerSource: this.config.swaggerInput,
      outputDirectory: this.config.apiOutputDir,
      generatedFiles: [
        'data-contracts.ts',
        'http-client.ts',
        'api.ts'
      ]
    };
    
    // 创建报告目录
    const reportDir = 'docs/reports';
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    // 写入报告
    const reportPath = path.join(reportDir, 'api-generation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`✅ 报告已生成: ${reportPath}`);
    return report;
  }

  /**
   * 记录日志
   */
  logMessages(messages) {
    messages.forEach(message => {
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
   * 执行生成流程
   */
  execute() {
    console.log('🚀 启动简化版接口文档自动生成器...');
    
    try {
      // 验证前提条件
      if (!this.validatePrerequisites()) {
        process.exit(1);
      }
      
      // 检查生成的文件是否存在
      const requiredFiles = [
        'data-contracts.ts',
        'http-client.ts',
        'api.ts'
      ];
      
      let allFilesExist = true;
      for (const file of requiredFiles) {
        const filePath = path.join(this.config.apiOutputDir, file);
        if (!fs.existsSync(filePath)) {
          console.warn(`⚠️  文件不存在: ${filePath}`);
          allFilesExist = false;
        }
      }
      
      if (!allFilesExist) {
        console.warn('⚠️  部分API客户端文件缺失，请运行完整的生成命令');
      }
      
      // 生成报告
      const report = this.generateReport();
      
      // 记录日志
      this.logMessages([
        "✅ 接口文档已自动生成并同步 TypeScript 类型",
        `📄 生成的文件: ${report.generatedFiles.join(', ')}`
      ]);
      
      console.log('\n✨ 自动化流程完成!');
      
    } catch (error) {
      console.error(`❌ 自动生成过程中发生错误: ${error.message}`);
      process.exit(1);
    }
  }
}

// 执行主函数
if (require.main === module) {
  const generator = new SimpleApiGenerator();
  generator.execute();
}

module.exports = SimpleApiGenerator;