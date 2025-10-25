module.exports = {
  port: 3002,
  dataPath: './data',
  backupPath: './data/backups',
  publicPath: './public',
  templatePath: './templates',
  jwtSecret: process.env.JWT_SECRET || 'virtual_trading_platform_secret_key_2025',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h'
};