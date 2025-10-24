# SSL证书自动化管理系统部署指南

## 📋 目录结构

```
C:\ssl-manager\
├── request-ssl-wsl.sh          # Linux/WSL 申请脚本
├── install-acme-windows-final.bat  # Windows 申请脚本
├── enable-https.bat            # 启用 HTTPS 配置脚本
├── nginx-monitor.bat           # Nginx 状态监控脚本
├── jcstjj.top.conf             # Nginx 配置文件
├── logs\                       # 日志输出目录
└── certs\                      # 证书存储目录
```

## 🚀 部署步骤

### 1. 准备工作

确保服务器满足以下要求：
- 已安装Nginx (推荐版本: nginx-1.24.0)
- 已安装curl工具
- 对于Linux/WSL环境：已安装bash shell

### 2. 配置Cloudflare API Token

在以下脚本中修改Cloudflare API Token：
- `request-ssl-wsl.sh`
- `install-acme-windows-final.bat`

```bash
# 设置 Cloudflare API Token
export CF_Token="您的Cloudflare_API_Token"
export CF_Email="您的邮箱地址"
```

### 3. 执行证书申请

#### Windows系统：
```cmd
# 以管理员身份运行
install-acme-windows-final.bat
```

#### Linux/WSL系统：
```bash
# 赋予执行权限
chmod +x request-ssl-wsl.sh

# 执行脚本
./request-ssl-wsl.sh
```

### 4. 配置Nginx

将 `jcstjj.top.conf` 复制到Nginx配置目录并更新主配置文件以包含该站点配置。

### 5. 配置自动续签

运行 `setup-auto-renew.bat` 脚本配置任务计划程序：
```cmd
# 以管理员身份运行
setup-auto-renew.bat
```

## 🔄 自动续签机制

系统会自动配置以下任务计划程序任务：

1. **SSL Certificate Renewal**
   - 触发器：每月1日 03:00
   - 操作：运行 `install-acme-windows-final.bat`
   - 权限：以SYSTEM账户运行
   - 日志：输出到 `logs/renew.log`

2. **SSL Manager Log Cleanup**
   - 触发器：每月1日 04:00
   - 操作：清理30天前的日志文件
   - 权限：以SYSTEM账户运行

## 📊 监控和日志

### 日志文件位置
- 证书续签日志：`C:\ssl-manager\logs\renew.log`
- Nginx监控日志：`C:\ssl-manager\logs\nginx-monitor.log`

### 监控脚本
运行 `nginx-monitor.bat` 检查Nginx状态：
```cmd
nginx-monitor.bat
```

## 🛡️ 安全注意事项

1. 保护好您的Cloudflare API Token，不要将其泄露给他人
2. 定期检查证书的有效期和续签状态
3. 监控日志文件，及时发现异常情况
4. 确保证书文件具有适当的访问权限

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
- 检查任务计划程序任务是否存在且正确配置
- 查看系统日志确认任务是否正常执行
- 手动执行续签命令测试功能

## 📞 技术支持

如遇到任何问题，请联系技术支持团队或查阅acme.sh官方文档获取更多帮助。