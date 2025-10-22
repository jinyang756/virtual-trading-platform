module.exports = {
  apps: [
    {
      name: 'fund-server',
      script: 'apps/fund-server/index.js',
      env: { PORT: 3001 }
    },
    {
      name: 'contract-market',
      script: 'apps/contract-market/index.js',
      env: { PORT: 3002 }
    },
    {
      name: 'option-market',
      script: 'apps/option-market/index.js',
      env: { PORT: 3003 }
    },
    {
      name: 'fund-cron',
      script: 'apps/cron-jobs/updateFundNetValue.js',
      env: { PORT: 3101 }
    }
  ]
};