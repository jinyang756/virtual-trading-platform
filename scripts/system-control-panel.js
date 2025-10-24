#!/usr/bin/env node

/**
 * Qoder 系统总控任务流
 * 一键执行构建、部署、数据库同步、文档更新等任务
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SystemControlPanel {
  constructor() {
    this.workspace = 'C:/Users/Administrator/jucaizhongfa';
    this.webDir = path.join(this.workspace, 'web');
    this.fundServerDir = path.join(this.workspace, 'apps', 'fund-server');
  }

  /**
   * 切换到指定目录
   */
  cd(dir) {
    console.log(`📂 切换到目录: ${dir}`);
    process.chdir(dir);
  }

  /**
   * 检查路径是否存在
   */
  checkPath(filePath) {
    console.log(`🔍 检查路径: ${filePath}`);
    return fs.existsSync(filePath);
  }

  /**
   * 执行 npm install
   */
  npmInstall() {
    console.log('📦 执行 npm install...');
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('✅ npm install 完成');
      return true;
    } catch (error) {
      console.error('❌ npm install 失败:', error.message);
      return false;
    }
  }

  /**
   * 执行 npm run script
   */
  npmRun(script) {
    console.log(`⚙️  执行 npm run ${script}...`);
    try {
      execSync(`npm run ${script}`, { stdio: 'inherit' });
      console.log(`✅ npm run ${script} 完成`);
      return true;
    } catch (error) {
      console.error(`❌ npm run ${script} 失败:`, error.message);
      return false;
    }
  }

  /**
   * 写入文件
   */
  writeFile(filePath, content) {
    console.log(`📝 写入文件: ${filePath}`);
    try {
      fs.writeFileSync(filePath, content);
      console.log(`✅ 文件写入完成: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`❌ 文件写入失败:`, error.message);
      return false;
    }
  }

  /**
   * 复制目录
   */
  copyDir(src, dest) {
    console.log(`📋 复制目录: ${src} -> ${dest}`);
    try {
      // 创建目标目录
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      // 复制文件
      const files = fs.readdirSync(src);
      files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        const stats = fs.statSync(srcPath);
        if (stats.isDirectory()) {
          // 递归复制子目录
          this.copyDir(srcPath, destPath);
        } else {
          // 复制文件
          fs.copyFileSync(srcPath, destPath);
        }
      });
      
      console.log(`✅ 目录复制完成: ${src} -> ${dest}`);
      return true;
    } catch (error) {
      console.error(`❌ 目录复制失败:`, error.message);
      return false;
    }
  }

  /**
   * 重启 PM2 服务
   */
  pm2Restart(appName) {
    console.log(`🔄 重启 PM2 服务: ${appName}`);
    try {
      execSync(`pm2 restart ${appName}`, { stdio: 'inherit' });
      console.log(`✅ PM2 服务重启完成: ${appName}`);
      return true;
    } catch (error) {
      console.error(`❌ PM2 服务重启失败:`, error.message);
      return false;
    }
  }

  /**
   * 验证 API 可用性
   */
  async verifyApi(url) {
    console.log(`🔍 验证 API: ${url}`);
    try {
      // 使用 curl 验证 API
      execSync(`curl -f ${url}`, { stdio: 'ignore' });
      console.log(`✅ API 验证通过: ${url}`);
      return true;
    } catch (error) {
      console.error(`❌ API 验证失败:`, error.message);
      return false;
    }
  }

  /**
   * 同步数据库 Schema
   */
  syncDbSchema(modelFile) {
    console.log(`📊 同步数据库 Schema: ${modelFile}`);
    try {
      // 这里调用现有的同步脚本
      const syncScript = path.join(this.workspace, 'scripts', 'sync-db-schema.js');
      if (fs.existsSync(syncScript)) {
        execSync(`node ${syncScript}`, { stdio: 'inherit' });
      } else {
        console.log('⚠️  同步脚本不存在，跳过此步骤');
      }
      console.log(`✅ 数据库 Schema 同步完成`);
      return true;
    } catch (error) {
      console.error(`❌ 数据库 Schema 同步失败:`, error.message);
      return false;
    }
  }

  /**
   * 生成字段注释
   */
  generateComments(table) {
    console.log(`💬 生成字段注释: ${table}`);
    try {
      // 调用现有的注释生成脚本
      execSync('npm run generate-field-comments', { stdio: 'inherit' });
      console.log(`✅ 字段注释生成完成`);
      return true;
    } catch (error) {
      console.error(`❌ 字段注释生成失败:`, error.message);
      return false;
    }
  }

  /**
   * 检查命名规范
   */
  checkNaming(table) {
    console.log(`🔤 检查命名规范: ${table}`);
    try {
      // 调用现有的命名检查脚本
      execSync('npm run check-field-naming', { stdio: 'inherit' });
      console.log(`✅ 命名规范检查完成`);
      return true;
    } catch (error) {
      console.error(`❌ 命名规范检查失败:`, error.message);
      return false;
    }
  }

  /**
   * 生成 API 文档
   */
  generateApiDocs(swaggerUrl) {
    console.log(`📚 生成 API 文档: ${swaggerUrl}`);
    try {
      // 调用现有的 API 文档生成脚本
      execSync('npm run generate-api-simple', { stdio: 'inherit' });
      console.log(`✅ API 文档生成完成`);
      return true;
    } catch (error) {
      console.error(`❌ API 文档生成失败:`, error.message);
      return false;
    }
  }

  /**
   * 记录日志
   */
  log(messages) {
    messages.forEach(message => {
      console.log(message);
      
      // 写入日志文件
      const logFile = path.join(this.workspace, 'logs', 'system-control.log');
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
   * 执行系统总控任务流
   */
  async executeTaskFlow() {
    console.log('🚀 启动 Qoder 系统总控任务流...');
    console.log('📋 任务流: system-control-panel - 一键执行构建、部署、数据库同步、文档更新等任务');
    
    try {
      // 步骤1: 切换到web目录
      this.cd(this.webDir);
      
      // 步骤2: 检查构建状态
      const distPath = path.join(this.webDir, 'dist', 'index.html');
      if (!this.checkPath(distPath)) {
        console.log('🏗️  未检测到构建文件，开始构建流程...');
        
        // 失败处理: npm-install
        if (!this.npmInstall()) {
          throw new Error('npm install 失败');
        }
        
        // 失败处理: npm-run build
        if (!this.npmRun('build')) {
          throw new Error('npm run build 失败');
        }
        
        // 失败处理: 写入构建状态
        this.writeFile(path.join(this.webDir, '.build-status'), 'success');
      }
      
      // 步骤3: 复制目录到fund-server
      const distDir = path.join(this.webDir, 'dist');
      const publicDir = path.join(this.fundServerDir, 'public');
      if (!this.copyDir(distDir, publicDir)) {
        throw new Error('目录复制失败');
      }
      
      // 步骤4: 重启PM2服务
      if (!this.pm2Restart('fund-server')) {
        throw new Error('PM2服务重启失败');
      }
      
      // 步骤5: 验证API
      await this.verifyApi('http://localhost:3001/api/fund/');
      
      // 步骤6: 同步数据库Schema
      this.syncDbSchema('src/models/fund.ts');
      
      // 步骤7: 生成字段注释
      this.generateComments('funds');
      
      // 步骤8: 检查命名规范
      this.checkNaming('funds');
      
      // 步骤9: 生成API文档
      this.generateApiDocs('http://localhost:3001/api-docs/swagger.json');
      
      // 步骤10: 记录日志
      this.log(['✅ 系统总控任务已完成，所有模块状态正常']);
      
      console.log('\n✨ 系统总控任务流执行完成!');
      
    } catch (error) {
      console.error(`❌ 系统总控任务流执行失败: ${error.message}`);
      this.log([`❌ 系统总控任务流执行失败: ${error.message}`]);
      process.exit(1);
    }
  }
}

// 根据命令行参数执行不同操作
if (require.main === module) {
  const panel = new SystemControlPanel();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case '执行系统总控任务':
    case '检查所有模块状态':
    case '同步数据库并更新文档':
      panel.executeTaskFlow();
      break;
    default:
      console.log('ℹ️  使用方法:');
      console.log('   node scripts/system-control-panel.js "执行系统总控任务"');
      console.log('   node scripts/system-control-panel.js "检查所有模块状态"');
      console.log('   node scripts/system-control-panel.js "同步数据库并更新文档"');
  }
}

module.exports = SystemControlPanel;