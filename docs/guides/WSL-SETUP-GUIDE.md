# WSL设置指南

## 当前状态

WSL安装正在进行中。请按照以下步骤完成设置：

## 安装完成后操作步骤

### 1. 重启系统
安装WSL后需要重启系统以完成安装过程。

### 2. 初始化Ubuntu
系统重启后，打开"Ubuntu"应用完成初始设置：
- 设置默认用户名和密码

### 3. 安装acme.sh
在Ubuntu终端中执行以下命令：
```bash
curl https://get.acme.sh | sh
source ~/.bashrc
```

### 4. 申请SSL证书
执行以下命令申请SSL证书：
```bash
export CF_Token="ygil2YkieHrj0khpA9CYwOCzXZtp_QZr9okYRWQd"
export CF_Email="guanyu432hz@gmail.com"
acme.sh --issue --dns dns_cf -d jcstjj.top -d www.jcstjj.top
```

### 5. 安装证书
将证书安装到指定路径：
```bash
acme.sh --install-cert -d jcstjj.top \
--key-file /mnt/c/ssl-manager/certs/jcstjj.top.key \
--fullchain-file /mnt/c/ssl-manager/certs/jcstjj.top.pem \
--reloadcmd "powershell.exe -Command 'Start-Process nginx.exe -ArgumentList \"-s reload\" -WorkingDirectory \"C:\\nginx\\nginx-1.24.0\"'"
```

### 6. 重启Nginx服务
最后重启Nginx服务以应用新证书。

## 验证步骤

### 检查WSL状态
```powershell
wsl -l -v
```

### 测试证书申请
在Ubuntu中执行：
```bash
acme.sh --list
```

## 故障排除

### 1. WSL未正确安装
如果WSL未正确安装，请重新执行安装命令：
```powershell
wsl --install -d Ubuntu
```

### 2. Ubuntu无法启动
如果Ubuntu应用无法启动，请尝试：
```powershell
wsl --unregister Ubuntu
wsl --install -d Ubuntu
```

### 3. acme.sh安装失败
如果acme.sh安装失败，请检查网络连接并重试。

## 安全注意事项

1. 妥善保管Cloudflare API Token
2. 不要在公共场合暴露API Token
3. 定期检查证书有效期