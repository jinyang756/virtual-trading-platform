# 虚拟交易平台

一个用于模拟交易的虚拟平台，支持多种交易类型和社交功能。

## 版本信息

- 当前版本: v1.0.0
- 发布状态: 正式版
- 发布日期: 2025年10月21日

## 功能特性

- 多种交易引擎（合约交易、二元期权、私募基金）
- 社交功能（关注、交易分享、点赞、评论）
- 风险管理
- 市场模拟
- 数据分析
- 工作流系统

## 快速开始

### 本地运行

```bash
# 安装依赖
npm install

# 启动服务
npm start
```

服务将在 http://localhost:3001 上运行。

### 开发模式

```bash
npm run dev
```

## 部署

### Docker 部署

项目支持 Docker 部署，使用以下命令构建和运行：

```bash
# 构建镜像
docker build -t virtual-trading-platform .

# 运行容器
docker run -p 3001:3001 virtual-trading-platform
```

### Kubernetes 部署

项目包含完整的 Kubernetes 配置文件，位于 [k8s](k8s/) 目录中。

### Vercel 部署

项目已配置支持 Vercel 部署：

1. 将项目推送到 GitHub/GitLab
2. 在 Vercel 上导入项目
3. Vercel 会自动检测并使用 `vercel.json` 配置文件
4. 部署完成后即可访问

Vercel 部署注意事项：
- 项目使用 Teable 作为数据库，确保 `config/teableConfig.js` 中的配置正确
- 静态文件位于 `public/` 目录中，已正确配置路由
- API 路由位于 `/api` 路径下

### 移动端独立部署

移动端客户端已正式发布 v1.0.0 版本，可通过以下地址访问：

**生产环境地址**: https://jiuzhougroup.vip

移动端客户端可以独立部署到生产环境并绑定域名 `jiuzhougroup.vip`：

1. 使用专用配置文件部署：
   ```bash
   npm run deploy-mobile
   ```

2. 在 Vercel 控制台中添加域名 `jiuzhougroup.vip`

详细部署说明请查看 [MOBILE_DEPLOYMENT_GUIDE.md](MOBILE_DEPLOYMENT_GUIDE.md)。

如果使用您提供的 Vercel 凭证：
- 项目ID: prj_WFQNbnLou9TVlIBKz0OQp641Hqah
- 用户ID: cY13U0CjVL9iQjidbPLsLp94
- 令牌：RHJHxMoc1jdd9tpaLNDRf66t

## 项目结构

```
├── config/              # 配置文件
├── data/                # 数据文件
├── k8s/                 # Kubernetes 配置
├── public/              # 静态文件
├── scripts/             # 脚本文件
├── src/
│   ├── controllers/     # 控制器
│   ├── database/        # 数据库适配器
│   ├── engine/          # 交易引擎
│   ├── middleware/      # 中间件
│   ├── models/          # 数据模型
│   ├── modules/         # 功能模块
│   ├── routes/          # 路由
│   ├── utils/           # 工具函数
│   └── app.js           # Express 应用
├── tests/               # 测试文件
└── templates/           # 模板文件
```

## 文档

- [版本变更日志](CHANGELOG.md)
- [部署指南](DEPLOYMENT_GUIDE.md)
- [移动端部署指南](MOBILE_DEPLOYMENT_GUIDE.md)
- [API 文档](docs/API.md)
- [用户使用指南](docs/USER_GUIDE.md)
- [v1.0 版本发布说明](docs/RELEASE_v1.0.md)

## 许可证

MIT