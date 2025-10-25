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
     - Framework preset: `Vite`
     - Build command: `npm run build`
     - Build output directory: `dist`
8. 在 "Environment variables" 部分添加以下环境变量：
   - `VITE_API_BASE`: `https://api.jcstjj.top`
9. 点击 "Save and Deploy"

## 注意事项

- 此部署包含完整的前端管理界面
- 管理界面通过API与后端服务通信
- 后端 API 运行在 `api.jcstjj.top`，由独立的服务器托管
- 需要确保后端API服务器配置了正确的CORS策略以允许来自Cloudflare Pages的请求

## 自定义域名

如果需要使用自定义域名：

1. 在 Cloudflare Pages 项目设置中找到 "Custom domains"
2. 添加您的自定义域名
3. 按照指示配置 DNS 记录

## 环境变量

必须配置以下环境变量：

- `VITE_API_BASE`: 后端API的基础URL (例如: https://api.jcstjj.top)

## 支持的浏览器

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 管理功能说明

部署到Cloudflare Pages的管理面板包含以下功能：

1. **仪表盘**: 系统关键指标展示
2. **用户管理**: 用户列表、创建、编辑、删除
3. **交易管理**: 交易记录查询和状态更新
4. **资金管理**: 用户资金查询和调整

所有管理功能通过API与后端服务通信，确保数据的一致性和安全性。

## 文字可读性优化说明

为了提高管理界面在 Cloudflare Pages 上的文字可读性，我们进行了以下优化：

1. 增加了字体大小和行高，使文字更清晰易读
2. 优化了颜色对比度，确保文字与背景有足够对比度
3. 改进了布局间距，使界面元素更清晰
4. 优化了响应式设计，确保在不同设备上都有良好的可读性

请注意，完整的管理功能需要后端API支持。部署到Cloudflare Pages的前端界面通过HTTPS与后端API通信，确保安全性和功能性。