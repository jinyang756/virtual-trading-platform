# 完整API接口文档

## 基础说明

所有API接口都以 `/api` 为前缀，例如：`/api/users/register`

## 用户管理接口

### 注册用户
- **URL**: `/api/users/register`
- **方法**: `POST`
- **描述**: 注册新用户
- **请求体**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **响应**:
  ```json
  {
    "message": "用户注册成功",
    "userId": "string"
  }
  ```

### 用户登录
- **URL**: `/api/users/login`
- **方法**: `POST`
- **描述**: 用户登录
- **请求体**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **响应**:
  ```json
  {
    "message": "登录成功",
    "userId": "string"
  }
  ```

### 获取用户信息
- **URL**: `/api/users/:id`
- **方法**: `GET`
- **描述**: 获取指定用户信息
- **参数**:
  - `id`: 用户ID
- **响应**:
  ```json
  {
    "id": "string",
    "username": "string",
    "email": "string",
    "balance": "number",
    "createdAt": "date"
  }
  ```

## 传统交易接口

### 创建订单
- **URL**: `/api/trade/order`
- **方法**: `POST`
- **描述**: 创建新订单
- **请求体**:
  ```json
  {
    "userId": "string",
    "asset": "string",
    "type": "buy|sell",
    "quantity": "number",
    "price": "number"
  }
  ```
- **响应**:
  ```json
  {
    "message": "订单创建成功",
    "orderId": "string",
    "transaction": "object"
  }
  ```

### 获取订单状态
- **URL**: `/api/trade/order/:id`
- **方法**: `GET`
- **描述**: 获取订单状态
- **参数**:
  - `id`: 订单ID
- **响应**:
  ```json
  {
    "id": "string",
    "userId": "string",
    "asset": "string",
    "type": "buy|sell",
    "quantity": "number",
    "price": "number",
    "status": "string",
    "timestamp": "date"
  }
  ```

### 取消订单
- **URL**: `/api/trade/order/:id`
- **方法**: `DELETE`
- **描述**: 取消订单
- **参数**:
  - `id`: 订单ID
- **响应**:
  ```json
  {
    "message": "订单取消成功"
  }
  ```

### 获取用户持仓
- **URL**: `/api/trade/positions/:userId`
- **方法**: `GET`
- **描述**: 获取用户持仓
- **参数**:
  - `userId`: 用户ID
- **响应**:
  ```json
  [
    {
      "id": "string",
      "userId": "string",
      "asset": "string",
      "quantity": "number",
      "avgPrice": "number",
      "createdAt": "date"
    }
  ]
  ```

### 获取用户交易历史
- **URL**: `/api/trade/history/:userId`
- **方法**: `GET`
- **描述**: 获取用户交易历史
- **参数**:
  - `userId`: 用户ID
- **查询参数**:
  - `limit`: 限制返回记录数（可选）
- **响应**:
  ```json
  [
    {
      "id": "string",
      "userId": "string",
      "asset": "string",
      "type": "buy|sell",
      "quantity": "number",
      "price": "number",
      "timestamp": "date"
    }
  ]
  ```

## 合约交易接口

### 获取合约市场数据
- **URL**: `/api/trade/contracts/market/:symbolId`
- **方法**: `GET`
- **描述**: 获取指定合约的市场数据
- **参数**:
  - `symbolId`: 合约代码 (如 SH_FUTURE, HK_FUTURE)
- **响应**:
  ```json
  {
    "symbol": "string",
    "name": "string",
    "price": "number",
    "change": "number",
    "leverage": "number",
    "timestamp": "date"
  }
  ```

### 获取所有合约市场数据
- **URL**: `/api/trade/contracts/market`
- **方法**: `GET`
- **描述**: 获取所有合约的市场数据
- **响应**:
  ```json
  [
    {
      "symbol": "string",
      "name": "string",
      "price": "number",
      "change": "number",
      "leverage": "number",
      "timestamp": "date"
    }
  ]
  ```

