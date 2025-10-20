const { executeQuery } = require('./connection');

// 创建数据库表
const createTables = async () => {
  try {
    // 创建用户表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        balance DECIMAL(15,2) DEFAULT 100000.00,
        role_id VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT NULL
      )
    `);
    
    // 创建角色表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS roles (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        permissions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT NULL
      )
    `);
    
    // 创建交易记录表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        asset VARCHAR(20) NOT NULL,
        type VARCHAR(10) NOT NULL, -- BUY or SELL
        quantity DECIMAL(15,2) NOT NULL,
        price DECIMAL(15,2) NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_asset (asset),
        INDEX idx_timestamp (timestamp)
      )
    `);
    
    // 创建持仓表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS positions (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        asset VARCHAR(20) NOT NULL,
        quantity DECIMAL(15,2) NOT NULL,
        avg_price DECIMAL(15,2) NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_asset (asset)
      )
    `);
    
    // 创建合约交易订单表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS contract_orders (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        symbol_id VARCHAR(20) NOT NULL,
        direction VARCHAR(10) NOT NULL, -- LONG or SHORT
        amount DECIMAL(15,2) NOT NULL,
        leverage INT NOT NULL,
        status VARCHAR(20) NOT NULL, -- PENDING, FILLED, CANCELLED
        entry_price DECIMAL(15,2),
        exit_price DECIMAL(15,2),
        profit_loss DECIMAL(15,2),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_symbol_id (symbol_id),
        INDEX idx_status (status)
      )
    `);
    
    // 创建二元期权订单表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS binary_orders (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        strategy_id VARCHAR(20) NOT NULL,
        direction VARCHAR(10) NOT NULL, -- CALL or PUT
        investment DECIMAL(15,2) NOT NULL,
        status VARCHAR(20) NOT NULL, -- ACTIVE, SETTLED, EXPIRED
        entry_price DECIMAL(15,2),
        settle_price DECIMAL(15,2),
        payout DECIMAL(15,2),
        profit_loss DECIMAL(15,2),
        order_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expire_time DATETIME NOT NULL,
        settle_time DATETIME NULL DEFAULT NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_strategy_id (strategy_id),
        INDEX idx_status (status)
      )
    `);
    
    // 创建基金交易记录表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS fund_transactions (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        fund_id VARCHAR(20) NOT NULL,
        type VARCHAR(10) NOT NULL, -- SUBSCRIBE or REDEEM
        amount DECIMAL(15,2),
        shares DECIMAL(15,2),
        nav DECIMAL(15,2),
        fee DECIMAL(15,2),
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_fund_id (fund_id),
        INDEX idx_timestamp (timestamp)
      )
    `);
    
    // 创建基金持仓表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS fund_positions (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        fund_id VARCHAR(20) NOT NULL,
        shares DECIMAL(15,2) NOT NULL,
        avg_nav DECIMAL(15,2) NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_fund_id (fund_id)
      )
    `);
    
    // 创建用户关注关系表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS user_follows (
        id VARCHAR(50) PRIMARY KEY,
        follower_id VARCHAR(50) NOT NULL,
        followed_id VARCHAR(50) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_follower_id (follower_id),
        INDEX idx_followed_id (followed_id),
        UNIQUE KEY unique_follow (follower_id, followed_id)
      )
    `);
    
    // 创建交易分享表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS trade_shares (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        trade_id VARCHAR(50) NOT NULL,
        content TEXT,
        likes_count INT DEFAULT 0,
        comments_count INT DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_trade_id (trade_id),
        INDEX idx_created_at (created_at)
      )
    `);
    
    // 创建交易分享点赞表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS trade_share_likes (
        id VARCHAR(50) PRIMARY KEY,
        share_id VARCHAR(50) NOT NULL,
        user_id VARCHAR(50) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_share_id (share_id),
        INDEX idx_user_id (user_id),
        UNIQUE KEY unique_like (share_id, user_id)
      )
    `);
    
    // 创建交易分享评论表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS trade_share_comments (
        id VARCHAR(50) PRIMARY KEY,
        share_id VARCHAR(50) NOT NULL,
        user_id VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_share_id (share_id),
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at)
      )
    `);
    
    // 创建交易竞赛表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS trading_contests (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        prize_pool DECIMAL(15,2) DEFAULT 0.00,
        status VARCHAR(20) DEFAULT 'upcoming', -- upcoming, active, ended
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT NULL,
        INDEX idx_status (status),
        INDEX idx_start_time (start_time),
        INDEX idx_end_time (end_time)
      )
    `);
    
    // 创建竞赛参与者表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS contest_participants (
        id VARCHAR(50) PRIMARY KEY,
        contest_id VARCHAR(50) NOT NULL,
        user_id VARCHAR(50) NOT NULL,
        initial_balance DECIMAL(15,2) NOT NULL,
        current_balance DECIMAL(15,2) NOT NULL,
        rank INT DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT NULL,
        INDEX idx_contest_id (contest_id),
        INDEX idx_user_id (user_id),
        INDEX idx_rank (rank),
        UNIQUE KEY unique_participation (contest_id, user_id)
      )
    `);
    
    // 创建竞赛交易记录表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS contest_trades (
        id VARCHAR(50) PRIMARY KEY,
        contest_id VARCHAR(50) NOT NULL,
        participant_id VARCHAR(50) NOT NULL,
        trade_type VARCHAR(10) NOT NULL, -- BUY, SELL
        asset VARCHAR(20) NOT NULL,
        quantity DECIMAL(15,2) NOT NULL,
        price DECIMAL(15,2) NOT NULL,
        profit_loss DECIMAL(15,2) DEFAULT 0.00,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_contest_id (contest_id),
        INDEX idx_participant_id (participant_id),
        INDEX idx_asset (asset),
        INDEX idx_timestamp (timestamp)
      )
    `);
    
    console.log('数据库表创建成功');
  } catch (error) {
    console.error('创建数据库表时出错:', error);
    throw error;
  }
};

// 初始化数据库
const initDatabase = async () => {
  try {
    console.log('开始初始化数据库...');
    await createTables();
    console.log('数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
};

module.exports = {
  initDatabase
};