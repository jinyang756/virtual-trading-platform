# Nginx 反向代理与 HTTPS 部署指南

## 🎯 部署目标

为虚拟交易平台配置 Nginx 反向代理，实现：
1. 域名访问：zhengzutouzi.com
2. HTTPS 加密传输
3. 多服务负载均衡
4. 静态资源优化

## 🧩 配置架构

```
互联网访问
    ↓
zhengzutouzi.com (HTTPS)
    ↓
Nginx 反向代理
    ↓
┌─────────────┬─────────────┬─────────────┐
│  前端应用   │   基金服务  │  合约服务   │
│ localhost:  │ localhost:  │ localhost:  │
│   5173      │   3001      │   3002      │
└─────────────┴─────────────┴─────────────┘
    ↓
┌─────────────┐
│  期权服务   │
│ localhost:  │
│   3003      │
└─────────────┘
```

## 📁 配置文件说明

### 1. 主配置文件
- `nginx/zhengzutouzi.conf` - 项目Nginx配置文件
- 支持HTTP到HTTPS自动重定向
- 配置了SSL安全参数

### 2. 管理脚本
- `scripts/nginx-manager.sh` - Linux系统管理脚本
- `scripts/nginx-manager.bat` - Windows系统管理脚本
- `scripts/setup-ssl.sh` - Linux SSL证书申请脚本
- `scripts/setup-ssl.bat` - Windows SSL证书申请脚本

## 🚀 部署步骤

### 第一步：安装 Nginx

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install nginx
```

#### CentOS/RHEL:
```bash
sudo yum install nginx
```

#### Windows:
1. 访问 http://nginx.org/en/download.html
2. 下载 Windows 版本
3. 解压到 C:\nginx

### 第二步：配置 Nginx

#### Linux系统:
```bash
# 复制配置文件
sudo cp nginx/zhengzutouzi.conf /etc/nginx/sites-available/

# 创建软链接
sudo ln -sf /etc/nginx/sites-available/zhengzutouzi.conf /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重新加载配置
sudo systemctl reload nginx
```

#### Windows系统:
```cmd
# 使用管理脚本
scripts\nginx-manager.bat
# 选择选项1安装/更新配置
```

### 第三步：申请 SSL 证书

#### Linux系统 (使用 Certbot):
```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d zhengzutouzi.com -d www.zhengzutouzi.com
```

#### Windows系统:
1. 访问 https://certbot.eff.org/instructions
2. 下载 Windows 版本 Certbot
3. 安装 Certbot
4. 运行:
```cmd
certbot --nginx -d zhengzutouzi.com -d www.zhengzutouzi.com
```

### 第四步：启动服务

#### Linux系统:
```bash
# 启动 Nginx
sudo systemctl start nginx

# 设置开机自启
sudo systemctl enable nginx
```

#### Windows系统:
```cmd
# 使用管理脚本启动
scripts\nginx-manager.bat
# 选择选项2启动服务
```

## 🔧 配置详情

### 1. HTTP 重定向配置
```nginx
server {
    listen 80;
    server_name zhengzutouzi.com www.zhengzutouzi.com;
    
    # 自动重定向到HTTPS
    return 301 https://$host$request_uri;
}
```

### 2. HTTPS 服务器配置
```nginx
server {
    listen 443 ssl http2;
    server_name zhengzutouzi.com www.zhengzutouzi.com;

    # SSL证书配置
    ssl_certificate /etc/letsencrypt/live/zhengzutouzi.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zhengzutouzi.com/privkey.pem;
    
    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
}
```

### 3. 反向代理配置

#### 前端应用代理:
```nginx
location / {
    proxy_pass http://localhost:5173;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

#### API服务代理:
```nginx
# 基金服务API代理
location /api/fund/ {
    proxy_pass http://fund_server/api/fund/;
    # ... 其他代理设置
}

# 合约市场API代理
location /api/contract/ {
    proxy_pass http://contract_market/api/contract/;
    # ... 其他代理设置
}

# 期权市场API代理
location /api/option/ {
    proxy_pass http://option_market/api/option/;
    # ... 其他代理设置
}
```

## 🔒 安全配置

### 1. SSL 安全参数
- 使用 TLS 1.2 和 TLS 1.3 协议
- 配置安全的加密套件
- 禁用不安全的协议和算法

### 2. 请求头安全
```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

### 3. 防止信息泄露
- 隐藏 Nginx 版本信息
- 限制请求大小
- 配置适当的超时时间

## 📈 性能优化

### 1. 静态资源缓存
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. Gzip 压缩
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### 3. 连接优化
```nginx
worker_connections 1024;
keepalive_timeout 65;
```

## 🛡️ 防火墙配置

### Ubuntu/Debian (UFW):
```bash
# 开放 HTTP 和 HTTPS 端口
sudo ufw allow 80
sudo ufw allow 443

# 启用防火墙
sudo ufw enable
```

### CentOS/RHEL (FirewallD):
```bash
# 开放端口
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https

# 重新加载配置
sudo firewall-cmd --reload
```

## 🔄 自动化维护

### 1. SSL 证书自动续期
```bash
# 添加到 crontab
sudo crontab -e

# 添加以下行（每月1号凌晨2点检查续期）
0 2 1 * * certbot renew --quiet
```

### 2. 日志轮转
Nginx 默认配置了日志轮转，确保日志文件不会过大。

### 3. 监控与告警
建议配置以下监控：
- 服务可用性监控
- 响应时间监控
- 错误率监控
- SSL 证书过期提醒

## 📊 常用命令

### Linux 系统:
```bash
# 启动 Nginx
sudo systemctl start nginx

# 停止 Nginx
sudo systemctl stop nginx

# 重启 Nginx
sudo systemctl restart nginx

# 重新加载配置
sudo systemctl reload nginx

# 查看状态
sudo systemctl status nginx

# 测试配置
sudo nginx -t

# 查看日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Windows 系统:
使用 `scripts/nginx-manager.bat` 管理脚本进行操作。

## 🐛 故障排除

### 1. 服务无法启动
- 检查配置文件语法：`nginx -t`
- 检查端口占用：`netstat -tlnp | grep :80`
- 查看错误日志：`tail -f /var/log/nginx/error.log`

### 2. SSL 证书问题
- 检查证书路径是否正确
- 确认证书文件权限
- 重新申请证书：`certbot renew --force-renewal`

### 3. 反向代理问题
- 检查后端服务是否正常运行
- 验证代理配置是否正确
- 检查防火墙设置

### 4. 性能问题
- 检查服务器资源使用情况
- 优化 Nginx 配置参数
- 考虑启用缓存机制

## 📅 维护计划

### 日常维护
- 监控服务状态
- 检查错误日志
- 监控性能指标

### 定期维护
- 每月检查 SSL 证书有效期
- 每季度审查安全配置
- 每年进行性能优化评估

## 📞 支持与帮助

如遇到问题，请参考：
1. Nginx 官方文档：http://nginx.org/en/docs/
2. Certbot 官方文档：https://certbot.eff.org/docs/
3. 项目文档：docs/ 目录下的相关文件

---
*文档更新时间: 2025-10-24*
*Nginx 配置版本: 1.0.0*