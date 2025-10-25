const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

class OperationsController {
  /**
   * 启动服务
   */
  static async startService(req, res) {
    try {
      // 执行 PM2 启动命令
      exec('pm2 start src/index.js --name virtual-trading-platform', { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
          console.error('启动服务失败:', error);
          return res.status(500).json({ 
            success: false, 
            message: '启动服务失败',
            error: error.message 
          });
        }
        
        res.json({ 
          success: true, 
          message: '服务启动命令已发送',
          output: stdout || stderr
        });
      });
    } catch (error) {
      console.error('启动服务异常:', error);
      res.status(500).json({ 
        success: false, 
        message: '启动服务异常',
        error: error.message 
      });
    }
  }

  /**
   * 重启服务
   */
  static async restartService(req, res) {
    try {
      // 执行 PM2 重启命令
      exec('pm2 restart virtual-trading-platform', { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
          console.error('重启服务失败:', error);
          return res.status(500).json({ 
            success: false, 
            message: '重启服务失败',
            error: error.message 
          });
        }
        
        res.json({ 
          success: true, 
          message: '服务重启命令已发送',
          output: stdout || stderr
        });
      });
    } catch (error) {
      console.error('重启服务异常:', error);
      res.status(500).json({ 
        success: false, 
        message: '重启服务异常',
        error: error.message 
      });
    }
  }

  /**
   * 查看日志
   */
  static async viewLogs(req, res) {
    try {
      // 执行 PM2 日志命令，限制返回最近的100行
      exec('pm2 logs virtual-trading-platform --lines 100', { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
          console.error('获取日志失败:', error);
          return res.status(500).json({ 
            success: false, 
            message: '获取日志失败',
            error: error.message 
          });
        }
        
        res.json({ 
          success: true, 
          message: '日志获取成功',
          logs: stdout || stderr
        });
      });
    } catch (error) {
      console.error('获取日志异常:', error);
      res.status(500).json({ 
        success: false, 
        message: '获取日志异常',
        error: error.message 
      });
    }
  }

  /**
   * 重载 Nginx
   */
  static async reloadNginx(req, res) {
    try {
      // 执行 Nginx 重载命令
      // 注意：这可能需要 sudo 权限，在生产环境中需要特殊处理
      exec('sudo nginx -s reload', { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
          console.error('重载 Nginx 失败:', error);
          return res.status(500).json({ 
            success: false, 
            message: '重载 Nginx 失败',
            error: error.message 
          });
        }
        
        res.json({ 
          success: true, 
          message: 'Nginx 重载命令已发送',
          output: stdout || stderr
        });
      });
    } catch (error) {
      console.error('重载 Nginx 异常:', error);
      res.status(500).json({ 
        success: false, 
        message: '重载 Nginx 异常',
        error: error.message 
      });
    }
  }

  /**
   * 续签证书
   */
  static async renewCertificate(req, res) {
    try {
      // 执行证书续签命令
      const certCommand = '~/.acme.sh/acme.sh --renew -d jcstjj.top --force';
      exec(certCommand, { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
          console.error('续签证书失败:', error);
          return res.status(500).json({ 
            success: false, 
            message: '续签证书失败',
            error: error.message 
          });
        }
        
        res.json({ 
          success: true, 
          message: '证书续签命令已发送',
          output: stdout || stderr
        });
      });
    } catch (error) {
      console.error('续签证书异常:', error);
      res.status(500).json({ 
        success: false, 
        message: '续签证书异常',
        error: error.message 
      });
    }
  }

  /**
   * 一键诊断
   */
  static async runDiagnosis(req, res) {
    try {
      // 执行诊断脚本
      const diagnoseScript = path.join(process.cwd(), 'scripts', 'diagnose.sh');
      
      // 检查诊断脚本是否存在
      if (!fs.existsSync(diagnoseScript)) {
        return res.status(404).json({ 
          success: false, 
          message: '诊断脚本不存在' 
        });
      }
      
      exec(`bash ${diagnoseScript}`, { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
          console.error('诊断执行失败:', error);
          return res.status(500).json({ 
            success: false, 
            message: '诊断执行失败',
            error: error.message 
          });
        }
        
        res.json({ 
          success: true, 
          message: '诊断已完成',
          output: stdout || stderr
        });
      });
    } catch (error) {
      console.error('诊断异常:', error);
      res.status(500).json({ 
        success: false, 
        message: '诊断异常',
        error: error.message 
      });
    }
  }

  /**
   * 智能部署修复
   */
  static async runAutoFix(req, res) {
    try {
      // 优先使用无sudo权限版本的脚本
      let autoFixScript = path.join(process.cwd(), 'scripts', 'auto-fix-no-sudo.sh');
      
      // 如果无sudo版本不存在，则使用原版本
      if (!fs.existsSync(autoFixScript)) {
        autoFixScript = path.join(process.cwd(), 'scripts', 'auto-fix.sh');
      }
      
      // 检查脚本是否存在
      if (!fs.existsSync(autoFixScript)) {
        return res.status(404).json({ 
          success: false, 
          message: '智能部署修复脚本不存在' 
        });
      }
      
      exec(`bash ${autoFixScript}`, { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
          console.error('智能部署修复执行失败:', error);
          return res.status(500).json({ 
            success: false, 
            message: '智能部署修复执行失败',
            error: error.message 
          });
        }
        
        res.json({ 
          success: true, 
          message: '智能部署修复已完成',
          output: stdout || stderr
        });
      });
    } catch (error) {
      console.error('智能部署修复异常:', error);
      res.status(500).json({ 
        success: false, 
        message: '智能部署修复异常',
        error: error.message 
      });
    }
  }

  /**
   * 获取系统健康状态
   */
  static async getHealthStatus(req, res) {
    try {
      // 模拟健康检查
      // 在实际应用中，这里会检查各种系统指标
      const healthData = {
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
      };
      
      res.json({ 
        success: true, 
        data: healthData,
        message: '健康检查完成' 
      });
    } catch (error) {
      console.error('健康检查失败:', error);
      res.status(500).json({ 
        success: false, 
        message: '健康检查失败',
        error: error.message 
      });
    }
  }

  /**
   * 获取证书状态
   */
  static async getCertStatus(req, res) {
    try {
      // 检查证书文件是否存在
      const keyPath = '/home/administrator/ssl/jcstjj.top.key';
      const pemPath = '/home/administrator/ssl/jcstjj.top.pem';
      
      const keyExists = fs.existsSync(keyPath);
      const pemExists = fs.existsSync(pemPath);
      
      // 如果证书文件存在，尝试获取过期时间
      let certInfo = null;
      if (keyExists && pemExists) {
        try {
          // 使用 openssl 获取证书信息
          exec(`openssl x509 -in ${pemPath} -noout -dates`, (error, stdout, stderr) => {
            if (!error) {
              const dates = stdout.split('\n');
              const notBefore = dates[0]?.replace('notBefore=', '');
              const notAfter = dates[1]?.replace('notAfter=', '');
              
              certInfo = {
                notBefore,
                notAfter,
                isValid: new Date(notAfter) > new Date()
              };
            }
            
            res.json({ 
              success: true, 
              data: {
                keyExists,
                pemExists,
                certInfo
              },
              message: '证书状态检查完成' 
            });
          });
        } catch (opensslError) {
          // 如果 openssl 命令失败，返回基本信息
          res.json({ 
            success: true, 
            data: {
              keyExists,
              pemExists,
              certInfo: null
            },
            message: '证书状态检查完成' 
          });
        }
      } else {
        res.json({ 
          success: true, 
          data: {
            keyExists,
            pemExists,
            certInfo: null
          },
          message: '证书状态检查完成' 
        });
      }
    } catch (error) {
      console.error('证书状态检查失败:', error);
      res.status(500).json({ 
        success: false, 
        message: '证书状态检查失败',
        error: error.message 
      });
    }
  }

  /**
   * 获取进程状态
   */
  static async getProcessStatus(req, res) {
    try {
      // 使用 PM2 获取进程列表
      exec('pm2 jlist', { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
          console.error('获取进程状态失败:', error);
          return res.status(500).json({ 
            success: false, 
            message: '获取进程状态失败',
            error: error.message 
          });
        }
        
        try {
          const processes = JSON.parse(stdout);
          const platformProcess = processes.find(p => p.name === 'virtual-trading-platform');
          
          res.json({ 
            success: true, 
            data: platformProcess || null,
            message: '进程状态获取成功'
          });
        } catch (parseError) {
          res.json({ 
            success: true, 
            data: null,
            message: '进程状态获取成功',
            rawOutput: stdout || stderr
          });
        }
      });
    } catch (error) {
      console.error('获取进程状态异常:', error);
      res.status(500).json({ 
        success: false, 
        message: '获取进程状态异常',
        error: error.message 
      });
    }
  }
}

module.exports = OperationsController;