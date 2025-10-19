# 部署文档

## 环境要求

### Node.js版本
- Node.js 18.x 或更高版本
- npm 8.x 或更高版本

### 系统要求
- Windows/Linux/macOS
- 至少2GB内存
- 至少100MB磁盘空间

## 部署步骤

### 1. 安装Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Windows
# 从 https://nodejs.org 下载并安装Node.js
```

### 2. 克隆项目代码
```bash
git clone <repository-url>
cd virtual-trading-platform
```

### 3. 安装依赖
```bash
npm install
```

### 4. 配置环境变量
创建 `.env` 文件并设置必要的环境变量：
```env
PORT=3000
NODE_ENV=production
```

### 5. 构建项目
```bash
npm run build
```

### 6. 启动服务
```bash
# 生产环境启动
npm start

# 或使用PM2进行进程管理
npm install -g pm2
pm2 start server.js --name "virtual-trading-platform"
```

## 配置说明

### config.js
```javascript
module.exports = {
  port: 3000,           // 服务端口
  dataPath: './data',   // 数据存储路径
  backupPath: './data/backups',  // 备份路径
  publicPath: './public',        // 静态资源路径
  templatePath: './templates'    // 模板路径
};
```

## 数据库配置

本项目使用文件系统作为数据存储，无需额外数据库配置。

## Nginx配置（可选）

如果需要使用Nginx作为反向代理，可以使用以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL配置（可选）

可以使用Let's Encrypt免费SSL证书：

```bash
# 安装certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d your-domain.com
```

## 监控和日志

### 日志文件位置
- 应用日志: `logs/app_*.log`
- 错误日志: `logs/error_*.log`

### PM2监控
```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs

# 监控资源使用情况
pm2 monit
```

## 备份和恢复

### 数据备份
```bash
# 手动备份
node scripts/backup.js

# 自动备份（添加到cron任务）
0 2 * * * cd /path/to/project && node scripts/backup.js
```

### 数据恢复
```bash
# 从备份文件恢复
node scripts/restore.js backup-file-name.json
```

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查找占用端口的进程
   lsof -i :3000
   
   # 杀死进程
   kill -9 <PID>
   ```

2. **权限问题**
   ```bash
   # 确保有足够的权限运行应用
   sudo chown -R $USER:$USER /path/to/project
   ```

3. **内存不足**
   ```bash
   # 增加Node.js内存限制
   node --max-old-space-size=4096 server.js
   ```

## 性能优化

### 启用Gzip压缩
在Nginx配置中添加：
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### 静态资源缓存
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```