### 下合约订单
- **URL**: `/api/trade/contracts/order`
- **方法**: `POST`
- **描述**: 下合约订单
- **请求体**:
  ```json
  {
    "userId": "string",
    "symbolId": "string",
    "direction": "buy|sell",
    "amount": "number",
    "leverage": "number"
  }
  ```
- **响应**:
  ```json
  {
    "success": "boolean",
    "order_id": "string",
    "message": "string",
    "margin_used": "number",
    "current_price": "number"
  }
  ```

### 获取用户合约持仓
- **URL**: `/api/trade/contracts/positions/:userId`
- **方法**: `GET`
- **描述**: 获取用户合约持仓
- **参数**:
  - `userId`: 用户ID
- **响应**:
  ```json
  [
    {
      "user_id": "string",
      "symbol": "string",
      "direction": "string",
      "total_amount": "number",
      "avg_price": "number",
      "total_value": "number",
      "current_price": "number",
      "floating_profit": "number",
      "profit_percent": "number"
    }
  ]
  ```

### 获取合约订单历史
- **URL**: `/api/trade/contracts/history/:userId`
- **方法**: `GET`
- **描述**: 获取用户合约订单历史
- **参数**:
  - `userId`: 用户ID
- **查询参数**:
  - `limit`: 限制返回记录数（可选）
- **响应**:
  ```json
  [
    {
      "order_id": "string",
      "user_id": "string",
      "symbol": "string",
      "direction": "string",
      "amount": "number",
      "price": "number",
      "leverage": "number",
      "margin": "number",
      "order_time": "date",
      "status": "string"
    }
  ]
  ```

### 获取合约价格历史
- **URL**: `/api/trade/contracts/price/:symbolId`
- **方法**: `GET`
- **描述**: 获取合约价格历史
- **参数**:
  - `symbolId`: 合约代码
- **查询参数**:
  - `startDate`: 开始日期 (可选, 格式: YYYY-MM-DD)
  - `endDate`: 结束日期 (可选, 格式: YYYY-MM-DD)
- **响应**:
  ```json
  [
    {
      "timestamp": "date",
      "price": "number"
    }
  ]
  ```

### 计算合约投资组合价值
- **URL**: `/api/trade/contracts/portfolio/:userId`
- **方法**: `GET`
- **描述**: 计算用户合约投资组合价值
- **参数**:
  - `userId`: 用户ID
- **响应**:
  ```json
  {
    "total_value": "number",
    "total_profit": "number",
    "position_count": "number"
  }
  ```

## 二元期权交易接口

### 获取二元期权策略
- **URL**: `/api/trade/binary/strategies`
- **方法**: `GET`
- **描述**: 获取所有二元期权策略
- **响应**:
  ```json
  [
    {
      "strategy_id": "string",
      "name": "string",
      "duration": "number",
      "payout": "number",
      "max_investment": "number"
    }
  ]
  ```

### 获取当前市场趋势
- **URL**: `/api/trade/binary/trend`
- **方法**: `GET`
- **描述**: 获取当前市场趋势
- **响应**:
  ```json
  {
    "trend": "string",
    "trend_text": "string",
    "confidence": "number",
    "timestamp": "date"
  }
  ```

### 下二元期权订单
- **URL**: `/api/trade/binary/order`
- **方法**: `POST`
- **描述**: 下二元期权订单
- **请求体**:
  ```json
  {
    "userId": "string",
    "strategyId": "string",
    "direction": "call|put",
    "investment": "number"
  }
  ```
- **响应**:
  ```json
  {
    "success": "boolean",
    "order_id": "string",
    "message": "string",
    "investment": "number",
    "potential_payout": "number",
    "expire_time": "date",
    "countdown": "number"
  }
  ```

### 获取用户活跃订单
- **URL**: `/api/trade/binary/active/:userId`
- **方法**: `GET`
- **描述**: 获取用户活跃的二元期权订单
- **参数**:
  - `userId`: 用户ID
