#!/usr/bin/env node

const BackupManager = require('../src/utils/backupManager');

// 恢复备份
async function restoreBackup(backupName) {
  try {
    console.log(`开始恢复备份: ${backupName}`);
    
    const backupPath = `backup_${backupName}`;
    await BackupManager.restoreFullBackup(backupPath);
    
    console.log('备份恢复完成!');
  } catch (error) {
    console.error('恢复备份时发生错误:', error.message);
    process.exit(1);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('用法: node restore.js <backup_name>');
    console.log('请提供要恢复的备份名称');
    process.exit(1);
  }
  
  const backupName = args[0];
  await restoreBackup(backupName);
}

// 执行主函数
if (require.main === module) {
  main();
}

module.exports = {
  restoreBackup
};