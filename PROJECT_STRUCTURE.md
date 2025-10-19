# 项目结构说明

## 概述
本项目是一个虚拟交易平台，包含三个核心系统：
1. 系统管理后台（PC端）
2. 电脑端用户界面（PC端）
3. 移动端用户界面（移动端）

所有系统都连接到同一个数据库，共享用户数据和交易数据。

## 目录结构

```
virtual-trading-platform/
├── config/                 # 配置文件
├── data/                   # 数据文件
├── docs/                   # 文档
├── public/                 # 静态文件
│   ├── admin-login.html    # 管理后台登录页面
│   ├── admin-panel.html    # 管理后台主页面
│   ├── client-dashboard.html # 客户端仪表板页面
│   ├── client-login.html   # 客户端登录页面
│   ├── mobile-login.html   # 移动端登录页面
│   ├── css/                # CSS样式文件
│   ├── js/                 # JavaScript文件
│   └── mobile/             # 移动端页面
│       ├── index.html      # 移动端首页
│       ├── market.html     # 移动端行情页
│       ├── trade.html      # 移动端交易页
│       └── profile.html    # 移动端个人页
├── scripts/                # 脚本文件
├── src/                    # 源代码
│   ├── app.js              # Express应用入口
│   ├── controllers/        # 控制器
│   ├── database/           # 数据库相关
│   ├── engine/             # 交易引擎
│   ├── middleware/         # 中间件
│   ├── models/             # 数据模型
│   ├── routes/             # 路由
│   └── utils/              # 工具函数
├── templates/              # 模板文件
├── tests/                  # 测试文件
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

## 数据库连接
所有三个系统都通过以下文件连接到MySQL数据库：
- `src/database/connection.js` - 数据库连接
- `src/database/init.js` - 数据库初始化
- `config/database.js` - 数据库配置

## 启动方式
```bash
npm start
```

## 访问地址
- 系统管理面板：http://localhost:3001/admin/panel
- 用户端仪表板：http://localhost:3001/client/dashboard
- 移动端客户端：http://localhost:3001/mobile

## 重要文档文件
- `README.md` - 项目自述文件
- `DEVELOPMENT_LOG.md` - 开发日志
- `PROJECT_DEVELOPMENT_PLAN.md` - 项目开发计划
- `TODO.md` - 待办任务列表
- `PROJECT_STRUCTURE.md` - 项目结构说明
- `DEPLOYMENT_GUIDE.md` - 部署指南
- `UPDATE_LOG.md` - 更新日志

## 最近更新
项目已于2025年10月19日完成清理和优化工作，删除了不相关的示例文件、测试脚本和调试文件，使项目结构更加清晰，便于维护和部署。2025年10月20日创建了待办任务列表，建立了任务跟踪机制。详细更新内容请参考 [UPDATE_LOG.md](UPDATE_LOG.md)。