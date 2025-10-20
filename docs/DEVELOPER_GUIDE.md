# 开发者指南

## 项目结构

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

## 技术栈

### 后端技术栈
- Node.js + Express.js 框架
- Teable 数据库（基于API的NoSQL数据库服务）
- JWT 认证
- RESTful API 设计

### 前端技术栈
- HTML5 + CSS3 + JavaScript
- EJS 模板引擎
- Chart.js 图表库
- 响应式设计

## 数据库设计

项目使用Teable作为数据库，这是一个基于API的NoSQL数据库服务。需要在Teable中创建以下表：

1. users: 用户表
2. transactions: 交易记录表
3. positions: 持仓表
4. contractOrders: 合约订单表
5. binaryOrders: 二元期权订单表
6. fundTransactions: 基金交易表
7. fundPositions: 基金持仓表
8. workflows: 工作流表
9. workflowTasks: 工作流任务表

## 核心模块

### 用户管理系统
- 用户注册、登录、认证
- JWT Token认证机制
- 角色权限控制（管理员、普通用户、访客）

### 交易引擎系统
- 合约交易引擎：支持多种合约品种，带杠杆和保证金管理
- 二元期权引擎：支持多种期权策略和固定收益
- 私募基金引擎：支持基金认购、赎回和净值管理

### 数据库适配器
项目使用数据库适配器模式来支持Teable数据库：

```javascript
const dbAdapter = require('../database/dbAdapter');

// 查询数据
await dbAdapter.executeQuery({
  table: 'users',
  operation: 'select',
  params: { filter: "id = 'user_id'" }
});

// 插入数据
await dbAdapter.executeQuery({
  table: 'users',
  operation: 'insert',
  data: { username: 'test', email: 'test@example.com' }
});
```

### 工作流系统
工作流系统允许创建和管理自动化任务：

1. 创建工作流
2. 启动工作流
3. 监控工作流状态
4. 取消工作流

### 仪表盘系统
仪表盘系统提供实时数据可视化：

1. 交易统计数据
2. 资产分布图表
3. 交易趋势分析
4. 用户排名展示

## API设计

API遵循RESTful设计原则，使用JWT Token进行认证。详细API文档请参考 [API文档](API.md)。

## 开发环境搭建

### 1. 安装Node.js
确保安装了Node.js 14+版本。

### 2. 克隆项目
```bash
git clone <项目仓库地址>
cd virtual-trading-platform
```

### 3. 安装依赖
```bash
npm install
```

### 4. 配置数据库
在Teable中创建数据库和表，并配置 `config/teableConfig.js` 文件。

### 5. 启动开发服务器
```bash
npm start
```

## 代码规范

### JavaScript代码规范
- 使用ES6语法
- 遵循Airbnb JavaScript编码规范
- 使用async/await处理异步操作
- 使用try/catch处理错误

### 命名规范
- 文件名：小写字母，使用连字符分隔
- 变量名：驼峰命名法
- 类名：帕斯卡命名法
- 常量：全大写字母，使用下划线分隔

### 注释规范
- 函数注释：使用JSDoc格式
- 行内注释：使用//开头
- 复杂逻辑：添加详细注释说明

## 测试

### 单元测试
使用Jest进行单元测试：

```bash
npm test
```

### 集成测试
集成测试验证各模块之间的交互：

```bash
npm run test:integration
```

## 部署

详细部署指南请参考 [部署指南](DEPLOYMENT.md)。

## 贡献指南

### 提交代码
1. Fork项目
2. 创建功能分支
3. 提交更改
4. 发起Pull Request

### 代码审查
所有代码提交都需要经过代码审查。

### 问题报告
使用GitHub Issues报告问题。

## 常见问题

### 数据库连接问题
确保Teable配置正确，API Token有足够权限。

### 启动失败
检查端口是否被占用，依赖是否安装完整。

### API调用失败
检查JWT Token是否有效，请求参数是否正确。