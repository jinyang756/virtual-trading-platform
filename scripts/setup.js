#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// 创建目录结构
async function createDirectoryStructure() {
  const dirs = [
    'data/backups',
    'public/css',
    'public/js',
    'public/assets/images',
    'public/assets/fonts',
    'public/generated/templates',
    'templates/components',
    'docs',
    'tests/unit',
    'tests/integration',
    'tests/fixtures',
    'scripts'
  ];

  for (const dir of dirs) {
    const dirPath = path.join(__dirname, '..', dir);
    try {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`创建目录: ${dir}`);
    } catch (error) {
      console.error(`创建目录失败 ${dir}:`, error.message);
    }
  }
}

// 创建初始数据文件
async function createInitialDataFiles() {
  const dataFiles = [
    { path: 'data/users.json', content: '[]' },
    { path: 'data/configs.json', content: '{\n  "tradingFee": 0.001,\n  "minTradeAmount": 10,\n  "maxLeverage": 10,\n  "maintenanceTime": []\n}' },
    { path: 'data/transactions.json', content: '[]' },
    { path: 'data/positions.json', content: '[]' },
    { path: 'data/market.json', content: '{\n  "BTC": {\n    "price": 35000,\n    "history": [],\n    "lastUpdate": "2023-12-01T00:00:00.000Z"\n  },\n  "ETH": {\n    "price": 2000,\n    "history": [],\n    "lastUpdate": "2023-12-01T00:00:00.000Z"\n  }\n}' }
  ];

  for (const file of dataFiles) {
    const filePath = path.join(__dirname, '..', file.path);
    try {
      await fs.writeFile(filePath, file.content);
      console.log(`创建数据文件: ${file.path}`);
    } catch (error) {
      console.error(`创建数据文件失败 ${file.path}:`, error.message);
    }
  }
}

// 创建初始配置文件
async function createInitialConfigFiles() {
  const configFiles = [
    { 
      path: '.env', 
      content: '# 应用配置\nPORT=3001\nNODE_ENV=development\n' 
    },
    {
      path: 'config.js',
      content: 'module.exports = {\\n  port: process.env.PORT || 3001,\\n  dataPath: \'./data\',\\n  backupPath: \'./data/backups\',\\n  publicPath: \'./public\',\\n  templatePath: \'./templates\'\\n};'
    }
  ];

  for (const file of configFiles) {
    const filePath = path.join(__dirname, '..', file.path);
    try {
      await fs.writeFile(filePath, file.content);
      console.log(`创建配置文件: ${file.path}`);
    } catch (error) {
      console.error(`创建配置文件失败 ${file.path}:`, error.message);
    }
  }
}

// 主函数
async function main() {
  console.log('开始设置虚拟交易平台项目...');
  
  try {
    await createDirectoryStructure();
    await createInitialDataFiles();
    await createInitialConfigFiles();
    
    console.log('项目设置完成!');
  } catch (error) {
    console.error('设置过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 执行主函数
if (require.main === module) {
  main();
}

module.exports = {
  createDirectoryStructure,
  createInitialDataFiles,
  createInitialConfigFiles
};