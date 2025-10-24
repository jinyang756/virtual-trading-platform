#!/usr/bin/env node

/**
 * Nginx 配置设置脚本
 * 用于自动配置虚拟交易平台的 Nginx 反向代理
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class NginxSetup {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.nginxDir = path.join(this.projectRoot, 'nginx');
    this.scriptsDir = path.join(this.projectRoot, 'scripts');
    this.docsDir = path.join(this.projectRoot, 'docs');
  }

  /**
   * 检查 Nginx 是否已安装
   */
  checkNginxInstalled() {
    console.log('🔍 检查 Nginx 是否已安装...');
    
    try {
      execSync('nginx -v', { stdio: 'pipe' });
      console.log('✅ Nginx 已安装');
      return true;
    } catch (error) {
      console.log('❌ Nginx 未安装或不在 PATH 中');
      return false;
    }
  }

  /**
   * 检查操作系统类型
   */
  getOS() {
    const platform = process.platform;
    if (platform === 'win32') return 'windows';
    if (platform === 'linux') return 'linux';
    if (platform === 'darwin') return 'macos';
    return 'unknown';
  }

  /**
   * 获取 Nginx 配置目录
   */
  getNginxConfigDir() {
    const os = this.getOS();
    
    switch (os) {
      case 'linux':
        return '/etc/nginx';
      case 'macos':
        return '/usr/local/etc/nginx';
      case 'windows':
        return 'C:\\nginx\\conf';
      default:
        return null;
    }
  }

  /**
   * 复制配置文件
   */
  copyConfigFile() {
    console.log('📋 复制 Nginx 配置文件...');
    
    const os = this.getOS();
    const nginxConfigDir = this.getNginxConfigDir();
    
    if (!nginxConfigDir) {
      console.error('❌ 无法确定 Nginx 配置目录');
      return false;
    }
    
    try {
      // 源配置文件
      const sourceConfig = path.join(this.nginxDir, 'zhengzutouzi.conf');
      
      // 目标配置文件
      const targetConfig = path.join(nginxConfigDir, 'sites-available', 'zhengzutouzi.conf');
      const targetLink = path.join(nginxConfigDir, 'sites-enabled', 'zhengzutouzi.conf');
      
      // 创建目录（如果不存在）
      const sitesAvailableDir = path.join(nginxConfigDir, 'sites-available');
      const sitesEnabledDir = path.join(nginxConfigDir, 'sites-enabled');
      
      if (!fs.existsSync(sitesAvailableDir)) {
        fs.mkdirSync(sitesAvailableDir, { recursive: true });
      }
      
      if (!fs.existsSync(sitesEnabledDir)) {
        fs.mkdirSync(sitesEnabledDir, { recursive: true });
      }
      
      // 复制配置文件
      fs.copyFileSync(sourceConfig, targetConfig);
      console.log(`✅ 配置文件已复制到: ${targetConfig}`);
      
      // 创建软链接（Linux/Mac）
      if (os === 'linux' || os === 'macos') {
        execSync(`ln -sf ${targetConfig} ${targetLink}`, { stdio: 'ignore' });
        console.log(`✅ 软链接已创建: ${targetLink}`);
      }
      
      return true;
    } catch (error) {
      console.error('❌ 复制配置文件失败:', error.message);
      return false;
    }
  }

  /**
   * 测试 Nginx 配置
   */
  testNginxConfig() {
    console.log('🔍 测试 Nginx 配置...');
    
    try {
      execSync('nginx -t', { stdio: 'pipe' });
      console.log('✅ Nginx 配置测试通过');
      return true;
    } catch (error) {
      console.error('❌ Nginx 配置测试失败:', error.message);
      return false;
    }
  }

  /**
   * 重新加载 Nginx
   */
  reloadNginx() {
    console.log('🔄 重新加载 Nginx...');
    
    try {
      const os = this.getOS();
      
      if (os === 'windows') {
        // Windows 系统
        execSync('nginx -s reload', { stdio: 'ignore' });
      } else {
        // Linux/Mac 系统
        execSync('sudo systemctl reload nginx', { stdio: 'ignore' });
      }
      
      console.log('✅ Nginx 重新加载完成');
      return true;
    } catch (error) {
      console.error('❌ Nginx 重新加载失败:', error.message);
      return false;
    }
  }

  /**
   * 显示部署说明
   */
  showDeploymentInstructions() {
    console.log('\n📋 部署说明:');
    console.log('1. 请确保域名 zhengzutouzi.com 已解析到此服务器');
    console.log('2. 运行以下命令申请 SSL 证书:');
    
    const os = this.getOS();
    if (os === 'windows') {
      console.log('   scripts\\setup-ssl.bat');
    } else {
      console.log('   sudo scripts/setup-ssl.sh');
    }
    
    console.log('3. 查看完整部署文档: docs/DEPLOYMENT_NGINX.md');
  }

  /**
   * 执行设置流程
   */
  async execute() {
    console.log('🚀 开始设置 Nginx 反向代理...');
    
    try {
      // 检查 Nginx 是否已安装
      if (!this.checkNginxInstalled()) {
        console.log('💡 请先安装 Nginx:');
        console.log('   Ubuntu/Debian: sudo apt install nginx');
        console.log('   CentOS/RHEL: sudo yum install nginx');
        console.log('   Windows: 从 http://nginx.org/en/download.html 下载并安装');
        process.exit(1);
      }
      
      // 复制配置文件
      if (!this.copyConfigFile()) {
        process.exit(1);
      }
      
      // 测试配置
      if (!this.testNginxConfig()) {
        process.exit(1);
      }
      
      // 重新加载 Nginx
      if (!this.reloadNginx()) {
        process.exit(1);
      }
      
      console.log('\n✅ Nginx 反向代理设置完成!');
      console.log('🌐 现在可以通过 http://zhengzutouzi.com 访问平台');
      
      // 显示部署说明
      this.showDeploymentInstructions();
      
    } catch (error) {
      console.error('❌ 设置过程中发生错误:', error.message);
      process.exit(1);
    }
  }
}

// 执行主函数
if (require.main === module) {
  const setup = new NginxSetup();
  setup.execute();
}

module.exports = NginxSetup;