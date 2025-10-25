# 香港Windows服务器部署指南

本文档详细说明如何在您的香港Windows服务器上部署和管理虚拟交易平台。

## 服务器环境要求

- Windows Server 2019 或更高版本
- Node.js v16 或更高版本
- Nginx 1.20 或更高版本
- PM2 (用于进程管理)
- Git (用于代码更新)

## 部署步骤

### 1. 安装依赖

```powershell
# 安装Node.js依赖
cd C:\Users\Administrator\virtual-trading-platform
npm install

# 全局安装PM2
npm install -g pm2
```

### 2. 配置Nginx

```powershell
# 复制Nginx配置文件
xcopy "config\nginx\nginx\jcstjj.top.conf" "C:\nginx\conf\" /Y
xcopy "nginx.conf" "C:\nginx\conf\" /Y

# 重启Nginx服务
net stop nginx
net start nginx
```

### 3. 启动应用服务

```powershell
# 使用PM2启动所有服务
pm2 start config/pm2/ecosystem.config.js

# 保存PM2配置，确保重启后自动启动
pm2 save
```

### 4. 验证部署

```powershell
# 检查服务状态
pm2 list

# 检查健康接口
curl https://jcstjj.top/health

# 访问管理面板
# 浏览器打开: https://jcstjj.top/admin/panel
```

## 服务管理

### 启动所有服务

```powershell
cd C:\Users\Administrator\virtual-trading-platform
pm2 start config/pm2/ecosystem.config.js
net start nginx
```

### 停止所有服务

```powershell
pm2 stop all
net stop nginx
```

### 重启所有服务

```powershell
pm2 restart all
net stop nginx
net start nginx
```

### 查看服务日志

```powershell
# 查看主应用日志
pm2 logs virtual-trading-platform

# 查看合约市场日志
pm2 logs contract-market

# 查看期权市场日志
pm2 logs option-market
```

## 监控和维护

### 使用监控脚本

```powershell
# 运行服务监控脚本
bash scripts/monitor-services.sh
```

### 自动化部署

```powershell
# 使用部署脚本
deploy-server.bat
```

## SSL证书管理

### 续签证书

```powershell
# 使用acme.sh续签证书
~/.acme.sh/acme.sh --renew -d jcstjj.top --force

# 安装新证书
~/.acme.sh/acme.sh --install-cert -d jcstjj.top \
  --key-file       /home/administrator/ssl/jcstjj.top.key \
  --fullchain-file /home/administrator/ssl/jcstjj.top.pem

# 重载Nginx
nginx -s reload
```

## 故障排除

### 服务无法启动

1. 检查端口是否被占用：
   ```powershell
   netstat -an | findstr :3001
   ```

2. 检查PM2日志：
   ```powershell
   pm2 logs
   ```

3. 检查Nginx错误日志：
   ```powershell
   type C:\nginx\logs\error.log
   ```

### 管理面板无法访问

1. 检查Nginx配置：
   ```powershell
   nginx -t
   ```

2. 检查防火墙设置，确保80和443端口开放

3. 检查DNS解析是否正确

## 备份和恢复

### 备份配置

```powershell
# 创建备份目录
mkdir backup

# 备份重要文件
xcopy "config\nginx\nginx\jcstjj.top.conf" "backup\" /Y
xcopy "nginx.conf" "backup\" /Y
xcopy "config\pm2\ecosystem.config.js" "backup\" /Y
```

### 恢复配置

```powershell
# 恢复备份文件
xcopy "backup\jcstjj.top.conf" "C:\nginx\conf\" /Y
xcopy "backup\nginx.conf" "C:\nginx\conf\" /Y
```

## 性能优化

### Nginx优化

1. 调整worker_processes和worker_connections
2. 启用gzip压缩
3. 配置缓存策略

### Node.js优化

1. 使用PM2集群模式
2. 调整内存限制
3. 启用日志轮转

## 安全加固

### 防火墙配置

```powershell
# 仅开放必要端口
netsh advfirewall firewall add rule name="HTTP" dir=in action=allow protocol=TCP localport=80
netsh advfirewall firewall add rule name="HTTPS" dir=in action=allow protocol=TCP localport=443
```

### 定期安全检查

1. 更新系统和软件包
2. 检查SSL证书有效性
3. 审查访问日志
4. 执行安全扫描

## 更新和升级

### 代码更新

```powershell
# 拉取最新代码
git pull origin main

# 安装新依赖
npm install

# 重启服务
pm2 restart all
```

### 版本升级

```powershell
# 检查Node.js版本
node --version

# 检查Nginx版本
nginx -v

# 更新PM2
npm update -g pm2
```

## 联系支持

如有任何问题，请联系技术支持团队。

---
部署日期: 2025-10-25
版本: 1.0