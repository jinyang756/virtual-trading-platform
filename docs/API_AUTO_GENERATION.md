# 接口文档自动生成器使用指南

## 📋 概述

接口文档自动生成器是一个自动化工具，可以从 Swagger/OpenAPI 文档生成 TypeScript 类型定义和 API 客户端代码，实现"文档即代码"的理念。

## 🚀 快速开始

### 1. 运行自动化生成

```bash
npm run generate-api-docs
```

该命令将执行以下操作：
1. 下载 Swagger 文档
2. 生成 TypeScript 类型和 API 客户端
3. 记录生成日志

### 2. 生成的文件

生成的文件位于 `src/api/` 目录下：
- `data-contracts.ts` - TypeScript 数据类型定义
- `http-client.ts` - HTTP 客户端实现
- `api.ts` - API 客户端封装

## 🧩 功能特性

### 自动生成 TypeScript 接口类型
- 基于 Swagger Schema 定义自动生成接口类型
- 支持复杂嵌套对象和数组类型
- 保留字段注释和格式信息

### 自动生成 API 请求方法
- 为每个 API 端点生成类型安全的请求方法
- 支持 GET、POST、PUT、DELETE 等 HTTP 方法
- 自动处理请求参数和响应类型

### 支持 Axios 封装
- 基于 Axios 的 HTTP 客户端实现
- 支持请求拦截和响应处理
- 易于扩展和自定义

## 🛠️ 使用示例

### 1. 导入生成的 API 客户端

```typescript
import { Api } from '../api/api';

const api = new Api();
```

### 2. 调用 API 方法

```typescript
// 获取基金列表
const funds = await api.api.fundList();

// 获取特定基金信息
const fund = await api.api.fundDetail('fund-id-123');

// 用户登录
const loginResult = await api.api.usersLoginCreate({
  username: 'user123',
  password: 'password123'
});
```

### 3. 使用数据类型

```typescript
import { Fund, User } from '../api/data-contracts';

const fund: Fund = {
  fund_id: 'fund-001',
  name: '示例基金',
  fund_manager: '基金经理',
  risk_level: '中等风险',
  nav: 1.2345,
  min_investment: 1000,
  management_fee: 0.015,
  performance_fee: 0.1,
  total_return: 0.15,
  update_time: new Date().toISOString()
};
```

## ⚙️ 配置说明

### 任务流配置

接口文档自动生成器基于以下任务流配置：

```json
{
  "name": "generate-api-docs",
  "description": "从 Swagger 文档自动生成 TypeScript 类型和 API 请求代码",
  "triggers": ["schema-updated", "model-changed"],
  "steps": [
    {
      "action": "download-swagger",
      "args": {
        "url": "http://localhost:3001/api-docs/swagger.json",
        "output": "docs/swagger.json"
      }
    },
    {
      "action": "run-command",
      "args": {
        "cmd": "npx swagger-typescript-api -p docs/swagger.json -o src/api -n api.ts"
      }
    },
    {
      "action": "log",
      "args": ["✅ 接口文档已自动生成并同步 TypeScript 类型"]
    }
  ]
}
```

## 📁 目录结构

```
src/api/
├── data-contracts.ts    # TypeScript 数据类型定义
├── http-client.ts       # HTTP 客户端实现
├── api.ts               # API 客户端封装
docs/
├── swagger.json         # Swagger 文档
scripts/
├── api-docs-generator.js # 自动化生成脚本
```

## 🔄 自动化集成

### 监听 Schema 更新

当数据模型发生变化时，可以通过以下方式触发自动重新生成：

1. 手动运行: `npm run generate-api-docs`
2. 在 CI/CD 流程中集成
3. 通过 Git hooks 在提交时检查并生成

### 与 PM2 集成

可以将 API 文档生成集成到 PM2 的生态系统配置中：

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'api-docs-generator',
      script: 'scripts/api-docs-generator.js',
      watch: ['docs/swagger.json'],
      ignore_watch: ['node_modules', 'src/api'],
      env: {
        NODE_ENV: 'development'
      }
    }
  ]
};
```

## 🔧 故障排除

### 常见问题

1. **内存不足错误**
   - 问题: 在生成大型 API 文档时可能遇到内存不足
   - 解决方案: 增加 Node.js 内存限制
   ```bash
   node --max-old-space-size=4096 scripts/api-docs-generator.js
   ```

2. **生成的类型不正确**
   - 问题: Swagger 文档格式可能有问题
   - 解决方案: 验证 Swagger 文档格式是否正确

3. **API 客户端调用失败**
   - 问题: 基础 URL 配置不正确
   - 解决方案: 检查 `http-client.ts` 中的 baseURL 配置

## 📚 相关资源

- [Swagger TypeScript API](https://github.com/acacode/swagger-typescript-api)
- [Axios 文档](https://axios-http.com/)
- [OpenAPI 规范](https://swagger.io/specification/)

---
*文档更新时间: 2025-10-24*