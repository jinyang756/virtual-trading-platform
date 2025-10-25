# 权限系统设计与使用指南

## 🎯 系统概述

本权限系统基于RBAC（Role-Based Access Control）模型设计，支持角色管理、权限分配和访问控制，适用于虚拟交易平台的权限管理需求。

## 🧩 系统架构

### 核心组件

1. **角色管理（Roles）**
   - 定义系统中的用户角色
   - 支持角色继承和组合

2. **权限管理（Permissions）**
   - 定义系统中的操作权限
   - 支持细粒度权限控制

3. **角色权限映射（Role-Permissions）**
   - 定义角色与权限的关联关系
   - 支持多对多关系

4. **用户角色映射（User-Roles）**
   - 定义用户与角色的关联关系
   - 支持用户多角色

### 数据模型

```javascript
// 角色表 (roles)
{
  id: "admin",           // 角色ID
  name: "管理员",         // 角色名称
  description: "系统全权管理" // 角色描述
}

// 权限表 (permissions)
{
  id: "view_fund",       // 权限ID
  name: "查看基金",       // 权限名称
  action: "GET /api/fund" // 权限对应的操作
}

// 角色权限映射表 (role_permissions)
{
  role_id: "admin",      // 角色ID
  permission_id: "view_fund" // 权限ID
}

// 用户角色映射表 (user_roles)
{
  user_id: "user123",    // 用户ID
  role_id: "admin"       // 角色ID
}
```

## 🚀 快速开始

### 1. 初始化权限系统

```bash
# 运行权限系统初始化脚本
node scripts/init-permissions.js
```

该脚本将自动创建：
- 3个默认角色（管理员、运营人员、投资者）
- 10个常用权限
- 角色与权限的映射关系

### 2. 后端权限校验

在Express路由中使用权限中间件：

```javascript
const { checkPermission, checkRole } = require('../middleware/permissionMiddleware');

// 基于权限的访问控制
app.get('/api/fund', 
  checkPermission('view_fund'), 
  (req, res) => {
    // 处理查看基金请求
  }
);

// 基于角色的访问控制
app.post('/api/user', 
  checkRole('admin'), 
  (req, res) => {
    // 处理管理用户请求
  }
);
```

### 3. 前端权限控制

在React组件中使用权限组件：

```jsx
import { WithPermission, PermissionButton } from '../components/WithPermission';

// 基于权限显示内容
<WithPermission permission="manage_users">
  <button>管理用户</button>
</WithPermission>

// 权限按钮组件
<PermissionButton 
  permission="edit_fund"
  onClick={handleEditFund}
>
  编辑基金
</PermissionButton>
```

### 4. 权限变更联动

权限变更后自动执行以下任务：

1. **同步前端权限状态** - 更新前端权限缓存
2. **更新权限文档** - 自动记录变更历史
3. **推送飞书通知** - 实时通知相关人员
4. **写入权限变更日志** - 持久化变更记录

使用权限变更联动脚本：

```bash
node scripts/permission-change-sync.js
```

## 🔧 核心功能

### 1. 角色管理

#### 默认角色

| 角色ID | 角色名称 | 描述 |
|--------|----------|------|
| admin | 管理员 | 系统全权管理 |
| operator | 运营人员 | 查看数据与报表 |
| investor | 投资者 | 查看基金信息 |

### 2. 权限管理

#### 默认权限

| 权限ID | 权限名称 | 操作 |
|--------|----------|------|
| view_fund | 查看基金 | GET /api/fund |
| edit_fund | 编辑基金 | PUT /api/fund/:id |
| export_report | 导出报表 | GET /api/report/export |
| manage_users | 管理用户 | POST /api/user |
| view_contract | 查看合约 | GET /api/contract |
| trade_contract | 交易合约 | POST /api/contract/order |
| view_option | 查看期权 | GET /api/option |
| trade_option | 交易期权 | POST /api/option/order |
| view_portfolio | 查看投资组合 | GET /api/portfolio |
| manage_portfolio | 管理投资组合 | POST /api/portfolio |

### 3. 权限映射

