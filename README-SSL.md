# SSL证书自动化管理系统

## 📋 简介

本系统提供了一套完整的SSL证书自动化管理解决方案，支持自动申请、安装和续签SSL证书。通过集成Cloudflare DNS验证，系统可以实现完全无人值守的证书管理。

## 📁 文件说明

### 核心脚本

1. **[`scripts/request-ssl.sh`](file:///c%3A/Users/Administrator/jucaizhongfa/scripts/request-ssl.sh)**
   - Linux系统下的SSL证书申请和安装脚本
   - 使用acme.sh工具和Cloudflare DNS验证

2. **[`scripts/install-acme-windows-final.bat`](file:///c%3A/Users/Administrator/jucaizhongfa/scripts/install-acme-windows-final.bat)**
   - Windows系统下的acme.sh安装和证书申请脚本
   - 适用于Windows服务器环境
   - 修复了路径问题的最终版本

### 配置文件

1. **[`nginx/jcstjj.top.conf`](file:///c%3A/Users/Administrator/jucaizhongfa/nginx/jcstjj.top.conf)**
   - Nginx服务器配置文件
   - 包含HTTP到HTTPS的自动重定向
   - 配置了SSL证书路径

## ▶️ 使用方法

### Linux系统部署

1. 确保服务器已安装curl和Nginx
2. 修改[`scripts/request-ssl.sh`](file:///c%3A/Users/Administrator/jucaizhongfa/scripts/request-ssl.sh)中的Cloudflare API Token
3. 执行以下命令：
   ```bash
   chmod +x scripts/request-ssl.sh
   ./scripts/request-ssl.sh
   ```

### Windows系统部署

1. 确保服务器已安装curl和Nginx
2. 修改[`scripts/install-acme-windows-final.bat`](file:///c%3A/Users/Administrator/jucaizhongfa/scripts/install-acme-windows-final.bat)中的Cloudflare API Token
3. 以管理员身份运行：
   ```cmd
   scripts\install-acme-windows-final.bat
   ```

## 🔄 自动续签

系统会自动配置续签任务：
- Linux: 通过cron任务自动续签
- Windows: 通过任务计划程序自动续签

手动测试续签：
```bash
# Linux
~/.acme.sh/acme.sh --renew -d jcstjj.top --force

# Windows
acme.sh --renew -d jcstjj.top --force
```

## 📚 详细文档

请参阅 [SSL-DEPLOYMENT-GUIDE.md](file:///c%3A/Users/Administrator/jucaizhongfa/SSL-DEPLOYMENT-GUIDE.md) 获取完整的部署和使用指南。