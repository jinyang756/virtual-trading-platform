# SSL证书自动申请与配置指南

## 概述

本指南介绍了如何使用自动化脚本在WSL Ubuntu环境中一键申请和安装SSL证书。

## 文件说明

- `scripts/setup-acme.sh` - 在Ubuntu中运行的Bash脚本，用于安装acme.sh并申请SSL证书
- `scripts/setup-ssl-windows.bat` - 在Windows中运行的批处理脚本，用于自动化整个SSL证书申请流程
- `scripts/wsl-install-complete.bat` - WSL安装完成后的操作指南

## 使用方法

### 方法一：全自动化（推荐）

1. 确保WSL和Ubuntu已正确安装
2. 双击运行 `scripts/setup-ssl-windows.bat`
3. 脚本将自动完成证书申请和Nginx配置

### 方法二：手动执行

1. 启动Ubuntu终端
2. 执行以下命令：
```bash
chmod +x /mnt/c/Users/Administrator/jucaizhongfa/scripts/setup-acme.sh
/mnt/c/Users/Administrator/jucaizhongfa/scripts/setup-acme.sh
```

## 证书信息

- 域名: jcstjj.top
- 子域名: www.jcstjj.top
- 证书存储路径: C:\ssl-manager\certs\
- 私钥文件: jcstjj.top.key
- 证书文件: jcstjj.top.pem

## 注意事项

1. 确保Cloudflare DNS已正确配置
2. 确保Nginx配置文件指向正确的证书路径
3. 脚本会自动重载Nginx以应用新证书