#### 管理员权限
- view_fund, edit_fund, export_report, manage_users
- view_contract, trade_contract
- view_option, trade_option
- view_portfolio, manage_portfolio

#### 运营人员权限
- view_fund, export_report
- view_contract, view_option
- view_portfolio

#### 投资者权限
- view_fund, view_contract, view_option, view_portfolio

## 📦 API接口

### 权限校验中间件

#### checkPermission(permission)
基于权限的访问控制中间件

```javascript
// 用法示例
app.get('/api/protected', checkPermission('view_fund'), (req, res) => {
  res.json({ message: '有权访问' });
});
```

#### checkRole(roles)
基于角色的访问控制中间件

```javascript
// 用法示例
app.post('/api/admin', checkRole('admin'), (req, res) => {
  res.json({ message: '管理员操作' });
});

// 多角色校验
app.post('/api/manager', checkRole(['admin', 'operator']), (req, res) => {
  res.json({ message: '管理员或运营人员操作' });
});
```

### 前端组件

#### WithPermission
基于权限显示组件

```jsx
<WithPermission permission="manage_users">
  <AdminPanel />
</WithPermission>
```

#### WithRole
基于角色显示组件

```jsx
<WithRole roles={['admin', 'operator']}>
  <ManagementTools />
</WithRole>
```

#### PermissionButton
权限按钮组件

```jsx
<PermissionButton 
  permission="edit_fund"
  className="btn-primary"
  onClick={handleEdit}
>
  编辑基金
</PermissionButton>
```

## 🔄 扩展功能

### 1. 动态权限管理
- 支持运行时添加/修改权限
- 支持角色权限动态调整

### 2. 权限继承
- 支持角色继承关系
- 支持权限组管理

### 3. 审计日志
- 记录权限访问日志
- 支持权限变更追踪

## 🛡️ 安全特性

### 1. 权限缓存
- 用户权限信息缓存机制
- 减少数据库查询次数

### 2. 权限刷新
- 支持权限实时刷新
- 用户权限变更即时生效

### 3. 错误处理
- 完善的异常处理机制
- 详细的错误日志记录

## 📊 使用示例

### 后端路由保护

```javascript
const express = require('express');
const { checkPermission } = require('../middleware/permissionMiddleware');

const router = express.Router();

// 受保护的基金管理接口
router.get('/fund', checkPermission('view_fund'), async (req, res) => {
  // 实现查看基金逻辑
  res.json({ funds: [] });
});

router.put('/fund/:id', checkPermission('edit_fund'), async (req, res) => {
  // 实现编辑基金逻辑
  res.json({ success: true });
});

module.exports = router;
```

### 前端权限控制

```jsx
import React from 'react';
import { WithPermission, PermissionButton } from '../components/WithPermission';

const FundManagement = () => {
  const handleEdit = () => {
    // 编辑基金逻辑
  };

  const handleExport = () => {
    // 导出报表逻辑
  };

  return (
    <div>
      <h2>基金管理</h2>
      
      {/* 只有管理员才能看到编辑按钮 */}
      <WithPermission permission="edit_fund">
        <button onClick={handleEdit}>编辑基金</button>
      </WithPermission>
      
      {/* 只有运营人员和管理员才能看到导出按钮 */}
      <WithPermission permission="export_report">
        <PermissionButton 
          permission="export_report"
          onClick={handleExport}
        >
          导出报表
        </PermissionButton>
      </WithPermission>
    </div>
  );
};

export default FundManagement;
```

## 🐛 常见问题

### 1. 权限未生效
- 检查用户是否已分配角色
- 检查角色是否已分配权限
- 检查中间件是否正确应用

### 2. 权限刷新延迟
- 清除用户权限缓存
- 重新获取用户权限信息
- 检查权限更新逻辑

### 3. 权限配置错误
- 检查权限ID是否正确
- 检查角色权限映射是否正确
- 检查数据库记录是否完整

## 📅 维护计划

### 定期维护
- 每月审查权限配置
- 每季度审计权限使用情况
- 每年优化权限模型

### 更新日志
- 记录权限变更历史
- 跟踪权限使用统计
- 分析权限安全风险

---
*文档更新时间: 2025-10-24*
*权限系统版本: 1.0.0*