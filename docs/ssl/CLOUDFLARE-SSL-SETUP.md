# Cloudflare SSL证书申请问题解决指南

## 问题描述

在使用acme.sh通过Cloudflare DNS API申请SSL证书时，遇到了以下错误：
```
Add txt record error.
Error adding TXT record to domain: _acme-challenge.jcstjj.top
{"success":false,"errors":[{"code":10000,"message":"Authentication error"}]}
```

## 问题原因

此错误通常是由于以下原因之一：

1. Cloudflare API令牌权限不足
2. 使用了受限的API令牌而不是全局API密钥
3. API令牌已过期或无效

## 解决方案

### 方案一：使用具有足够权限的API令牌

1. 登录Cloudflare控制台
2. 进入"用户配置文件" > "API令牌"
3. 创建一个新的API令牌，确保包含以下权限：
   - Zone: DNS: Edit
   - Zone: Zone: Read
4. 将新令牌用于SSL证书申请

### 方案二：使用全局API密钥（不推荐但有效）

1. 登录Cloudflare控制台
2. 进入"用户配置文件" > "API令牌"
3. 查看"全局API密钥"
4. 使用全局API密钥和账户邮箱运行脚本

### 方案三：手动添加DNS记录

1. 运行acme.sh生成TXT记录值：
   ```bash
   acme.sh --issue --dns -d jcstjj.top -d www.jcstjj.top
   ```
2. 手动将显示的TXT记录添加到Cloudflare DNS
3. 重新运行acme.sh完成验证：
   ```bash
   acme.sh --renew -d jcstjj.top
   ```

## 脚本使用

### 使用API令牌
```bash
# 编辑脚本设置正确的API令牌
nano setup-acme.sh
# 运行脚本
./setup-acme.sh
```

### 使用全局API密钥
```bash
# 编辑脚本设置全局API密钥
nano setup-acme-full.sh
# 运行脚本
./setup-acme-full.sh
```

## 验证

申请成功后，检查以下文件是否存在且不为空：
- `/mnt/c/ssl-manager/certs/jcstjj.top.key`
- `/mnt/c/ssl-manager/certs/jcstjj.top.pem`

## 注意事项

1. 确保域名已正确指向Cloudflare的名称服务器
2. 等待DNS更改传播完成（通常需要几分钟）
3. Cloudflare免费计划可能有限制，考虑升级到付费计划以获得更多功能