- **响应**:
  ```json
  [
    {
      "order_id": "string",
      "user_id": "string",
      "strategy_id": "string",
      "strategy_name": "string",
      "direction": "string",
      "investment": "number",
      "entry_price": "number",
      "potential_payout": "number",
      "order_time": "date",
      "expire_time": "date",
      "status": "string",
      "remaining_seconds": "number"
    }
  ]
  ```

### 获取二元期权订单历史
- **URL**: `/api/trade/binary/history/:userId`
- **方法**: `GET`
- **描述**: 获取用户二元期权订单历史
- **参数**:
  - `userId`: 用户ID
- **查询参数**:
  - `limit`: 限制返回记录数（可选）
- **响应**:
  ```json
  [
    {
      "order_id": "string",
      "user_id": "string",
      "strategy_id": "string",
      "strategy_name": "string",
      "direction": "string",
      "investment": "number",
      "entry_price": "number",
      "potential_payout": "number",
      "order_time": "date",
      "expire_time": "date",
      "status": "string",
      "settle_price": "number",
      "payout": "number",
      "profit": "number",
      "result": "string",
      "settle_time": "date"
    }
  ]
  ```

### 获取二元期权统计
- **URL**: `/api/trade/binary/stats/:userId`
- **方法**: `GET`
- **描述**: 获取用户二元期权交易统计
- **参数**:
  - `userId`: 用户ID
- **响应**:
  ```json
  {
    "total_orders": "number",
    "win_orders": "number",
    "lose_orders": "number",
    "win_rate": "number",
    "total_investment": "number",
    "total_payout": "number",
    "net_profit": "number"
  }
  ```

### 获取二元期权历史统计
- **URL**: `/api/trade/binary/stats/history`
- **方法**: `GET`
- **描述**: 获取二元期权历史统计
- **查询参数**:
  - `startDate`: 开始日期 (可选, 格式: YYYY-MM-DD)
  - `endDate`: 结束日期 (可选, 格式: YYYY-MM-DD)
- **响应**:
  ```json
  {
    "YYYY-MM-DD": {
      "total_orders": "number",
      "win_orders": "number",
      "lose_orders": "number",
      "win_rate": "number",
      "total_investment": "number",
      "total_payout": "number",
      "net_profit": "number"
    }
  }
  ```

## 私募基金交易接口

### 获取基金信息
- **URL**: `/api/trade/funds/:fundId`
- **方法**: `GET`
- **描述**: 获取指定基金信息
- **参数**:
  - `fundId`: 基金代码
- **响应**:
  ```json
  {
    "fund_id": "string",
    "name": "string",
    "fund_manager": "string",
    "risk_level": "string",
    "nav": "number",
    "min_investment": "number",
    "management_fee": "number",
    "performance_fee": "number",
    "total_return": "number",
    "update_time": "date"
  }
  ```

### 获取所有基金信息
- **URL**: `/api/trade/funds`
- **方法**: `GET`
- **描述**: 获取所有基金信息
- **响应**:
  ```json
  [
    {
      "fund_id": "string",
      "name": "string",
      "fund_manager": "string",
      "risk_level": "string",
      "nav": "number",
      "min_investment": "number",
      "management_fee": "number",
      "performance_fee": "number",
      "total_return": "number",
      "update_time": "date"
    }
  ]
  ```

### 认购基金
- **URL**: `/api/trade/funds/subscribe`
- **方法**: `POST`
- **描述**: 认购基金
- **请求体**:
  ```json
  {
    "userId": "string",
    "fundId": "string",
    "amount": "number"
  }
  ```
- **响应**:
  ```json
  {
    "success": "boolean",
    "transaction_id": "string",
    "message": "string",
    "amount": "number",
    "shares": "number",
    "nav": "number",
    "fee": "number"
  }
  ```

