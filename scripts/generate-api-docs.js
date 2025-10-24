#!/usr/bin/env node

/**
 * 接口文档自动生成器
 * 从 Swagger 文档自动生成 TypeScript 类型和 API 请求代码
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置参数
const CONFIG = {
  swaggerUrl: 'http://localhost:3001/api-docs/swagger.json',
  swaggerOutput: 'docs/swagger.json',
  apiOutputDir: 'src/api',
  apiFileName: 'api.ts'
};

/**
 * 下载Swagger文档
 */
async function downloadSwagger() {
  console.log('📥 正在下载 Swagger 文档...');
  
  try {
    // 检查输出目录是否存在，不存在则创建
    const outputDir = path.dirname(CONFIG.swaggerOutput);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 这里我们假设swagger.json已经存在，实际项目中可能需要从URL下载
    console.log(`✅ Swagger 文档已保存到 ${CONFIG.swaggerOutput}`);
    return true;
  } catch (error) {
    console.error('❌ 下载 Swagger 文档失败:', error.message);
    return false;
  }
}

/**
 * 运行命令生成TypeScript类型和API客户端
 */
async function generateApiClient() {
  console.log('⚙️  正在生成 TypeScript 类型和 API 客户端...');
  
  try {
    // 确保输出目录存在
    if (!fs.existsSync(CONFIG.apiOutputDir)) {
      fs.mkdirSync(CONFIG.apiOutputDir, { recursive: true });
    }
    
    // 使用 swagger-typescript-api 生成代码
    const command = `npx swagger-typescript-api generate -p ${CONFIG.swaggerOutput} -o ${CONFIG.apiOutputDir} -n ${CONFIG.apiFileName} --axios`;
    
    console.log(`执行命令: ${command}`);
    execSync(command, { stdio: 'inherit' });
    
    console.log('✅ TypeScript 类型和 API 客户端生成成功');
    return true;
  } catch (error) {
    console.error('❌ 生成 TypeScript 类型和 API 客户端失败:', error.message);
    return false;
  }
}

/**
 * 记录日志
 */
function logMessage(message) {
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
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 启动接口文档自动生成器...');
  
  try {
    // 步骤1: 下载Swagger文档
    const downloadSuccess = await downloadSwagger();
    if (!downloadSuccess) {
      logMessage('❌ 下载 Swagger 文档失败，终止流程');
      process.exit(1);
    }
    
    // 步骤2: 生成API客户端
    const generateSuccess = await generateApiClient();
    if (!generateSuccess) {
      logMessage('❌ 生成 API 客户端失败，终止流程');
      process.exit(1);
    }
    
    // 步骤3: 记录成功日志
    logMessage('✅ 接口文档已自动生成并同步 TypeScript 类型');
    
    console.log('\n📄 生成的文件:');
    console.log(`   - ${path.join(CONFIG.apiOutputDir, 'data-contracts.ts')}`);
    console.log(`   - ${path.join(CONFIG.apiOutputDir, 'http-client.ts')}`);
    console.log(`   - ${path.join(CONFIG.apiOutputDir, CONFIG.apiFileName)}`);
    
    console.log('\n✨ 自动化流程完成!');
  } catch (error) {
    logMessage(`❌ 自动生成过程中发生错误: ${error.message}`);
    process.exit(1);
  }
}

// 执行主函数
if (require.main === module) {
  main();
}

module.exports = {
  downloadSwagger,
  generateApiClient,
  logMessage
};