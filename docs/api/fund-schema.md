# 基金接口文档

## 概述

本文档描述了私募基金管理系统的核心数据结构和API接口。

## 数据表结构

### funds 表 (基金基本信息表)

| 字段名 | 类型 | 描述 | 是否必填 |
|--------|------|------|----------|
| fund_code | SingleLineText | 基金代码 | 是 |
| fund_name | SingleLineText | 基金名称 | 是 |
| net_value | Number | 当前净值 | 是 |
| date | Date | 净值日期 | 是 |
| fund_manager | SingleLineText | 基金经理 | 否 |
| risk_level | SingleSelect | 风险等级 | 否 |
| min_investment | Number | 最低投资金额 | 否 |
| management_fee | Number | 管理费 | 否 |
| performance_fee | Number | 业绩报酬 | 否 |
| total_return | Number | 总回报 | 否 |

### users 表 (系统用户表)

| 字段名 | 类型 | 描述 | 是否必填 |
|--------|------|------|----------|
| user_id | SingleLineText | 用户ID | 是 |
| username | SingleLineText | 用户名 | 是 |
| email | Email | 邮箱 | 是 |
| password | SingleLineText | 密码 | 是 |
| role | SingleLineText | 角色 | 否 |
| created_at | Date | 创建时间 | 是 |
| updated_at | Date | 更新时间 | 否 |

### roles 表 (系统角色定义表)

| 字段名 | 类型 | 描述 | 是否必填 |
|--------|------|------|----------|
| role_id | SingleLineText | 角色ID | 是 |
| role_name | SingleLineText | 角色名称 | 是 |
| description | LongText | 描述 | 否 |
| permissions | MultipleSelect | 权限列表 | 否 |

### permissions 表 (权限配置表)

| 字段名 | 类型 | 描述 | 是否必填 |
|--------|------|------|----------|
| permission_id | SingleLineText | 权限ID | 是 |
| permission_key | SingleLineText | 权限标识 | 是 |
| permission_name | SingleLineText | 权限名称 | 是 |
| resource | SingleLineText | 资源 | 是 |
| action | SingleLineText | 操作 | 是 |

### fund_net_value 表 (基金净值历史数据)

| 字段名 | 类型 | 描述 | 是否必填 |
|--------|------|------|----------|
| fund_code | SingleLineText | 基金代码 | 是 |
| date | Date | 净值日期 | 是 |
| nav | Number | 净值 | 是 |
| created_at | Date | 创建时间 | 是 |

## 字段变更历史

# 字段变更日志

生成时间: 2025-10-24T09:36:41.599Z

## 变更 #1
- 类型: field-renamed
- 时间: 2025-10-24T09:36:41.580Z
- 表名: funds
- 字段重命名: nav_history → net_value_history
- 描述: 重命名字段以提高语义清晰度

## 变更 #2
- 类型: field-type-changed
- 时间: 2025-10-24T09:36:41.582Z
- 表名: funds
- 字段类型变更: risk_level (SingleLineText → SingleSelect)
- 描述: 更改字段类型以支持预定义选项

## 变更 #3
- 类型: field-removed
- 时间: 2025-10-24T09:36:41.582Z
- 表名: funds
- 字段移除: old_field
- 描述: 移除已废弃的字段