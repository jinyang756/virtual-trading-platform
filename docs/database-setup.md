# 数据库集成指南

## 使用宝塔面板管理数据库

### 1. 安装宝塔面板

```bash
wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && bash install.sh
```

### 2. 在宝塔面板中创建数据库

1. 登录宝塔面板
2. 进入"数据库"页面
3. 点击"添加数据库"
4. 设置数据库名称、用户名和密码
5. 选择数据库类型（推荐MySQL）

### 3. 项目数据库配置

在项目中添加数据库配置文件：

```javascript
// config/database.js
module.exports = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'virtual_trading_platform',
  port: 3306
};
```

### 4. 安装数据库驱动

```bash
npm install mysql2
```

### 5. 创建数据库连接

```javascript
// src/database/connection.js
const mysql = require('mysql2');
const dbConfig = require('../../config/database');

const connection = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port
});

connection.connect((err) => {
  if (err) {
    console.error('数据库连接失败: ' + err.stack);
    return;
  }
  console.log('数据库连接成功，连接ID: ' + connection.threadId);
});

module.exports = connection;
```

### 6. 修改数据模型以使用数据库

将原来基于文件的存储改为数据库存储：

```javascript
// src/models/Transaction.js
const db = require('../database/connection');

class Transaction {
  constructor(id, userId, asset, type, quantity, price) {
    this.id = id;
    this.userId = userId;
    this.asset = asset;
    this.type = type;
    this.quantity = quantity;
    this.price = price;
    this.timestamp = new Date();
  }

  // 保存交易记录到数据库
  async save() {
    const query = `
      INSERT INTO transactions (id, user_id, asset, type, quantity, price, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.userId,
      this.asset,
      this.type,
      this.quantity,
      this.price,
      this.timestamp
    ];

    return new Promise((resolve, reject) => {
      db.execute(query, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  // 从数据库查找交易记录
  static async findById(id) {
    const query = 'SELECT * FROM transactions WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      db.execute(query, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  // 查找用户的所有交易记录
  static async findByUserId(userId) {
    const query = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY timestamp DESC';
    
    return new Promise((resolve, reject) => {
      db.execute(query, [userId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = Transaction;
```

### 7. 创建数据库表结构

在宝塔面板的数据库管理中执行以下SQL语句创建表：

```sql
CREATE TABLE transactions (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  asset VARCHAR(20) NOT NULL,
  type VARCHAR(10) NOT NULL,
  quantity DECIMAL(15,2) NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  timestamp DATETIME NOT NULL
);

CREATE TABLE positions (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  asset VARCHAR(20) NOT NULL,
  quantity DECIMAL(15,2) NOT NULL,
  avg_price DECIMAL(15,2) NOT NULL,
  timestamp DATETIME NOT NULL
);

CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL
);
```

### 8. 更新控制器以使用数据库

```javascript
// src/controllers/tradeController.js
const Transaction = require('../models/Transaction');
const Position = require('../models/Position');
const { generateId } = require('../utils/codeGenerator');

// 创建订单
exports.createOrder = async (req, res) => {
  try {
    const { userId, asset, type, quantity, price } = req.body;
    
    // 创建交易记录
    const transactionId = generateId();
    const transaction = new Transaction(transactionId, userId, asset, type, quantity, price);
    await transaction.save();
    
    res.status(201).json({ 
      message: '订单创建成功', 
      orderId: transactionId,
      transaction 
    });
  } catch (error) {
    res.status(500).json({ error: '创建订单失败', details: error.message });
  }
};

// 获取订单状态
exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({ error: '订单不存在' });
    }
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: '获取订单信息失败', details: error.message });
  }
};

// 获取用户交易历史
exports.getTradeHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await Transaction.findByUserId(userId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: '获取交易历史失败', details: error.message });
  }
};
```

## 宝塔面板数据库管理优势

1. **图形化界面**：通过Web界面轻松管理数据库
2. **备份功能**：支持自动备份和手动备份
3. **安全管理**：提供防火墙和访问控制
4. **性能监控**：实时监控数据库性能
5. **远程访问**：支持远程数据库连接

## 注意事项

1. 确保数据库连接信息正确
2. 定期备份重要数据
3. 设置合适的数据库权限
4. 监控数据库性能和资源使用情况