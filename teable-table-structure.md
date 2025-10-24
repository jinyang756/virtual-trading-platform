# Teable表结构定义

## 1. users 表 - 用户信息表
字段：
- id (主键)
- username (用户名)
- email (邮箱)
- password (密码)
- role (角色)
- created_at (创建时间)
- updated_at (更新时间)

## 2. roles 表 - 角色信息表
字段：
- id (主键)
- name (角色名称)
- description (描述)
- permissions (权限列表)
- created_at (创建时间)
- updated_at (更新时间)

## 3. permissions 表 - 权限信息表
字段：
- id (主键)
- name (权限名称)
- description (描述)
- resource (资源)
- action (操作)
- created_at (创建时间)
- updated_at (更新时间)

## 4. transactions 表 - 交易记录表
字段：
- id (主键)
- user_id (用户ID)
- type (交易类型: 买入/卖出)
- symbol (交易标的)
- quantity (数量)
- price (价格)
- amount (金额)
- fee (手续费)
- status (状态)
- created_at (创建时间)
- updated_at (更新时间)

## 5. positions 表 - 持仓记录表
字段：
- id (主键)
- user_id (用户ID)
- symbol (交易标的)
- quantity (持仓数量)
- average_price (平均成本)
- current_price (当前价格)
- market_value (市值)
- profit_loss (盈亏)
- created_at (创建时间)
- updated_at (更新时间)

## 6. contractOrders 表 - 合约订单表
字段：
- id (主键)
- user_id (用户ID)
- symbol (交易标的)
- type (订单类型)
- direction (方向)
- quantity (数量)
- price (价格)
- leverage (杠杆)
- margin (保证金)
- status (状态)
- created_at (创建时间)
- updated_at (更新时间)

## 7. binaryOrders 表 - 二元期权订单表
字段：
- id (主键)
- user_id (用户ID)
- symbol (交易标的)
- investment (投资金额)
- payout (预期收益)
- expiry_time (到期时间)
- direction (方向)
- status (状态)
- created_at (创建时间)
- updated_at (更新时间)

## 8. fundTransactions 表 - 基金交易记录表
字段：
- id (主键)
- user_id (用户ID)
- fund_id (基金ID)
- type (交易类型: 申购/赎回)
- amount (金额)
- shares (份额)
- nav (净值)
- fee (手续费)
- status (状态)
- created_at (创建时间)
- updated_at (更新时间)

## 9. fundPositions 表 - 基金持仓表
字段：
- id (主键)
- user_id (用户ID)
- fund_id (基金ID)
- shares (份额)
- average_nav (平均净值)
- current_nav (当前净值)
- market_value (市值)
- profit_loss (盈亏)
- created_at (创建时间)
- updated_at (更新时间)

## 10. workflows 表 - 工作流表
字段：
- id (主键)
- name (工作流名称)
- description (描述)
- status (状态)
- created_at (创建时间)
- updated_at (更新时间)

## 11. workflowTasks 表 - 工作流任务表
字段：
- id (主键)
- workflow_id (工作流ID)
- name (任务名称)
- description (描述)
- assignee (负责人)
- status (状态)
- created_at (创建时间)
- updated_at (更新时间)

## 12. logs 表 - 日志表
字段：
- id (主键)
- user_id (用户ID)
- action (操作)
- resource (资源)
- details (详情)
- ip_address (IP地址)
- user_agent (用户代理)
- created_at (创建时间)