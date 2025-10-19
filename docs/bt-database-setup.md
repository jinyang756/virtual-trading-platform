# 宝塔面板数据库配置指南

## 1. 安装宝塔面板

### CentOS系统
```bash
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh
```

### Ubuntu/Debian系统
```bash
wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && bash install.sh
```

## 2. 登录宝塔面板

安装完成后，会显示面板地址、用户名和密码：
```
==================================================================
Congratulations! Installed successfully!
==================================================================
外网面板地址: http://your_server_ip:8888/your_panel_path
内网面板地址: http://your_local_ip:8888/your_panel_path
username: your_username
password: your_password
==================================================================
```

## 3. 创建MySQL数据库

1. 登录宝塔面板
2. 点击左侧菜单"数据库"
3. 点击"添加数据库"
4. 填写以下信息：
   - 数据库名：`virtual_trading_platform`
   - 用户名：`trading_user`
   - 密码：设置一个强密码
   - 访问权限：本地服务器（localhost）

## 4. 数据库用户权限配置

1. 在宝塔面板中进入"数据库"页面
2. 点击刚创建的数据库用户
3. 设置合适的权限：
   - SELECT
   - INSERT
   - UPDATE
   - DELETE
   - CREATE
   - DROP
   - INDEX
   - ALTER

## 5. 数据库连接配置

在项目中配置数据库连接信息：

```javascript
// config/database.js
module.exports = {
  mysql: {
    host: 'localhost',           // 宝塔面板MySQL默认地址
    port: 3306,                  // MySQL默认端口
    user: 'trading_user',        // 刚创建的数据库用户
    password: 'your_password',   // 数据库用户密码
    database: 'virtual_trading_platform', // 数据库名
    connectionLimit: 10
  }
};
```

## 6. 安装项目依赖

在项目根目录执行：
```bash
npm install mysql2
```

## 7. 初始化数据库表

运行数据库初始化脚本：
```bash
node scripts/init-database.js
```

## 8. 宝塔面板数据库管理功能

### 8.1 数据库备份
1. 在宝塔面板中进入"数据库"页面
2. 点击数据库名称
3. 点击"备份"按钮
4. 选择备份方式（本地备份或远程备份）

### 8.2 数据库优化
1. 在宝塔面板中进入"数据库"页面
2. 点击"优化"按钮
3. 选择要优化的数据库表

### 8.3 数据库监控
1. 在宝塔面板中进入"监控"页面
2. 查看MySQL运行状态和性能指标

## 9. 安全配置

### 9.1 修改MySQL默认端口
1. 在宝塔面板中进入"数据库"页面
2. 点击"全局设置"
3. 修改端口号（建议修改为非默认端口）

### 9.2 设置防火墙规则
1. 在宝塔面板中进入"安全"页面
2. 添加防火墙规则，只允许特定IP访问数据库端口

### 9.3 定期更新
1. 定期更新宝塔面板到最新版本
2. 定期更新MySQL到最新稳定版本

## 10. 常见问题解决

### 10.1 连接数据库失败
- 检查数据库服务是否启动
- 检查数据库用户权限配置
- 检查防火墙设置

### 10.2 数据库性能问题
- 检查慢查询日志
- 优化数据库索引
- 调整MySQL配置参数

### 10.3 数据库备份恢复
1. 在宝塔面板中进入"数据库"页面
2. 点击数据库名称
3. 点击"备份"页面
4. 选择备份文件进行恢复

## 11. 宝塔面板API使用（可选）

如果需要通过程序管理数据库，可以使用宝塔面板API：

```javascript
// 示例：通过API创建数据库
const axios = require('axios');

const createDatabase = async () => {
  const response = await axios.post('http://your_panel_url:8888/api/db/add', {
    name: 'virtual_trading_platform',
    username: 'trading_user',
    password: 'your_password'
  }, {
    headers: {
      'Authorization': 'your_api_token'
    }
  });
  
  return response.data;
};
```

## 12. 监控和告警

### 12.1 设置数据库监控
1. 在宝塔面板中安装"监控"插件
2. 配置MySQL监控项
3. 设置告警阈值

### 12.2 日志管理
1. 在宝塔面板中进入"日志"页面
2. 查看MySQL错误日志
3. 分析慢查询日志

通过以上步骤，您就可以成功使用宝塔面板来管理虚拟交易平台的数据库了。