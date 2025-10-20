# API文档

## 目录
1. [认证API](#认证api)
2. [用户管理API](#用户管理api)
3. [交易API](#交易api)
4. [市场数据API](#市场数据api)
5. [社交功能API](#社交功能api)
6. [数据分析API](#数据分析api)
7. [系统管理API](#系统管理api)
8. [错误处理](#错误处理)

## 认证API

### 用户登录
```
POST /api/users/login
```

**请求参数:**
```json
{
  "username": "string",
  "password": "string"
}
```

**响应:**
```json
{
  "success": true,
  "message": "登录成功",
  "token": "jwt_token",
  "userId": "user_id",
  "username": "username"
}
```

### 用户注册
```
POST /api/users/register
```

**请求参数:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**响应:**
```json
{
  "success": true,
  "message": "注册成功",
  "userId": "user_id"
}
```

## 用户管理API

### 获取用户信息
```
GET /api/users/profile
```

**响应:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "username": "username",
    "email": "email",
    "balance": 100000,
    "role": "user"
  }
}
```

### 更新用户信息
```
PUT /api/users/profile
```

**请求参数:**
```json
{
  "username": "string",
  "email": "string"
}
```

**响应:**
```json
{
  "success": true,
  "message": "更新成功",
  "data": {
    "id": "user_id",
    "username": "username",
    "email": "email"
  }
}
```

## 交易API

### 合约交易

#### 下合约订单
```
POST /api/trade/contract/order
```

**请求参数:**
```json
{
  "symbol": "SH_FUTURE",
  "quantity": 1,
  "leverage": 10,
  "side": "buy", // or "sell"
  "stopLoss": 800,
  "takeProfit": 1200
}
```

**响应:**
```json
{
  "success": true,
  "message": "订单创建成功",
  "data": {
    "orderId": "order_id",
    "symbol": "SH_FUTURE",
    "quantity": 1,
    "leverage": 10,
    "side": "buy",
    "price": 1000,
    "timestamp": "2025-10-20T10:00:00Z"
  }
}
```

#### 获取用户持仓
```
GET /api/trade/contract/positions
```

**响应:**
```json
{
  "success": true,
  "data": [
    {
      "id": "position_id",
      "symbol": "SH_FUTURE",
      "quantity": 1,
      "leverage": 10,
      "side": "buy",
      "entryPrice": 1000,
      "currentPrice": 1050,
      "pnl": 50,
      "timestamp": "2025-10-20T10:00:00Z"
    }
  ]
}
```

### 二元期权交易

#### 下期权订单
```
POST /api/trade/binary/order
```

**请求参数:**
```json
{
  "symbol": "BTCUSD",
  "investment": 100,
  "direction": "call", // or "put"
  "duration": 5, // 分钟
  "strategy": "classic"
}
```

**响应:**
```json
{
  "success": true,
  "message": "期权订单创建成功",
  "data": {
    "orderId": "order_id",
    "symbol": "BTCUSD",
    "investment": 100,
    "direction": "call",
    "duration": 5,
    "entryPrice": 50000,
    "expiryTime": "2025-10-20T10:05:00Z"
  }
}
```

### 私募基金交易

#### 认购基金
```
POST /api/trade/fund/subscribe
```

**请求参数:**
```json
{
  "fundId": "fund_id",
  "amount": 1000
}
```

**响应:**
```json
{
  "success": true,
  "message": "基金认购成功",
  "data": {
    "transactionId": "transaction_id",
    "fundId": "fund_id",
    "amount": 1000,
    "nav": 1.2,
    "shares": 833.33,
    "timestamp": "2025-10-20T10:00:00Z"
  }
}
```

## 市场数据API

### 获取所有市场数据
```
GET /api/market/data
```

**响应:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "SH_FUTURE",
      "name": "聚财基金上海合约",
      "price": 1050,
      "change": 50,
      "changePercent": 5,
      "leverage": 100,
      "timestamp": "2025-10-20T10:00:00Z"
    }
  ]
}
```

### 获取历史数据
```
GET /api/market/history?symbol=SH_FUTURE&days=30
```

**响应:**
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2025-10-20T09:00:00Z",
      "price": 1040,
      "volume": 1000
    }
  ]
}
```

## 社交功能API

### 关注用户
```
POST /api/social/follow
```

**请求参数:**
```json
{
  "targetUserId": "user_id"
}
```

**响应:**
```json
{
  "success": true,
  "message": "关注成功"
}
```

### 分享交易
```
POST /api/social/share
```

**请求参数:**
```json
{
  "tradeId": "trade_id",
  "content": "这是一笔不错的交易"
}
```

**响应:**
```json
{
  "success": true,
  "message": "分享成功",
  "data": {
    "shareId": "share_id"
  }
}
```

### 获取社区动态
```
GET /api/social/feed?page=1&limit=20
```

**响应:**
```json
{
  "success": true,
  "data": {
    "shares": [
      {
        "id": "share_id",
        "userId": "user_id",
        "username": "username",
        "tradeId": "trade_id",
        "content": "这是一笔不错的交易",
        "likes": 10,
        "comments": 5,
        "timestamp": "2025-10-20T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

## 数据分析API

### 获取交易统计
```
GET /api/analysis/trade-stats
```

**响应:**
```json
{
  "success": true,
  "data": {
    "totalTrades": 100,
    "winRate": 0.65,
    "profitFactor": 1.8,
    "totalProfit": 5000,
    "maxDrawdown": 1000
  }
}
```

### 获取投资组合分析
```
GET /api/analysis/portfolio
```

**响应:**
```json
{
  "success": true,
  "data": {
    "totalValue": 150000,
    "positions": [
      {
        "symbol": "SH_FUTURE",
        "value": 100000,
        "allocation": 0.67
      }
    ],
    "cash": 50000
  }
}
```

## 系统管理API

### 获取系统状态
```
GET /api/admin/status
```

**响应:**
```json
{
  "success": true,
  "data": {
    "uptime": 3600,
    "memoryUsage": 128,
    "cpuUsage": 45,
    "activeUsers": 100,
    "totalUsers": 1000
  }
}
```

### 获取系统配置
```
GET /api/admin/config
```

**响应:**
```json
{
  "success": true,
  "data": {
    "maintenanceMode": false,
    "maxUsers": 10000,
    "maxPositions": 100
  }
}
```

## 错误处理

### 错误响应格式
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

### 常见错误码
- `VALIDATION_ERROR`: 参数验证失败
- `UNAUTHORIZED`: 未授权访问
- `FORBIDDEN`: 权限不足
- `NOT_FOUND`: 资源不存在
- `INTERNAL_ERROR`: 服务器内部错误
- `BUSINESS_ERROR`: 业务逻辑错误

### HTTP状态码
- `200`: 请求成功
- `400`: 请求参数错误
- `401`: 未认证
- `403`: 权限不足
- `404`: 资源不存在
- `500`: 服务器内部错误