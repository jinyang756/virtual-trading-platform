# 系统部署清单

## 1. 前端部署（Vercel）

### 配置要求
- [ ] GitHub 仓库已创建并推送代码
- [ ] Vercel 项目已创建并连接到 GitHub 仓库
- [ ] 环境变量已配置：
  - `VITE_API_BASE` = `https://api.jcstjj.top`
  - `VITE_APP_NAME` = `虚拟交易平台`
  - `VITE_CUSTOM_DOMAIN` = `jiuzhougroup.vip`
- [ ] 自定义域名 `jiuzhougroup.vip` 已添加到 Vercel 项目
- [ ] DNS 记录已配置指向 Vercel

### 部署步骤
1. [ ] 在 Vercel Dashboard 中触发部署
2. [ ] 等待构建完成（约2-3分钟）
3. [ ] 验证部署成功，访问应用页面
4. [ ] 测试前端功能是否正常

## 2. 后端部署（香港服务器）

### 配置要求
- [ ] Node.js 环境已安装（v16或更高版本）
- [ ] PM2 进程管理器已安装
- [ ] Nginx 已安装并配置
- [ ] SSL 证书已申请并配置
- [ ] 防火墙已配置允许端口 80 和 443

### 部署步骤
1. [ ] 克隆代码到服务器：
   ```bash
   git clone <repository-url>
   cd virtual-trading-platform
   ```
2. [ ] 安装依赖：
   ```bash
   npm install
   ```
3. [ ] 配置环境变量（创建 .env 文件）：
   ```env
   JWT_SECRET=your_jwt_secret_here
   TEABLE_API_BASE=https://app.teable.cn
   TEABLE_BASE_ID=your_base_id
   TEABLE_API_TOKEN=your_api_token
   ```
4. [ ] 启动服务：
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```
5. [ ] 配置 Nginx：
   - [ ] 复制配置文件到 Nginx 配置目录
   - [ ] 重新加载 Nginx 配置：
     ```bash
     nginx -s reload
     ```
6. [ ] 验证服务运行状态：
   ```bash
   pm2 list
   pm2 logs
   ```

## 3. Cloudflare 配置

### DNS 配置
- [ ] A 记录：`jcstjj.top` → Vercel IP
- [ ] CNAME 记录：`www.jcstjj.top` → Vercel cname
- [ ] A 记录：`api.jcstjj.top` → 香港服务器 IP
- [ ] A 记录：`jiuzhougroup.vip` → Vercel IP

### SSL/TLS 配置
- [ ] SSL/TLS 加密模式设置为 "Full (strict)"
- [ ] 自动化 HTTPS 已启用
- [ ] HSTS 已配置

### 安全配置
- [ ] WAF 已启用
- [ ] Rate Limiting 已配置
- [ ] Bot Fight Mode 已启用
- [ ] 防火墙规则已配置

## 4. 联通性测试

### 前端测试
- [ ] 访问 `https://jiuzhougroup.vip` 能正常加载页面
- [ ] 页面资源（CSS、JS、图片）能正常加载
- [ ] 前端能正常调用后端 API

### 后端测试
- [ ] `https://api.jcstjj.top/health` 返回健康状态
- [ ] `https://api.jcstjj.top/api/ops/status` 能正常访问
- [ ] API 接口能正确处理跨域请求

### 网络测试
- [ ] DNS 解析正常
- [ ] SSL 证书有效
- [ ] 端口 80 和 443 可访问
- [ ] CDN 资源加载正常

## 5. 监控与日志

### 日志配置
- [ ] PM2 日志已配置轮转
- [ ] Nginx 访问日志和错误日志已配置
- [ ] 应用日志已配置输出到文件

### 监控配置
- [ ] 服务器资源监控已配置
- [ ] 应用性能监控已配置
- [ ] 错误告警已配置
- [ ] 自动化健康检查已配置

## 6. 备份与恢复

### 数据备份
- [ ] 数据库备份策略已制定
- [ ] 配置文件备份策略已制定
- [ ] SSL 证书备份策略已制定

### 灾难恢复
- [ ] 灾难恢复计划已制定
- [ ] 备份恢复测试已完成
- [ ] 应急联系人列表已准备

## 7. 安全加固

### 访问控制
- [ ] SSH 密钥认证已配置
- [ ] 防火墙规则已优化
- [ ] 端口访问限制已配置

### 定期维护
- [ ] 系统更新计划已制定
- [ ] 安全扫描计划已制定
- [ ] 性能优化计划已制定