# 权限审计仪表盘使用指南

## 🎯 功能概述

权限审计仪表盘提供对系统权限使用情况的全面监控和分析，包括：
- 最近30天权限变更记录
- 角色分布统计
- 权限使用频率分析
- 实时审计概览

## 🚀 快速开始

### 1. 访问仪表盘

权限审计仪表盘可通过以下方式访问：
- 前端页面：`/audit/dashboard`
- API接口：`/api/audit/overview`

### 2. 权限要求

访问权限审计仪表盘需要以下权限：
- `view_audit_dashboard` - 查看审计仪表盘

## 🧩 核心功能

### 1. 权限变更记录

展示最近30天内的权限变更历史，包括：
- 角色权限新增/移除
- 用户角色变更
- 权限创建/删除

#### API接口
```
GET /api/audit/permission-changes
```

响应示例：
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "role": "admin",
      "permission": "export_report",
      "action": "added",
      "timestamp": "2025-10-24T18:11:00Z"
    }
  ]
}
```

### 2. 角色分布统计

展示系统中各角色的用户分布情况：
- 管理员数量
- 运营人员数量
- 投资者数量

#### API接口
```
GET /api/audit/role-distribution
```

响应示例：
```json
{
  "success": true,
  "data": {
    "admin": 3,
    "operator": 15,
    "investor": 120
  }
}
```

### 3. 权限使用频率

分析各权限的使用频率，帮助识别：
- 高频使用的权限
- 很少使用的权限
- 权限使用趋势

#### API接口
```
GET /api/audit/permission-usage
```

响应示例：
```json
{
  "success": true,
  "data": [
    {
      "permission": "view_fund",
      "count": 1250
    }
  ]
}
```

### 4. 审计概览

提供权限系统的整体概览信息：
- 总角色数
- 总权限数
- 总用户数
- 最近变更数

#### API接口
```
GET /api/audit/overview
```

响应示例：
```json
{
  "success": true,
  "data": {
    "totalRoles": 3,
    "totalPermissions": 10,
    "totalUsers": 138,
    "recentChanges": 3,
    "lastUpdated": "2025-10-24T18:11:00Z"
  }
}
```

## 📊 前端组件

### PermissionAuditDashboard

权限审计仪表盘React组件，包含以下子组件：

#### RecentChangesTable
展示最近权限变更记录的表格组件

#### RoleDistributionChart
展示角色分布的图表组件

#### PermissionUsageChart
展示权限使用频率的图表组件

#### AuditOverview
展示审计概览信息的组件

## 🔧 技术实现

### 后端实现

权限审计功能通过以下文件实现：
- `src/routes/audit.js` - API路由
- `src/services/permissionChangeListener.js` - 权限变更监听器
- `scripts/permission-change-sync.js` - 权限变更同步脚本

### 前端实现

前端组件通过以下文件实现：
- `web/src/components/PermissionAuditDashboard.jsx` - 仪表盘主组件
- `web/src/hooks/useUser.js` - 用户权限Hook

## 🔄 数据源

### 实时数据
- 权限变更事件监听
- 用户操作日志分析

### 历史数据
- 权限变更日志文件
- 用户角色历史记录
- 权限使用统计

## 🛡️ 安全特性

### 访问控制
- 基于RBAC的权限控制
- API接口权限校验
- 前端组件权限控制

### 数据保护
- 敏感信息脱敏
- 访问日志记录
- 异常操作监控

## 📈 性能优化

### 缓存机制
- 权限数据缓存
- 统计结果缓存
- 图表数据缓存

### 异步加载
- 分页加载变更记录
- 按需加载图表数据
- 背景任务处理

## 🐛 故障排除

### 常见问题

1. **无法访问仪表盘**
   - 检查用户是否拥有`view_audit_dashboard`权限
   - 确认API服务是否正常运行

2. **数据不更新**
   - 检查权限变更监听器是否正常工作
   - 确认日志文件是否可写

3. **性能问题**
   - 检查缓存配置
   - 优化数据库查询

### 日志查看

```bash
# 查看权限变更日志
tail -f logs/permission-change.log

# 查看应用日志
tail -f logs/app.log
```

## 📅 维护计划

### 日常维护
- 监控权限变更事件
- 检查数据同步状态
- 审查异常访问记录

### 定期维护
- 每月清理过期日志
- 每季度分析权限使用情况
- 每年优化审计功能

## 📞 支持与帮助

如遇到问题，请参考：
1. 权限系统文档：docs/PERMISSION_SYSTEM.md
2. API文档：docs/API.md
3. 错误日志：logs/error.log

---
*文档更新时间: 2025-10-24*
*权限审计仪表盘版本: 1.0.0*