# 部署到 Cloudflare Pages

本文档说明如何将管理面板部署到 Cloudflare Pages。

## 部署步骤

1. 登录到 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 导航到 Pages 服务
3. 点击 "Create a project"
4. 选择 "Connect to Git"
5. 连接到您的 Git 仓库（GitHub, GitLab, 或 Bitbucket）
6. 选择包含此项目的仓库
7. 配置以下设置：
   - Project name: `virtual-trading-platform-admin`
   - Production branch: `main` (或您的默认分支)
   - Build settings:
     - Framework preset: `None`
     - Build command: (留空)
     - Build output directory: `/public`
8. 点击 "Save and Deploy"

## 注意事项

- 此部署仅包含前端界面，不包含后端 API 功能
- 要使用完整的管理功能，请在本地环境中运行完整的应用程序
- 后端 API 需要服务器环境支持，不能直接部署到 Cloudflare Pages
- 部分运维功能（如服务控制、日志查看等）需要后端支持，仅在完整部署环境中可用

## 自定义域名

如果需要使用自定义域名：

1. 在 Cloudflare Pages 项目设置中找到 "Custom domains"
2. 添加您的自定义域名
3. 按照指示配置 DNS 记录

## 环境变量

此项目不需要环境变量即可运行。

## 支持的浏览器

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 文字可读性优化说明

为了提高管理界面在 Cloudflare Pages 上的文字可读性，我们进行了以下优化：

1. 增加了字体大小和行高，使文字更清晰易读
2. 优化了颜色对比度，确保文字与背景有足够对比度
3. 改进了布局间距，使界面元素更清晰
4. 优化了响应式设计，确保在不同设备上都有良好的可读性

请注意，由于 Cloudflare Pages 是静态托管平台，仅支持前端功能，不包含后端 API 功能。完整的管理功能需要在支持 Node.js 的服务器环境中运行。