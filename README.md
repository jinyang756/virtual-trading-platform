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

## 项目结构

```
project-root/
├── apps/                        # 多服务入口
│   ├── fund-server/            # 私募基金服务
│   ├── contract-market/        # 合约交易服务
│   ├── option-market/          # 期权交易服务
│   └── cron-jobs/              # 定时任务服务
│       ├── updateFundNetValue.js
│       ├── contractMarketUpdater.js
│       └── optionMarketUpdater.js
├── packages/                   # 可复用模块
│   ├── db-adapter/             # Teable Proxy 封装
│   ├── api-client/             # Axios 封装
│   ├── chart-kit/              # 图表组件封装
│   └── ui-components/          # 通用 UI 组件库
├── web/                        # 响应式 Web 前端
│   ├── pages/                  # 页面入口（/funds /contract /option）
│   ├── components/             # 页面组件
│   ├── assets/                 # 图标、样式、字体
│   └── router/                 # 路由配置
├── mobile/                     # 移动端页面（已完成）
│   ├── funds.html
│   ├── contract-market.html
│   └── option-market.html
├── public/                     # 静态资源
├── scripts/                    # 构建/部署脚本
├── config/                     # 配置文件
├── data/                       # 数据文件
├── k8s/                        # Kubernetes 配置
├── src/                        # 源代码
│   ├── controllers/            # 控制器
│   ├── database/               # 数据库适配器
│   ├── engine/                 # 交易引擎
│   ├── middleware/             # 中间件
│   ├── models/                 # 数据模型
│   ├── modules/                # 功能模块
│   ├── routes/                 # 路由
│   ├── utils/                  # 工具函数
│   └── app.js                 # Express 应用
├── tests/                      # 测试文件
└── templates/                  # 模板文件
```

## 模块职责说明

### apps/ - 多服务入口
- **fund-server/**: 私募基金服务，提供基金相关的API和页面
- **contract-market/**: 合约交易服务，提供合约行情相关的API和页面
- **option-market/**: 期权交易服务，提供期权行情相关的API和页面
- **cron-jobs/**: 定时任务服务，包含所有定时更新任务

### packages/ - 可复用模块
- **db-adapter/**: Teable数据库连接和查询封装
- **api-client/**: Axios HTTP客户端封装，统一处理请求和响应
- **chart-kit/**: 图表组件封装，基于ECharts提供统一的图表接口
- **ui-components/**: 通用UI组件库，提供可复用的界面组件

### web/ - 响应式 Web 前端
- **pages/**: 响应式页面入口，包含基金、合约、期权等主要页面
- **components/**: 页面组件，可复用的页面片段
- **assets/**: 静态资源，包括样式、图标、字体等
- **router/**: 路由配置，管理前端路由

### mobile/ - 移动端页面
- 保留原有的移动端HTML页面，逐步迁移为组件化结构

## 快速开始

### 本地运行

```bash
# 安装依赖
npm install

# 启动服务
npm start
```

服务将在 http://localhost:3000 上运行。

### 使用 PM2 管理服务

项目包含 PM2 配置文件 `ecosystem.config.js`，用于统一管理主服务和定时任务。

```bash
# 安装 PM2
npm install pm2 -g

# 启动所有服务
pm2 start ecosystem.config.js

# 保存配置（开机自启）
pm2 save

# 设置开机自启（按提示执行生成的命令）
pm2 startup
```

#### PM2 配置说明

PM2 配置包含以下应用：

1. `fund-server` - 基金服务，提供基金Web界面和API接口 (端口: 3001)
2. `fund-cron` - 基金净值更新定时任务
3. `contract-market` - 合约行情服务 (端口: 3002)
4. `option-market` - 期权行情服务 (端口: 3003)

所有服务都会自动重启并在系统启动时自动运行。

#### PM2 常用命令

```bash
pm2 list                           # 查看所有进程状态
pm2 logs                           # 查看所有应用日志
pm2 logs fund-server              # 查看基金服务日志
pm2 logs fund-cron                # 查看基金定时任务日志
pm2 logs contract-market          # 查看合约行情服务日志
pm2 logs option-market            # 查看期权行情服务日志
pm2 restart fund-server           # 重启基金服务
pm2 stop contract-market          # 停止合约行情服务
pm2 delete option-market          # 删除期权行情服务
pm2 monit                         # 实时监控资源占用
```

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
docker run -p 3000:3000 virtual-trading-platform
```

### Kubernetes 部署

项目包含完整的 Kubernetes 配置文件，位于 [k8s](k8s/) 目录中。

### 移动端独立部署

移动端客户端已正式发布 v1.0.0 版本，可通过以下地址访问：

**生产环境地址**: https://jiuzhougroup.vip

移动端客户端可以独立部署到生产环境并绑定域名 `jiuzhougroup.vip`：

1. 使用专用配置文件部署：
   ```bash
   npm run deploy-mobile
   ```

2. 在部署平台控制台中添加域名 `jiuzhougroup.vip`

详细部署说明请查看 [MOBILE_DEPLOYMENT_GUIDE.md](MOBILE_DEPLOYMENT_GUIDE.md)。

## 文档

- [版本变更日志](CHANGELOG.md)
- [部署指南](DEPLOYMENT_GUIDE.md)
- [移动端部署指南](MOBILE_DEPLOYMENT_GUIDE.md)
- [API 文档](docs/API.md)
- [用户使用指南](docs/USER_GUIDE.md)
- [v1.0 版本发布说明](docs/RELEASE_v1.0.md)

## 许可证

MIT