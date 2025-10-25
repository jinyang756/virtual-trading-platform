# 最终SSL证书申请指南

## 当前状态

我们已经成功运行了acme.sh并获得了需要添加的DNS TXT记录，但由于API令牌权限不足，无法自动添加这些记录。

## 需要手动添加的DNS TXT记录

请手动在Cloudflare控制台中添加以下TXT记录：

### 记录1
- **类型**: TXT
- **名称**: `_acme-challenge`
- **内容**: `jRSe6OBTpKFka62bKSHTbGprpaIrx9qhdr-HLqQtgAU`
- **TTL**: 120秒

### 记录2
- **类型**: TXT
- **名称**: `_acme-challenge.www`
- **内容**: `fytZsD6HxKo5Wd-sW5yY1L8fvOnO4VbAD-DrHW-gz-Q`
- **TTL**: 120秒

## 手动添加步骤

1. 登录到Cloudflare控制台 (https://dash.cloudflare.com)
2. 选择您的账户和域名 `jcstjj.top`
3. 进入DNS管理页面
4. 点击"添加记录"
5. 按照上面的信息添加第一个TXT记录
6. 再次点击"添加记录"
7. 按照上面的信息添加第二个TXT记录
8. 保存更改

## 验证DNS记录

添加记录后，等待几分钟让DNS记录传播，然后使用以下命令验证：

```bash
nslookup -type=TXT _acme-challenge.jcstjj.top
nslookup -type=TXT _acme-challenge.www.jcstjj.top
```

您应该能看到刚刚添加的TXT记录值。

## 完成证书申请

DNS记录生效后，运行以下命令完成证书申请：

```bash
wsl -d Ubuntu -u administrator bash -c "source ~/.bashrc && ~/.acme.sh/acme.sh --renew -d jcstjj.top -d www.jcstjj.top"
```

## 安装证书

证书申请成功后，运行以下命令安装证书到指定目录：

```bash
wsl -d Ubuntu -u administrator bash -c "source ~/.bashrc && ~/.acme.sh/acme.sh --install-cert -d jcstjj.top --key-file /mnt/c/ssl-manager/certs/jcstjj.top.key --fullchain-file /mnt/c/ssl-manager/certs/jcstjj.top.pem"
```

## 验证证书文件

检查证书文件是否已正确创建：

```bash
dir C:\ssl-manager\certs
```

您应该看到以下文件：
- `jcstjj.top.key` (私钥)
- `jcstjj.top.pem` (完整证书链)

## 重启Nginx服务

最后，重启Nginx以应用新证书：

```bash
cd /d C:\nginx\nginx-1.24.0
nginx.exe -t && nginx.exe -s reload
```

## 验证HTTPS连接

打开浏览器访问 https://jcstjj.top 和 https://www.jcstjj.top 确保证书正常工作。

## 自动续签设置（可选）

为了确保证书自动续签，可以设置一个计划任务：

```bash
# 在WSL中添加cron任务
wsl -d Ubuntu -u administrator bash -c "echo '0 0 1 * * \"/home/administrator/.acme.sh\"/acme.sh --cron --home \"/home/administrator/.acme.sh\" > /dev/null' | crontab -"
```

## 故障排除

如果遇到问题，请检查：

1. DNS记录是否正确添加且已传播
2. API令牌权限是否足够（需要Zone:DNS:Edit权限）
3. 域名是否正确指向Cloudflare的名称服务器
4. 防火墙是否阻止了必要的网络连接

## 参考文档

- [Cloudflare API文档](https://api.cloudflare.com/)
- [acme.sh文档](https://github.com/acmesh-official/acme.sh)
- [Let's Encrypt文档](https://letsencrypt.org/docs/)