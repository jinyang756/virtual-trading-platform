# SSL证书配置指南

## 当前状态

我们已经创建了自签名证书，可以用于测试环境。证书文件位于：
- `C:\ssl-manager\certs\jcstjj.top.crt` (公钥证书)
- `C:\ssl-manager\certs\jcstjj.top.pfx` (包含公钥和私钥的PFX文件)

## 生产环境证书申请

要在生产环境中使用有效的SSL证书，建议使用以下方法之一：

### 方法1：使用Let's Encrypt (推荐)

1. 安装WSL (Windows Subsystem for Linux)
   ```cmd
   wsl --install -d Ubuntu
   ```

2. 在WSL中安装acme.sh
   ```bash
   curl https://get.acme.sh | sh
   ```

3. 使用Cloudflare DNS验证申请证书
   ```bash
   export CF_Token="您的Cloudflare_API_Token"
   ~/.acme.sh/acme.sh --issue --dns dns_cf -d jcstjj.top -d www.jcstjj.top
   ```

4. 安装证书
   ```bash
   ~/.acme.sh/acme.sh --install-cert -d jcstjj.top \
   --key-file /c/ssl-manager/certs/jcstjj.top.key \
   --fullchain-file /c/ssl-manager/certs/jcstjj.top.pem
   ```

### 方法2：使用Windows ACME Simple (WACS)

1. 从GitHub下载WACS:
   https://github.com/win-acme/win-acme/releases

2. 运行WACS并按照提示操作:
   ```cmd
   wacs.exe
   ```

### 方法3：从商业CA购买证书

1. 生成CSR (Certificate Signing Request)
2. 提交给商业CA (如DigiCert, GlobalSign等)
3. 安装返回的证书文件

## Nginx配置

当前Nginx配置文件 (`nginx\jcstjj.top.conf`) 已设置为使用证书文件:
```nginx
ssl_certificate C:/ssl-manager/certs/jcstjj.top.crt;
ssl_certificate_key C:/ssl-manager/certs/jcstjj.top.key;
```

当您获得有效的证书文件后，只需替换这些文件即可。

## 证书续签

### Let's Encrypt证书
acme.sh会自动创建计划任务进行续签。

### 商业证书
根据CA的要求进行续签操作。

## 故障排除

### 1. Nginx无法启动
检查证书文件路径是否正确，文件是否存在。

### 2. 浏览器显示证书错误
确保使用的是有效的受信任证书，而不是自签名证书。

### 3. 证书过期
检查证书有效期并及时续签。

## 安全建议

1. 妥善保管私钥文件
2. 定期更新证书
3. 使用强加密算法
4. 启用HSTS (HTTP Strict Transport Security)