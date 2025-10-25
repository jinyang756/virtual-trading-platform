module.exports = {
  apps: [
    {
      name: 'fund-server',
      script: 'apps/fund-server/index.js',
      env: { 
        PORT: 3001,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'contract-market',
      script: 'apps/contract-market/index.js',
      env: { 
        PORT: 3002,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'option-market',
      script: 'apps/option-market/index.js',
      env: { 
        PORT: 3003,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'fund-cron',
      script: 'apps/cron-jobs/updateFundNetValue.js',
      cron_restart: '0 2 * * *', // 每天凌晨2点运行
      env: { 
        PORT: 3101,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'contract-cron',
      script: 'apps/cron-jobs/contractMarketUpdater.js',
      cron_restart: '*/1 * * * *', // 每分钟运行一次
      env: { 
        PORT: 3102,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'option-cron',
      script: 'apps/cron-jobs/optionMarketUpdater.js',
      cron_restart: '*/1 * * * *', // 每分钟运行一次
      env: { 
        PORT: 3103,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'performance-alert-checker',
      script: 'scripts/performance-alert-checker.js',
      cron_restart: '*/5 * * * *', // 每5分钟运行一次
      env: { 
        NODE_ENV: 'production'
      }
    }
  ]
};