# 项目结构说明

## 概述
本项目是一个虚拟交易平台，包含三个核心系统：
1. 系统管理后台（PC端）
2. 电脑端用户界面（PC端）
3. 移动端用户界面（移动端）

所有系统都连接到同一个Teable数据库，共享用户数据和交易数据。

## 目录结构

```
virtual-trading-platform/
├── apps/                   # 多服务入口
│   ├── fund-server/       # 私募基金服务
│   ├── contract-market/   # 合约交易服务
│   ├── option-market/     # 期权交易服务
│   └── cron-jobs/         # 定时任务服务
├── config/                 # 配置文件
├── data/                   # 数据文件
├── docs/                   # 文档
├── k8s/                    # Kubernetes 配置
├── mobile/                 # 移动端页面
│   ├── funds.html
│   ├── contract-market.html
│   └── option-market.html
├── packages/               # 可复用模块
│   ├── db-adapter/        # 数据库适配器
│   ├── api-client/        # API客户端封装
│   ├── chart-kit/         # 图表组件封装
│   └── ui-components/     # 通用UI组件库
├── public/                 # 静态文件
│   ├── admin-login.html    # 管理后台登录页面
│   ├── admin-panel.html    # 管理后台主页面
│   ├── client-dashboard.html # 客户端仪表板页面
│   ├── client-login.html   # 客户端登录页面
│   ├── mobile-login.html   # 移动端登录页面
│   ├── css/                # CSS样式文件
│   ├── js/                 # JavaScript文件
│   └── mobile/             # 移动端页面（已清理冗余文件）
├── scripts/                # 脚本文件
│   ├── cleanup.bat         # 清理脚本
│   └── cleanup.sh          # 清理脚本
├── src/                    # 后端源代码
│   ├── app.js              # Express应用入口
│   ├── controllers/        # 控制器
│   ├── database/           # 数据库相关
│   ├── engine/             # 交易引擎
│   ├── middleware/         # 中间件
│   ├── models/             # 数据模型
│   ├── modules/            # 功能模块
│   ├── routes/             # 路由
│   └── utils/              # 工具函数
├── templates/              # 模板文件
├── tests/                  # 测试文件
├── web/                    # 响应式 Web 前端 (React + Vite)
│   ├── src/                # 前端源代码
│   │   ├── components/     # React 组件
│   │   ├── pages/          # 页面组件 (已清理HTML文件)
│   │   ├── router/         # 路由配置
│   │   ├── App.tsx         # 根组件
│   │   └── main.tsx        # 入口文件
│   ├── index.html          # HTML 模板
│   ├── package.json        # 前端依赖配置
│   ├── vite.config.ts      # Vite 配置
│   ├── tailwind.config.js  # Tailwind CSS 配置
│   └── postcss.config.js   # PostCSS 配置
└── package.json            # 项目配置
```

## 三个核心系统

### 1. 系统管理后台（PC端）
- **访问地址**: http://localhost:3001/admin/panel
- **主要功能**: 
  - 用户管理
  - 系统配置
  - 数据监控
  - 交易审核
- **主要文件**:
  - `public/admin-login.html`
  - `public/admin-panel.html`
  - `src/controllers/adminController.js`
  - `src/routes/admin.js`

### 2. 电脑端用户界面（PC端）
- **访问地址**: http://localhost:3001/client/dashboard
- **主要功能**:
  - 用户注册/登录
  - 交易操作
  - 持仓管理
  - 历史记录查询
- **主要文件**:
  - `public/client-login.html`
  - `public/client-dashboard.html`
  - `src/controllers/userController.js`
  - `src/controllers/tradeController.js`

### 3. 移动端用户界面（移动端）
- **访问地址**: http://localhost:3001/mobile
- **主要功能**:
  - 简化版交易操作
  - 行情查看
  - 个人中心
- **主要文件**:
  - `public/mobile-login.html`
  - `public/mobile/index.html`
  - `public/mobile/market.html`
  - `public/mobile/trade.html`
  - `public/mobile/profile.html`

## 新增Web前端系统

### 4. 响应式Web前端（React + Vite）
- **访问地址**: http://localhost:5173
- **主要功能**:
  - 响应式设计，适配PC和移动设备
  - 现代化的用户界面
  - 实时行情展示
  - 交易操作界面
  - 个人中心
- **技术栈**:
  - React 18
  - Vite 5
  - Tailwind CSS 4
  - React Router 6
- **主要目录**:
  - `web/src/components/` - 可复用的React组件
  - `web/src/pages/` - 页面级React组件
  - `web/src/router/` - 路由配置
  - `web/src/App.tsx` - 根组件
  - `web/src/main.tsx` - 应用入口文件

## 数据库连接
所有系统都通过以下文件连接到Teable数据库：
- `src/database/dbAdapter.js` - 数据库适配器
- `src/database/teableConnection.js` - Teable连接实现
- `config/teableConfig.js` - Teable配置

## 启动方式
```bash
# 启动后端服务
npm start

# 启动前端开发服务器（新窗口）
cd web && npm install && npm run dev
```

## 访问地址
- 系统管理面板：http://localhost:3001/admin/panel
- 用户端仪表板：http://localhost:3001/client/dashboard
- 移动端客户端：http://localhost:3001/mobile
- 数据仪表盘：http://localhost:3001/dashboard.html
- 工作流管理：http://localhost:3001/workflow.html
- 响应式Web前端：http://localhost:5173

## 重要文档文件
- `README.md` - 项目自述文件
- `DEVELOPMENT_LOG.md` - 开发日志
- `PROJECT_DEVELOPMENT_PLAN.md` - 项目开发计划
- `TODO.md` - 待办任务列表
- `PROJECT_STRUCTURE.md` - 项目结构说明
- `DEPLOYMENT_GUIDE.md` - 部署指南
- `USER_GUIDE.md` - 用户指南
- `docs/API.md` - API文档
- `CHANGELOG.md` - 变更日志
- `UPDATE_LOG.md` - 更新日志

## 最近更新
项目已于2025年10月19日完成清理和优化工作，删除了不相关的示例文件、测试脚本和调试文件，使项目结构更加清晰，便于维护和部署。2025年10月20日创建了待办任务列表，建立了任务跟踪机制。2025年10月23日新增了基于React + Vite的现代化响应式Web前端系统。2025年10月24日进行了代码清理和优化，统一了依赖版本，修复了路由跳转问题。详细更新内容请参考 [UPDATE_LOG.md](UPDATE_LOG.md)。