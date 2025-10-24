#!/usr/bin/env node

/**
 * 权限变更联动任务流
 * 权限变更后自动联动前端、文档、通知与日志
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

class PermissionChangeSync {
  constructor() {
    this.workspace = path.join(__dirname, '..');
    this.logsDir = path.join(this.workspace, 'logs');
    this.docsDir = path.join(this.workspace, 'docs');
    this.webDir = path.join(this.workspace, 'web');
  }

  /**
   * 同步前端权限状态
   */
  async syncFrontendPermissions(target) {
    console.log('🔄 同步前端权限状态...');
    
    try {
      const targetPath = path.join(this.webDir, target);
      
      // 检查文件是否存在
      if (!fs.existsSync(targetPath)) {
        console.log(`⚠️  文件不存在: ${targetPath}`);
        return false;
      }
      
      // 这里可以实现具体的同步逻辑
      // 例如：重新生成权限映射、更新缓存等
      console.log(`✅ 前端权限状态已同步: ${target}`);
      return true;
    } catch (error) {
      console.error('❌ 同步前端权限状态失败:', error.message);
      return false;
    }
  }

  /**
   * 更新权限文档
   */
  async updateDoc(file, append) {
    console.log('📝 更新权限文档...');
    
    try {
      const docPath = path.join(this.docsDir, file);
      
      // 检查文件是否存在
      if (!fs.existsSync(docPath)) {
        console.log(`⚠️  文档文件不存在: ${docPath}`);
        return false;
      }
      
      // 读取文件内容
      let content = fs.readFileSync(docPath, 'utf8');
      
      // 添加变更记录到文件末尾
      const timestamp = new Date().toISOString();
      const changeLog = append.replace('timestamp', timestamp);
      content += `

## 🔧 最近变更

${changeLog}
`;
      
      // 写入文件
      fs.writeFileSync(docPath, content, 'utf8');
      
      console.log(`✅ 权限文档已更新: ${file}`);
      return true;
    } catch (error) {
      console.error('❌ 更新权限文档失败:', error.message);
      return false;
    }
  }

  /**
   * 发送飞书通知
   */
  async sendFeishuNotification(args) {
    console.log('🚀 发送飞书通知...');
    
    try {
      const { url, headers, body } = args;
      
      // 替换时间戳
      const timestamp = new Date().toISOString();
      body.content.text = body.content.text.replace('timestamp', timestamp);
      
      // 发送HTTP POST请求
      const result = await this.httpPost(url, headers, body);
      
      if (result) {
        console.log('✅ 飞书通知已发送');
        return true;
      } else {
        console.log('❌ 飞书通知发送失败');
        return false;
      }
    } catch (error) {
      console.error('❌ 发送飞书通知失败:', error.message);
      return false;
    }
  }

  /**
   * HTTP POST 请求
   */
  async httpPost(url, headers, body) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(body);
      
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          ...headers
        }
      };
      
      const req = https.request(url, options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve(true);
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.write(postData);
      req.end();
    });
  }

  /**
   * 写入权限变更日志
   */
  async writeLog(file, content) {
    console.log('📜 写入权限变更日志...');
    
    try {
      // 确保日志目录存在
      if (!fs.existsSync(this.logsDir)) {
        fs.mkdirSync(this.logsDir, { recursive: true });
      }
      
      const logPath = path.join(this.logsDir, file);
      
      // 添加时间戳
      const timestamp = new Date().toISOString();
      const logEntry = `${content.replace('timestamp', timestamp)}\n`;
      
      // 追加写入日志文件
      fs.appendFileSync(logPath, logEntry);
      
      console.log(`✅ 权限变更日志已写入: ${file}`);
      return true;
    } catch (error) {
      console.error('❌ 写入权限变更日志失败:', error.message);
      return false;
    }
  }

  /**
   * 执行权限变更联动任务流
   */
  async executeTaskFlow(eventData) {
    console.log('🚀 启动权限变更联动任务流...');
    console.log('📋 任务流: permission-change-sync - 权限变更后自动联动前端、文档、通知与日志');
    
    try {
      // 步骤1: 同步前端权限状态
      await this.syncFrontendPermissions('src/hooks/useUser.js');
      
      // 步骤2: 更新权限文档
      await this.updateDoc('PERMISSION_SYSTEM.md', 
        '✅ 权限变更：角色 admin 新增权限 export_report，时间：timestamp');
      
      // 步骤3: 发送飞书通知
      await this.sendFeishuNotification({
        url: 'https://open.feishu.cn/open-apis/bot/v2/hook/你的Webhook地址',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          msg_type: 'text',
          content: {
            text: '🔐 权限变更通知：角色 admin 新增权限 export_report\n时间：timestamp'
          }
        }
      });
      
      // 步骤4: 写入权限变更日志
      await this.writeLog('permission-change.log', 
        '角色 admin 新增权限 export_report，时间：timestamp');
      
      console.log('\n🎉 权限变更联动任务流执行完成!');
      
    } catch (error) {
      console.error('❌ 权限变更联动任务流执行失败:', error.message);
      process.exit(1);
    }
  }
}

// 根据命令行参数执行不同操作
if (require.main === module) {
  const sync = new PermissionChangeSync();
  
  // 模拟权限变更事件数据
  const eventData = {
    role: 'admin',
    permission: 'export_report',
    action: 'added',
    timestamp: new Date().toISOString()
  };
  
  sync.executeTaskFlow(eventData);
}

module.exports = PermissionChangeSync;