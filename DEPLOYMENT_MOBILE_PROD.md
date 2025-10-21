# 移动端客户端生产环境部署指南

本文档详细说明如何将移动端客户端部署到生产环境并绑定域名 `jiuzhougroup.vip`。

## 部署架构

移动端客户端将作为一个独立的应用部署，只包含移动端相关的页面和资源，不包含管理后台和其他PC端功能。

## 部署前准备

### 1. 环境要求
- Node.js 14+
- 2GB+ 内存
- 5GB+ 存储空间

### 2. 域名准备
确保您已拥有域名 `jiuzhougroup.vip` 并能管理其 DNS 设置。

### 3. API 服务准备
确保后端 API 服务已部署并可从公网访问。

## 部署步骤

### 方案一：Vercel 部署（推荐）

1. 安装 Vercel CLI：
   ```bash
   npm install -g vercel
   ```

2. 登录 Vercel（使用您提供的凭证）：
   ```bash
   vercel login
   ```
   
   当提示时，使用以下信息：
   - 项目ID: prj_WFQNbnLou9TVlIBKz0OQp641Hqah
   - 用户ID: cY13U0CjVL9iQjidbPLsLp94
   - 令牌：RHJHxMoc1jdd9tpaLNDRf66t

3. 部署移动端客户端：
   ```bash
   # 使用专用配置文件部署移动端
   npm run deploy-mobile
   
   # 或直接使用 Vercel 命令
   vercel --prod --local-config=vercel-mobile.json
   ```

4. 在 Vercel 控制台中添加域名：
   - 进入项目设置
   - 选择 "Domains"
   - 添加域名 `jiuzhougroup.vip`
   - 按照提示配置 DNS 记录

### 方案二：独立服务器部署

1. 准备服务器环境：
   - 选择合适的云服务器（如阿里云、腾讯云等）
   - 安装 Node.js 环境

2. 上传文件到服务器：
   ```bash
   # 创建部署目录
   mkdir -p /var/www/mobile-client
   
   # 上传移动端文件
   scp -r public/mobile user@server:/var/www/mobile-client/
   
   # 上传移动端服务器文件
   scp mobile-server.js user@server:/var/www/mobile-client/
   
   # 上传配置文件
   scp package.json user@server:/var/www/mobile-client/
   ```

3. 在服务器上安装依赖：
   ```bash
   cd /var/www/mobile-client
   npm install --production
   ```

4. 启动服务：
   ```bash
   npm run start-mobile
   ```
   
   或使用 PM2 管理进程：
   ```bash
   # 安装 PM2
   npm install -g pm2
   
   # 使用 PM2 启动应用
   pm2 start mobile-server.js --name mobile-client
   
   # 设置开机自启
   pm2 startup
   pm2 save
   ```

