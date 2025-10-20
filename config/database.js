module.exports = {
  // MySQL数据库配置
  mysql: {
    host: 'localhost',
    port: 3306,
    user: 'trading_user',
    password: 'trading_password',
    database: 'virtual_trading_platform',
    connectionLimit: 10
  },
  
  // MySQL从库配置（读写分离）
  mysqlSlaves: [
    {
      host: 'localhost',
      port: 3307,
      user: 'trading_user',
      password: 'trading_password',
      database: 'virtual_trading_platform',
      connectionLimit: 10
    }
  ],
  
  // PostgreSQL数据库配置（可选）
  postgresql: {
    host: 'localhost',
    port: 5432,
    user: 'trading_user',
    password: 'trading_password',
    database: 'virtual_trading_platform'
  },
  
  // MongoDB配置（可选）
  mongodb: {
    uri: 'mongodb://localhost:27017/virtual_trading_platform'
  }
};