# 部署到 Vercel

本文档说明如何将虚拟交易平台前端部署到 Vercel。

## 部署步骤

### 1. 连接到 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 使用您的 GitHub 账户登录
3. 点击 "New Project"
4. 选择此仓库: `jinyang756/virtual-trading-frontend`
5. 点击 "Import"

### 2. 配置项目

Vercel 会自动检测项目配置：

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. 部署

1. 点击 "Deploy"
2. 等待构建完成（通常需要1-2分钟）
3. 部署完成后，Vercel 会提供一个临时域名

### 4. 自定义域名（可选）

1. 在项目设置中找到 "Domains"
2. 添加您的自定义域名 `jiuzhougroup.vip`
3. 按照指示配置 DNS 记录

## 环境变量

此项目支持环境变量配置，您可以在 Vercel 项目设置中添加以下环境变量：

- `VITE_APP_NAME`: 应用名称（默认：虚拟交易平台）
- `VITE_API_BASE`: API 基础地址（默认：https://api.jcstjj.top）
- `VITE_CUSTOM_DOMAIN`: 自定义域名（默认：jiuzhougroup.vip）

在 Vercel 中配置环境变量的步骤：
1. 进入 Vercel 项目设置
2. 点击 "Environment Variables"
3. 添加所需的环境变量
4. 重新部署项目使环境变量生效

注意：我们使用 `https://api.jcstjj.top` 作为 API 地址来解决跨域问题。请确保该域名已正确配置并能访问后端 API。

## 系统架构

系统采用三层联动架构：

```
用户浏览器
   ↓
Cloudflare（DNS + CDN + SSL + 安全防护）
   ↓
jiuzhougroup.vip（Vercel 托管的前端管理界面）
   ↓
axios 请求 API（跨域）
   ↓
api.jcstjj.top（香港服务器上的后端服务）
```

## 诊断工具

项目提供了诊断工具来检查系统状态：

### 快速诊断（Windows）
```bash
scripts\quick-diagnostics.bat
```

### 详细诊断
```bash
node scripts/system-diagnostics.js
```

## 自动部署

此仓库已配置 GitHub Actions，每次推送到 `main` 分支时都会自动触发 Vercel 重新部署。

## 故障排除

### 构建失败

1. 检查构建日志以获取错误信息
2. 确保所有依赖项都已正确安装
3. 检查 `package.json` 中的构建脚本

### 部署后页面无法访问

1. 检查路由配置
2. 确保 `vercel.json` 配置正确
3. 验证静态资源路径
4. 检查是否存在 JavaScript 错误

### 空白页面问题

如果部署后出现空白页面，请检查：
1. 控制台是否有 JavaScript 错误
2. 网络请求是否正常加载资源
3. 路由配置是否正确处理所有路径
4. 确保 `vercel.json` 中的路由配置正确

### 跨域问题

如果遇到跨域问题，请检查：
1. 确保 `VITE_API_BASE` 环境变量设置为正确的域名（https://api.jcstjj.top）
2. 确保后端服务器已配置 CORS 头
3. 验证网络请求是否能正常到达 API 服务器

## 支持

如有任何问题，请联系技术支持团队。