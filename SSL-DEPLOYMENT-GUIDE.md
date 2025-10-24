# SSL证书自动申请和续签部署指南

## 📋 概述

本指南详细说明如何在您的服务器上部署和使用自动SSL证书申请及续签系统。该系统基于acme.sh工具和Cloudflare DNS验证，可实现完全自动化的证书管理和续签。

## 🚀 部署步骤

### 1. 准备工作

确保您的服务器满足以下要求：
- 已安装Nginx并正确配置
- 已安装curl工具
- 对于Linux系统：已安装bash shell
- 对于Windows系统：已安装PowerShell

### 2. 部署脚本文件

将以下脚本文件上传到您的服务器：

#### Linux系统：
- [`scripts/request-ssl.sh`](file:///c%3A/Users/Administrator/jucaizhongfa/scripts/request-ssl.sh) - SSL证书申请和安装脚本

#### Windows系统：
- [`scripts/install-acme-windows-final.bat`](file:///c%3A/Users/Administrator/jucaizhongfa/scripts/install-acme-windows-final.bat) - Windows环境下acme.sh安装和证书申请脚本

### 3. 配置Cloudflare API Token

在执行脚本之前，请确保已在脚本中正确配置了您的Cloudflare API Token：

```bash
# 在 request-ssl.sh 中
export CF_Token="您的Cloudflare_API_Token"
export CF_Email="您的邮箱地址"
```

### 4. 执行证书申请

#### Linux系统：
```bash
# 赋予执行权限
chmod +x scripts/request-ssl.sh

# 执行脚本
./scripts/request-ssl.sh
```

#### Windows系统：
```cmd
scripts\install-acme-windows-fixed.bat
```

### 5. 验证证书安装

脚本执行完成后，证书将自动安装到以下位置：
- 私钥文件：`/etc/nginx/ssl/jcstjj.top.key`
- 证书文件：`/etc/nginx/ssl/jcstjj.top.pem`

## 🔁 自动续签机制

acme.sh会在安装时自动创建cron任务，实现证书的自动续签。默认情况下，续签任务会在每天凌晨自动运行。

您可以手动测试续签功能：

```bash
# Linux系统
~/.acme.sh/acme.sh --renew -d jcstjj.top --force

# Windows系统 (需要在acme.sh安装目录下执行)
acme.sh --renew -d jcstjj.top --force
```

## 🛡️ 安全注意事项

1. 保护好您的Cloudflare API Token，不要将其泄露给他人
2. 定期检查证书的有效期和续签状态
3. 监控Nginx的错误日志，及时发现SSL相关问题

## 📊 状态检查命令

### 查看证书信息：
```bash
# Linux系统
~/.acme.sh/acme.sh --info -d jcstjj.top

# Windows系统
acme.sh --info -d jcstjj.top
```

### 查看cron任务：
```bash
crontab -l
```

## 🆘 故障排除

### 1. 证书申请失败
- 检查Cloudflare API Token是否正确配置
- 确认域名DNS解析指向正确的服务器IP
- 检查防火墙设置是否阻止了必要的网络连接

### 2. Nginx无法加载证书
- 确认证书文件路径正确且文件存在
- 检查Nginx配置文件中的证书路径设置
- 确保证书文件具有正确的读取权限

### 3. 自动续签不工作
- 检查cron任务是否存在且正确配置
- 查看系统日志确认cron任务是否正常执行
- 手动执行续签命令测试功能

## 📞 技术支持

如遇到任何问题，请联系技术支持团队或查阅acme.sh官方文档获取更多帮助.