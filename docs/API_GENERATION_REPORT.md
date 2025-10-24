# API 文档生成报告

生成时间: 2025-10-24T09:38:28.730Z

## 统计信息

- API端点数量: 12
- Schema定义数量: 7

## API端点列表

### /api/users/login

- **POST** 用户登录

### /api/users/register

- **POST** 用户注册

### /api/users/profile

- **GET** 获取用户信息
- **PUT** 更新用户信息

### /api/fund/

- **GET** 获取所有基金信息

### /api/fund/{fundId}

- **GET** 获取特定基金信息

### /api/fund/{fundId}/nav-history

- **GET** 获取基金净值历史

### /api/trade/contract/order

- **POST** 下合约订单

### /api/trade/contract/positions

- **GET** 获取用户持仓

### /api/workflow

- **POST** 创建工作流
- **GET** 获取工作流列表

### /api/workflow/{id}

- **GET** 获取工作流详情

### /api/workflow/{id}/start

- **POST** 启动工作流

### /api/workflow/{id}/cancel

- **POST** 取消工作流

## Schema定义

- ApiResponse
- User
- Fund
- Trade
- Position
- Workflow
- Task
