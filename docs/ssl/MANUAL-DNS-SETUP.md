# 手动添加DNS TXT记录指南

## 概述

由于API令牌权限不足，无法自动添加DNS TXT记录来完成SSL证书申请。本指南将指导您如何手动添加这些记录。

## 需要添加的TXT记录

运行acme.sh后，系统会生成以下TXT记录：

1. 对于主域名 `jcstjj.top`:
   - 名称: `_acme-challenge.jcstjj.top`
   - 值: `jRSe6OBTpKFka62bKSHTbGprpaIrx9qhdr-HLqQtgAU`

2. 对于子域名 `www.jcstjj.top`:
   - 名称: `_acme-challenge.www.jcstjj.top`
   - 值: `fytZsD6HxKo5Wd-sW5yY1L8fvOnO4VbAD-DrHW-gz-Q`

## 手动添加步骤

1. 登录到Cloudflare控制台
2. 选择您的域名 `jcstjj.top`
3. 进入DNS管理页面
4. 添加第一个TXT记录：
   - 类型: TXT
   - 名称: `_acme-challenge`
   - 内容: `jRSe6OBTpKFka62bKSHTbGprpaIrx9qhdr-HLqQtgAU`
   - TTL: 120秒（或自动）
5. 添加第二个TXT记录：
   - 类型: TXT
   - 名称: `_acme-challenge.www`
   - 内容: `fytZsD6HxKo5Wd-sW5yY1L8fvOnO4VbAD-DrHW-gz-Q`
   - TTL: 120秒（或自动）
6. 保存更改

## 验证DNS记录

添加记录后，您可以使用以下命令验证记录是否已正确添加：

```bash
nslookup -type=TXT _acme-challenge.jcstjj.top
nslookup -type=TXT _acme-challenge.www.jcstjj.top
```

或者使用在线工具如 https://dnschecker.org/

## 完成证书申请

DNS记录生效后（通常需要几分钟），运行以下命令完成证书申请：

```bash
wsl -d Ubuntu -u administrator bash -c "source ~/.bashrc && ~/.acme.sh/acme.sh --renew -d jcstjj.top -d www.jcstjj.top"
```

## 安装证书

证书申请成功后，运行以下命令安装证书：

```bash
wsl -d Ubuntu -u administrator bash -c "source ~/.bashrc && ~/.acme.sh/acme.sh --install-cert -d jcstjj.top --key-file /mnt/c/ssl-manager/certs/jcstjj.top.key --fullchain-file /mnt/c/ssl-manager/certs/jcstjj.top.pem"
```

## 验证证书

检查证书文件是否已创建：

```bash
ls -la /mnt/c/ssl-manager/certs/
```

您应该看到以下文件：
- jcstjj.top.key (私钥)
- jcstjj.top.pem (完整证书链)

## 重启Nginx

最后，重启Nginx以应用新证书：

```bash
cd /c/nginx/nginx-1.24.0
nginx.exe -t && nginx.exe -s reload
```