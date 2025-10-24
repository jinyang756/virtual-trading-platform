# 系统完整部署指南

## 📋 概述

本指南详细说明如何在服务器上部署完整的系统，包括Nginx反向代理配置、SSL证书自动申请与续签、以及所有相关服务的启动。

## 🚀 部署步骤

### 1. 环境准备

确保服务器满足以下要求：
- 操作系统：Windows Server 2016或更高版本，或Linux发行版
- 已安装Node.js (v14或更高版本)
- 已安装Nginx
- 已安装curl工具
- 对于Linux系统：已安装bash shell
- 对于Windows系统：已安装PowerShell

### 2. 项目部署

1. 将项目文件上传到服务器
2. 安装项目依赖：
   ```bash
   npm install
   ```

### 3. Nginx配置

#### 自动配置（推荐）
运行以下脚本自动配置Nginx：
```cmd
scripts\nginx-deploy-and-start.bat
```

#### 手动配置
1. 将[`nginx/jcstjj.top.conf`](file:///c%3A/Users/Administrator/jucaizhongfa/nginx/jcstjj.top.conf)复制到Nginx配置目录
2. 确保Nginx主配置文件包含该站点配置

### 4. SSL证书配置

#### Linux系统：
1. 修改[`scripts/request-ssl.sh`](file:///c%3A/Users/Administrator/jucaizhongfa/scripts/request-ssl.sh)中的Cloudflare API Token
2. 执行证书申请脚本：
   ```bash
   chmod +x scripts/request-ssl.sh
   ./scripts/request-ssl.sh
   ```

#### Windows系统：
1. 修改[`scripts/install-acme-windows-final.bat`](file:///c%3A/Users/Administrator/jucaizhongfa/scripts/install-acme-windows-final.bat)中的Cloudflare API Token
2. 以管理员身份运行：
   ```cmd
   scripts\install-acme-windows-final.bat
   ```

### 5. 启动服务

使用PM2启动所有服务：
```bash
npm run pm2-start
```

查看服务状态：
```bash
npm run pm2-list
```

## 🔧 服务架构

系统包含以下服务：

1. **前端服务** (端口5173)
   - React移动端应用
   - 提供用户界面

2. **API服务** (端口3001)
   - Express.js后端服务
   - 提供RESTful API接口

3. **Teable代理服务** (端口3002)
   - Teable数据库代理
   - 提供数据库访问接口

4. **权限服务** (端口3003)
   - 权限管理服务
   - 提供RBAC权限控制

## 🔄 自动化任务

系统包含以下自动化任务：

1. **字段变更通知** (每小时执行)
   - 监控数据库字段变更
   - 发送通知邮件

2. **性能警报检查** (每5分钟执行)
   - 监控系统性能指标
   - 发送警报通知

3. **权限变更同步** (每10分钟执行)
   - 同步权限变更到相关服务
   - 更新权限缓存

## 🛡️ 安全配置

### SSL证书
- 使用Let's Encrypt免费SSL证书
- 通过Cloudflare DNS验证自动申请
- 支持自动续签

### 权限系统
- 基于RBAC模型的权限控制
- 支持角色继承和权限继承
- 提供权限审计功能

## 📊 监控和日志

### 查看服务状态
```bash
npm run pm2-list
```

### 查看服务日志
```bash
npm run pm2-logs
```

### 查看特定服务日志
```bash
npm run pm2-logs <service-name>
```

## 🆘 故障排除

### 1. Nginx配置问题
检查Nginx错误日志：
```bash
tail -f /var/log/nginx/error.log
```

### 2. 服务启动失败
查看PM2日志：
```bash
npm run pm2-logs
```

### 3. SSL证书问题
手动测试证书：
```bash
# Linux
~/.acme.sh/acme.sh --info -d jcstjj.top

# Windows
acme.sh --info -d jcstjj.top
```

## 📞 技术支持

如遇到任何问题，请联系技术支持团队或查阅相关文档获取更多帮助。