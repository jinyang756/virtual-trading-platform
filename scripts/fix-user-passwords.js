const User = require('../src/models/User');
const bcrypt = require('bcrypt');
const { executeQuery } = require('../src/database/connection');

async function fixUserPasswords() {
  try {
    console.log('修复用户密码哈希...');
    
    // 获取所有用户
    const users = await executeQuery('SELECT * FROM users');
    console.log(`找到 ${users.length} 个用户`);
    
    for (const user of users) {
      console.log(`\n检查用户: ${user.username} (${user.id})`);
      
      // 测试当前哈希
      const testPassword = 'password123';
      let isValid = false;
      
      try {
        isValid = await bcrypt.compare(testPassword, user.password_hash);
        console.log(`  当前哈希验证结果: ${isValid}`);
      } catch (err) {
        console.log(`  哈希验证出错: ${err.message}`);
      }
      
      // 如果验证失败，重新生成哈希
      if (!isValid) {
        console.log(`  重新生成哈希...`);
        const newPasswordHash = await bcrypt.hash(testPassword, 10);
        
        // 更新数据库
        await executeQuery(
          'UPDATE users SET password_hash = ? WHERE id = ?', 
          [newPasswordHash, user.id]
        );
        
        console.log(`  用户 ${user.username} 的密码哈希已更新`);
        
        // 验证新哈希
        const newValid = await bcrypt.compare(testPassword, newPasswordHash);
        console.log(`  新哈希验证结果: ${newValid}`);
      }
    }
    
    console.log('\n所有用户密码哈希修复完成');
  } catch (error) {
    console.error('修复过程中出错:', error.message);
  } finally {
    process.exit(0);
  }
}

fixUserPasswords();