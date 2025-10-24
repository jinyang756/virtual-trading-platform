# 设置SSL证书自动续期

Let's Encrypt证书的有效期为90天，为了确保您的网站持续安全运行，需要设置自动续期。

## 方法一：使用WSL中的cron任务（推荐）

1. 打开WSL Ubuntu终端：
```bash
wsl -d Ubuntu -u administrator
```

2. 编辑cron任务：
```bash
crontab -e
```

3. 添加以下行以每月续期一次证书：
```bash
# 每月1日检查并续期证书（如果需要）
0 0 1 * * "/home/administrator/.acme.sh"/acme.sh --cron --home "/home/administrator/.acme.sh" > /dev/null
```

4. 保存并退出编辑器

## 方法二：使用Windows任务计划程序

1. 打开任务计划程序
2. 创建基本任务
3. 设置以下参数：
   - 名称：SSL Certificate Renewal
   - 触发器：每月第一天
   - 操作：启动程序
   - 程序或脚本：`C:\Windows\System32\wsl.exe`
   - 添加参数：`-d Ubuntu -u administrator bash -c "export CF_Token='2YADdLWLowDWtRdfSEmhhzEEKZCXGnB42KXVTtFi'; export CF_Email='guanyu432hz@gmail.com'; ~/.acme.sh/acme.sh --renew -d jcstjj.top -d www.jcstjj.top"`

## 手动续期命令

如果需要手动续期证书，可以使用以下命令：

```bash
wsl -d Ubuntu -u administrator bash -c "export CF_Token='2YADdLWLowDWtRdfSEmhhzEEKZCXGnB42KXVTtFi'; export CF_Email='guanyu432hz@gmail.com'; ~/.acme.sh/acme.sh --renew -d jcstjj.top -d www.jcstjj.top"
```

## 验证续期

续期后，您需要重新将证书复制到Nginx目录并重新加载Nginx：

```powershell
# 复制证书到Nginx目录
Copy-Item -Path "c:\ssl-manager\certs\jcstjj.top.key" -Destination "C:\nginx\nginx-1.24.0\ssl\jcstjj.top.key" -Force
Copy-Item -Path "c:\ssl-manager\certs\jcstjj.top.pem" -Destination "C:\nginx\nginx-1.24.0\ssl\jcstjj.top.pem" -Force

# 重新加载Nginx
cd C:\nginx\nginx-1.24.0
nginx.exe -s reload
```

## 监控证书过期

您可以使用以下命令检查证书过期时间：

```bash
# 在WSL中检查
wsl -d Ubuntu -u administrator bash -c "openssl x509 -in ~/.acme.sh/jcstjj.top_ecc/fullchain.cer -text -noout | grep 'Not After'"

# 或者使用PowerShell检查（需要先安装OpenSSL）
openssl x509 -in C:\nginx\nginx-1.24.0\ssl\jcstjj.top.pem -text -noout | Select-String "Not After"
```

## 故障排除

如果自动续期失败，请检查：

1. Cloudflare API令牌是否仍然有效
2. DNS记录权限是否正确
3. WSL是否正常运行
4. 网络连接是否正常

## 最佳实践

1. 设置邮件通知以在续期失败时收到警报
2. 定期手动检查证书状态
3. 保留旧证书的备份
4. 在低流量时段执行续期操作