const mysql = require('mysql2');
const dbConfig = require('../../config/database');

// 创建连接池
const pool = mysql.createPool({
  host: dbConfig.mysql.host,
  user: dbConfig.mysql.user,
  password: dbConfig.mysql.password,
  database: dbConfig.mysql.database,
  port: dbConfig.mysql.port,
  connectionLimit: dbConfig.mysql.connectionLimit,
  charset: 'utf8mb4'
});

// 获取连接
const getConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
};

// 执行查询
const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    pool.execute(query, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// 关闭连接池
const closePool = () => {
  pool.end((err) => {
    if (err) {
      console.error('关闭数据库连接池时出错:', err);
    } else {
      console.log('数据库连接池已关闭');
    }
  });
};

module.exports = {
  getConnection,
  executeQuery,
  closePool,
  pool
};