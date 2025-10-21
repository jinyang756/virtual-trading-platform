# 移动端客户端独立部署指南

本文档说明如何将移动端客户端独立部署到生产环境并绑定域名 `jiuzhougroup.vip`。

## 部署架构

移动端客户端将作为一个独立的应用部署，只包含移动端相关的页面和资源，不包含管理后台和其他PC端功能。

## 部署方式

### Vercel 部署（推荐）

1. 确保已安装 Vercel CLI：
   ```bash
   npm install -g vercel
   ```

2. 登录 Vercel（使用您提供的凭证）：
   ```bash
   vercel login
   ```
   
   当提示时，使用以下信息：
   - 项目ID: prj_WFQNbnLou9TVlIBKz0OQp641Hqah
   - 用户ID: cY13U0CjVL9iQjidbPLsLp94
   - 令牌：RHJHxMoc1jdd9tpaLNDRf66t

3. 使用专用配置文件部署移动端：
   ```bash
   npm run deploy-mobile
   ```
   或直接使用 Vercel 命令：
   ```bash
   vercel --prod --local-config=vercel-mobile.json
   ```

4. 在 Vercel 控制台中添加域名：
   - 进入项目设置
   - 选择 "Domains"
   - 添加域名 `jiuzhougroup.vip`
   - 按照提示配置 DNS 记录

### 独立服务器部署

1. 复制必要文件到服务器：
   ```bash
   # 复制移动端文件
   cp -r public/mobile /path/to/deployment/
   
   # 复制移动端服务器文件
   cp mobile-server.js /path/to/deployment/
   
   # 复制 package.json
   cp package.json /path/to/deployment/
   ```

2. 安装依赖：
   ```bash
   cd /path/to/deployment
   npm install --production
   ```

3. 启动服务：
   ```bash
   npm run start-mobile
   ```

4. 配置反向代理（如使用 Nginx）：
   ```nginx
   server {
       listen 80;
       server_name jiuzhougroup.vip;
       
       location / {
           proxy_pass http://localhost:3002;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## 域名配置

### DNS 配置

在您的域名提供商处添加以下 DNS 记录：

1. A 记录：
   ```
   类型: A
   主机: @
   值: 您的服务器IP地址
   ```

2. 如果使用 Vercel，按照 Vercel 提供的 CNAME 记录配置：
   ```
   类型: CNAME
   主机: @
   值: cname.vercel-dns.com
   ```

## 环境变量

移动端客户端需要以下环境变量：

- `API_BASE_URL`: 后端API的基础URL（已配置为 https://prj-wfqnbnlou9tvlibkz0oqp641hqah.vercel.app）

## 访问地址

部署完成后，移动端客户端可通过以下地址访问：
- https://jiuzhougroup.vip

## 注意事项

1. 移动端客户端通过 AJAX 请求与后端API通信，请确保API可访问
2. 如果API部署在不同域名下，需要配置CORS
3. 静态资源已优化，可直接部署使用
4. 移动端使用 localStorage 存储用户信息，请确保浏览器支持

## 故障排除

### 常见问题

1. **页面无法加载**
   - 检查服务器是否正常运行
   - 检查端口是否被占用
   - 检查防火墙设置

2. **API 请求失败**
   - 检查 API_BASE_URL 配置
   - 检查 CORS 配置
   - 检查网络连接

3. **静态资源加载失败**
   - 检查文件路径是否正确
   - 检查文件权限设置

## 更新部署

要更新移动端客户端：

1. 更新代码：
   ```bash
   git pull origin main
   ```

2. 重新部署：
   ```bash
   npm run deploy-mobile
   ```

或在 Vercel 控制台中触发重新部署。