### 赎回基金
- **URL**: `/api/trade/funds/redeem`
- **方法**: `POST`
- **描述**: 赎回基金
- **请求体**:
  ```json
  {
    "userId": "string",
    "fundId": "string",
    "shares": "number"
  }
  ```
- **响应**:
  ```json
  {
    "success": "boolean",
    "transaction_id": "string",
    "message": "string",
    "shares": "number",
    "amount": "number",
    "net_amount": "number",
    "fee": "number"
  }
  ```

### 获取用户基金持仓
- **URL**: `/api/trade/funds/positions/:userId`
- **方法**: `GET`
- **描述**: 获取用户基金持仓
- **参数**:
  - `userId`: 用户ID
- **响应**:
  ```json
  [
    {
      "user_id": "string",
      "fund_id": "string",
      "shares": "number",
      "total_cost": "number",
      "avg_cost": "number",
      "fund_name": "string",
      "current_nav": "number",
      "market_value": "number",
      "floating_profit": "number",
      "profit_percent": "number"
    }
  ]
  ```

### 获取基金交易历史
- **URL**: `/api/trade/funds/history/:userId`
- **方法**: `GET`
- **描述**: 获取用户基金交易历史
- **参数**:
  - `userId`: 用户ID
- **查询参数**:
  - `limit`: 限制返回记录数（可选）
- **响应**:
  ```json
  [
    {
      "transaction_id": "string",
      "user_id": "string",
      "fund_id": "string",
      "type": "string",
      "amount": "number",
      "nav": "number",
      "shares": "number",
      "fee": "number",
      "transaction_time": "date"
    }
  ]
  ```

### 获取基金净值历史
- **URL**: `/api/trade/funds/nav/:fundId`
- **方法**: `GET`
- **描述**: 获取基金净值历史
- **参数**:
  - `fundId`: 基金代码
- **查询参数**:
  - `startDate`: 开始日期 (可选, 格式: YYYY-MM-DD)
  - `endDate`: 结束日期 (可选, 格式: YYYY-MM-DD)
- **响应**:
  ```json
  [
    {
      "date": "string",
      "nav": "number",
      "change": "number"
    }
  ]
  ```

### 计算基金表现
- **URL**: `/api/trade/funds/performance/:fundId`
- **方法**: `GET`
- **描述**: 计算基金表现
- **参数**:
  - `fundId`: 基金代码
- **响应**:
  ```json
  {
    "daily_return": "number",
    "weekly_return": "number",
    "monthly_return": "number",
    "total_return": "number",
    "current_nav": "number",
    "initial_nav": "number"
  }
  ```

## 综合接口

### 获取所有市场数据
- **URL**: `/api/trade/market/all`
- **方法**: `GET`
- **描述**: 获取所有市场数据（合约和基金）
- **响应**:
  ```json
  {
    "contracts": [...],
    "funds": [...]
  }
  ```

### 获取用户综合投资组合
- **URL**: `/api/trade/portfolio/:userId`
- **方法**: `GET`
- **描述**: 获取用户综合投资组合（合约、基金、二元期权）
- **参数**:
  - `userId`: 用户ID
- **响应**:
  ```json
  {
    "contracts": {...},
    "funds": [...],
    "binary": {...}
  }
  ```

### 获取用户所有持仓
- **URL**: `/api/trade/positions/all/:userId`
- **方法**: `GET`
- **描述**: 获取用户所有持仓（合约和基金）
- **参数**:
  - `userId`: 用户ID
- **响应**:
  ```json
  {
    "contracts": [...],
    "funds": [...]
  }
  ```

### 获取用户所有订单历史
- **URL**: `/api/trade/history/all/:userId`
- **方法**: `GET`
- **描述**: 获取用户所有订单历史（合约和二元期权）
- **参数**:
  - `userId`: 用户ID
- **查询参数**:
  - `limit`: 限制返回记录数（可选）
- **响应**:
  ```json
  {
    "contracts": [...],
    "binary": [...]
  }
  ```