# 虚拟交易平台部署指南

## 部署前准备

### 环境要求
- Node.js 14+ (推荐使用最新LTS版本)
- MySQL 5.7+ 或 MariaDB 10.3+
- npm 6+ 或 yarn 1.22+

### 系统依赖
- 操作系统: Linux (推荐Ubuntu 20.04+/CentOS 7+) 或 Windows Server 2016+
- 内存: 最小2GB，推荐4GB+
- 存储空间: 最小10GB可用空间

## 部署步骤

### 1. 获取项目代码
```bash
# 克隆项目代码 (如果使用Git)
git clone <项目仓库地址>
cd virtual-trading-platform

# 或者直接上传项目文件到服务器
```

### 2. 安装依赖
```bash
# 进入项目目录
cd /path/to/virtual-trading-platform

# 安装项目依赖
npm install
```

### 3. 配置数据库
#### 3.1 安装MySQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# CentOS/RHEL
sudo yum install mysql-server

# 启动MySQL服务
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### 3.2 创建数据库和用户
```sql
-- 登录MySQL
mysql -u root -p

-- 创建数据库
CREATE DATABASE virtual_trading_platform;

-- 创建用户并授权
CREATE USER 'trading_user'@'localhost' IDENTIFIED BY 'trading_password';
GRANT ALL PRIVILEGES ON virtual_trading_platform.* TO 'trading_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 3.3 配置数据库连接
编辑 `config/database.js` 文件，根据实际环境修改数据库配置：
```javascript
module.exports = {
  // MySQL数据库配置
  mysql: {
    host: 'localhost',           // 数据库主机地址
    port: 3306,                  // 数据库端口
    user: 'trading_user',        // 数据库用户名
    password: 'trading_password', // 数据库密码
    database: 'virtual_trading_platform', // 数据库名
    connectionLimit: 10          // 连接池大小
  }
};
```

### 4. 初始化数据库
```bash
# 初始化数据库表结构
npm run init-db
```

### 5. 配置环境变量 (可选)
创建 `.env` 文件来配置环境变量：
```bash
# .env 文件内容示例
PORT=3001
NODE_ENV=production
JWT_SECRET=your_jwt_secret_key_here
```

### 6. 启动服务
```bash
# 使用npm启动 (推荐用于生产环境)
npm start

# 或者直接运行启动脚本
node start.js
```

### 7. 配置反向代理 (推荐)
使用Nginx作为反向代理服务器：

#### 7.1 安装Nginx
```bash
# Ubuntu/Debian
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

#### 7.2 配置Nginx
创建Nginx配置文件 `/etc/nginx/sites-available/trading-platform`：
```nginx
server {
    listen 80;
    server_name your-domain.com;  // 替换为你的域名

    location / {
        proxy_pass http://localhost:3001;
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

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/trading-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. 配置SSL证书 (推荐)
使用Let's Encrypt免费SSL证书：

```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d your-domain.com
```

## 访问地址

部署完成后，可以通过以下地址访问系统：

- 系统管理面板: http://your-domain.com/admin/panel
- 用户端仪表板: http://your-domain.com/client/dashboard
- 移动端客户端: http://your-domain.com/mobile

## 系统维护

### 1. 查看日志
```bash
# 查看应用日志
tail -f logs/app_*.log

# 查看系统日志
journalctl -u trading-platform -f
```

### 2. 数据备份
```bash
# 执行数据备份
node scripts/backup.js
```

### 3. 系统监控
```bash
# 查看系统状态
node scripts/system-status.js
```

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查找占用端口的进程
   lsof -i :3001
   
   # 终止进程
   kill -9 <PID>
   ```

2. **数据库连接失败**
   - 检查MySQL服务是否运行: `sudo systemctl status mysql`
   - 检查数据库配置是否正确
   - 检查防火墙设置

3. **依赖安装失败**
   ```bash
   # 清理缓存并重新安装
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

### 性能优化建议

1. **使用PM2管理进程**
   ```bash
   # 安装PM2
   npm install -g pm2
   
   # 使用PM2启动应用
   pm2 start start.js --name trading-platform
   
   # 设置开机自启
   pm2 startup
   pm2 save
   ```

2. **数据库优化**
   - 定期优化数据库表
   - 增加必要的索引
   - 配置合适的连接池大小

3. **缓存策略**
   - 使用Redis缓存热点数据
   - 启用静态资源缓存

## 安全建议

1. **修改默认密码**
   - 修改数据库用户密码
   - 修改JWT密钥

2. **防火墙配置**
   ```bash
   # Ubuntu/Debian
   sudo ufw allow 80,443/tcp
   sudo ufw enable
   
   # CentOS/RHEL
   sudo firewall-cmd --permanent --add-service=http
   sudo firewall-cmd --permanent --add-service=https
   sudo firewall-cmd --reload
   ```

3. **定期更新**
   - 定期更新系统和依赖包
   - 关注安全公告

## 备份与恢复

### 数据备份
```bash
# 执行完整备份
node scripts/backup.js

# 备份文件位置
ls backups/
```

### 数据恢复
```bash
# 恢复最新备份
node scripts/restore.js
```

## 升级指南

### 版本升级步骤
1. 备份当前系统和数据
2. 下载新版本代码
3. 安装新依赖: `npm install`
4. 更新数据库结构 (如有需要)
5. 重启服务

## 联系支持

如有部署问题，请联系技术支持团队或查看项目文档获取帮助.