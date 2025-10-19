# API接口文档

## 概述

本文档描述了虚拟交易平台内部使用的API接口，仅供系统前后端交互使用，不对外公开。

## 用户管理接口

### 注册用户
- **URL**: `/api/users/register`
- **方法**: `POST`
- **描述**: 注册新用户（内部接口）

### 用户登录
- **URL**: `/api/users/login`
- **方法**: `POST`
- **描述**: 用户登录（内部接口）

### 获取用户信息
- **URL**: `/api/users/:id`
- **方法**: `GET`
- **描述**: 获取指定用户信息（内部接口）

## 传统交易接口

### 创建订单
- **URL**: `/api/trade/order`
- **方法**: `POST`
- **描述**: 创建新订单（内部接口）

### 获取订单状态
- **URL**: `/api/trade/order/:id`
- **方法**: `GET`
- **描述**: 获取订单状态（内部接口）

### 获取用户持仓
- **URL**: `/api/trade/positions/:userId`
- **方法**: `GET`
- **描述**: 获取用户持仓（内部接口）

## 合约交易接口

### 获取合约市场数据
- **URL**: `/api/trade/contracts/market/:symbolId`
- **方法**: `GET`
- **描述**: 获取指定合约的市场数据（内部接口）

### 获取所有合约市场数据
- **URL**: `/api/trade/contracts/market`
- **方法**: `GET`
- **描述**: 获取所有合约的市场数据（内部接口）

### 下合约订单
- **URL**: `/api/trade/contracts/order`
- **方法**: `POST`
- **描述**: 下合约订单（内部接口）

### 获取用户合约持仓
- **URL**: `/api/trade/contracts/positions/:userId`
- **方法**: `GET`
- **描述**: 获取用户合约持仓（内部接口）

## 二元期权接口

### 获取二元期权策略
- **URL**: `/api/trade/binary/strategies`
- **方法**: `GET`
- **描述**: 获取二元期权策略（内部接口）

### 下二元期权订单
- **URL**: `/api/trade/binary/order`
- **方法**: `POST`
- **描述**: 下二元期权订单（内部接口）

## 私募基金接口

### 获取基金信息
- **URL**: `/api/trade/funds/:fundId`
- **方法**: `GET`
- **描述**: 获取基金信息（内部接口）

### 认购基金
- **URL**: `/api/trade/funds/subscribe`
- **方法**: `POST`
- **描述**: 认购基金（内部接口）

### 赎回基金
- **URL**: `/api/trade/funds/redeem`
- **方法**: `POST`
- **描述**: 赎回基金（内部接口）

## 市场数据接口

### 获取市场数据
- **URL**: `/api/market/data`
- **方法**: `GET`
- **描述**: 获取市场数据（内部接口）

## 管理接口

### 管理员登录
- **URL**: `/api/admin/login`
- **方法**: `POST`
- **描述**: 管理员登录（内部接口）

### 获取所有用户
- **URL**: `/api/admin/users`
- **方法**: `GET`
- **描述**: 获取所有用户（内部接口）

### 获取系统配置
- **URL**: `/api/admin/config`
- **方法**: `GET`
- **描述**: 获取系统配置（内部接口）