5. 配置反向代理（如使用 Nginx）：
   ```nginx
   server {
       listen 80;
       server_name jiuzhougroup.vip;
       
       # 配置 SSL（推荐）
       # listen 443 ssl;
       # ssl_certificate /path/to/your/certificate.crt;
       # ssl_certificate_key /path/to/your/private.key;
       
       location / {
           proxy_pass http://localhost:3002;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

6. 配置防火墙：
   ```bash
   # Ubuntu/Debian
   sudo ufw allow 80
   sudo ufw allow 443
   
   # CentOS/RHEL
   sudo firewall-cmd --permanent --add-service=http
   sudo firewall-cmd --permanent --add-service=https
   sudo firewall-cmd --reload
   ```

## 域名配置

### DNS 配置

在您的域名提供商处添加以下 DNS 记录：

1. A 记录（独立服务器部署）：
   ```
   类型: A
   主机: @
   值: 您的服务器IP地址
   TTL: 600
   ```

2. CNAME 记录（Vercel 部署）：
   ```
   类型: CNAME
   主机: @
   值: cname.vercel-dns.com
   TTL: 600
   ```

## 环境配置

### API 地址配置

移动端客户端通过 AJAX 请求与后端API通信，需要正确配置 API 地址。

1. 已在 [public/js/env-config.js](file:///c%3A/Users/Administrator/jucaizhongfa/public/js/env-config.js) 文件中配置了生产环境API地址：
   ```javascript
   // 在 getApiBaseUrl 函数中设置生产环境API地址
   if (productionDomains.includes(currentDomain)) {
     // 已设置为您的实际API地址
     return 'https://prj-wfqnbnlou9tvlibkz0oqp641hqah.vercel.app';
   }
   ```

2. 确保所有移动端页面都引用了环境配置文件：
   ```html
   <script src="../js/env-config.js"></script>
   ```

3. 在 API 调用中使用环境配置：
   ```javascript
   const response = await fetch(`${window.envConfig.apiBaseUrl}/api/endpoint`);
   ```

## 安全配置

### HTTPS 配置（推荐）

1. 使用 Let's Encrypt 免费 SSL 证书：
   ```bash
   # 安装 Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # 获取 SSL 证书
   sudo certbot --nginx -d jiuzhougroup.vip
   ```

2. 配置自动续期：
   ```bash
   # 测试自动续期
   sudo certbot renew --dry-run
   
   # 添加到 crontab
   echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
   ```

### CORS 配置

如果 API 部署在不同域名下，需要在后端配置 CORS：

```javascript
// 在后端应用中添加 CORS 配置
app.use(cors({
  origin: [
    'https://jiuzhougroup.vip',
    'http://jiuzhougroup.vip'
  ],
  credentials: true
}));
```

## 监控和日志

### 应用监控

1. 使用 PM2 监控应用状态：
   ```bash
   pm2 status
   pm2 logs mobile-client
   ```

2. 设置健康检查端点：
   移动端服务器已包含健康检查端点 `/health`

### 日志管理

1. 配置日志轮转：
   ```bash
   # 安装 logrotate
   sudo apt install logrotate
   
   # 创建日志轮转配置
   sudo nano /etc/logrotate.d/mobile-client
   ```
   
   添加以下内容：
   ```
   /var/log/mobile-client/*.log {
       daily
       missingok
       rotate 52
       compress
       delaycompress
       notifempty
       create 644 www-data www-data
   }
   ```

## 访问地址

部署完成后，移动端客户端可通过以下地址访问：
- https://jiuzhougroup.vip

## 故障排除

### 常见问题

1. **页面无法加载**
   - 检查服务器是否正常运行：`systemctl status nginx` 或 `pm2 status`
   - 检查端口是否被占用：`netstat -tlnp | grep 3002`
   - 检查防火墙设置：`sudo ufw status`

2. **API 请求失败**
   - 检查 [env-config.js](file:///c%3A/Users/Administrator/jucaizhongfa/public/js/env-config.js) 中的 API_BASE_URL 配置
   - 检查 CORS 配置
   - 检查网络连接和防火墙设置

3. **静态资源加载失败**
   - 检查文件路径是否正确
   - 检查文件权限设置：`ls -la /var/www/mobile-client/public/`

4. **域名解析问题**
   - 检查 DNS 记录是否正确配置
   - 使用 `nslookup jiuzhougroup.vip` 检查解析结果
   - 等待 DNS 传播（通常需要几分钟到几小时）

### 日志查看

1. 应用日志：
   ```bash
   # PM2 日志
   pm2 logs mobile-client
   
   # 或查看日志文件
   tail -f /var/log/mobile-client/app.log
   ```

2. Nginx 日志：
   ```bash
   # 访问日志
   tail -f /var/log/nginx/access.log
   
   # 错误日志
   tail -f /var/log/nginx/error.log
   ```

## 更新部署

要更新移动端客户端：

1. 更新代码：
   ```bash
   # Vercel 部署
   git push origin main
   
   # 或手动更新文件
   # scp -r public/mobile user@server:/var/www/mobile-client/
   ```

2. 重新部署：
   ```bash
   # Vercel 部署
   npm run deploy-mobile
   
   # 独立服务器部署
   cd /var/www/mobile-client
   pm2 restart mobile-client
   ```

## 备份策略

1. 定期备份部署文件：
   ```bash
   tar -czf mobile-client-backup-$(date +%Y%m%d).tar.gz /var/www/mobile-client
   ```

2. 版本控制：
   - 使用 Git 管理代码变更
   - 记录重要配置变更

## 联系支持

如有部署问题，请联系技术支持团队或查看项目文档获取帮助。