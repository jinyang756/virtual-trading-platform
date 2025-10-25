# PM2 部署指南

本文档介绍如何使用 PM2 部署和管理虚拟交易平台。

## 什么是 PM2

PM2 是一个先进的 Node.js 进程管理器，具有内置的负载均衡器。它允许您永久保持应用程序活跃，无需停机即可重新加载它们，并促进常见的系统管理任务。

## 安装 PM2

```bash
# 全局安装 PM2
npm install pm2 -g
```

## 启动应用

项目根目录下提供了 `ecosystem.config.js` 配置文件，包含四个应用：

1. `fund-server` - 主服务
2. `fund-cron` - 定时任务（每日更新基金净值）
3. `contract-market` - 合约定价更新服务
4. `option-market` - 期权定价更新服务

```bash
# 启动所有应用
pm2 start ecosystem.config.js

# 或者使用 npm 脚本
npm run pm2-start
```

## 常用 PM2 命令

| 命令 | 描述 |
|------|------|
| `pm2 list` | 显示所有正在运行的进程 |
| `pm2 logs` | 显示所有应用的日志 |
| `pm2 logs fund-server` | 显示主服务日志 |
| `pm2 logs fund-cron` | 显示基金定时任务日志 |
| `pm2 logs contract-market` | 显示合约定价服务日志 |
| `pm2 logs option-market` | 显示期权定价服务日志 |
| `pm2 stop fund-server` | 停止主服务 |
| `pm2 restart fund-server` | 重启主服务 |
| `pm2 delete fund-server` | 删除主服务 |
| `pm2 monit` | 监控所有进程 |

## 开机自启

```bash
# 保存当前进程列表
pm2 save

# 创建开机自启脚本
pm2 startup
```

## 配置文件说明

### ecosystem.config.js

```javascript
module.exports = {
  apps: [
    {
      name: 'fund-server',           // 主服务名称
      script: './server.js',         // 主服务入口文件
      cwd: './',                     // 工作目录
      exec_mode: 'fork',             // 单进程模式
      autorestart: true,             // 崩溃自动重启
      watch: false,                  // 是否监听文件变化
      max_memory_restart: '512M',    // 内存限制
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'fund-cron',             // 定时任务名称
      script: './jobs/updateFundNetValue.js', // 定时任务入口
      cwd: './',
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'contract-market',       // 合约行情服务
      script: './jobs/contractMarketUpdater.js', // 合约行情更新任务入口
      cwd: './',
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'option-market',         // 期权行情服务
      script: './jobs/optionMarketUpdater.js', // 期权行情更新任务入口
      cwd: './',
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

## 定时任务说明

1. `fund-cron` 应用是一个定时任务，每天凌晨2点执行基金净值更新。
   - 定时任务脚本: `jobs/updateFundNetValue.js`

2. `contract-market` 应用是一个定时任务，每分钟更新合约市场数据。
   - 定时任务脚本: `jobs/contractMarketUpdater.js`

3. `option-market` 应用是一个定时任务，每分钟更新期权市场数据。
   - 定时任务脚本: `jobs/optionMarketUpdater.js`

## 日志管理

PM2 会自动管理应用日志，日志文件默认存储在 `~/.pm2/logs/` 目录下。

```bash
# 查看日志
pm2 logs

# 查看特定应用日志
pm2 logs fund-server

# 清空日志
pm2 flush
```

## 监控

```bash
# 实时监控
pm2 monit
```

这将打开一个终端仪表板，显示每个进程的 CPU 和内存使用情况。

## 故障排除

### 应用无法启动

1. 检查日志: `pm2 logs`
2. 确认端口未被占用
3. 检查环境变量配置

### 定时任务不执行

1. 检查定时任务日志: `pm2 logs fund-cron`
2. 确认定时规则正确
3. 检查系统时间是否正确